"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/components/TelegramProvider";
import { supabase, User } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { isStandaloneDev, DEV_MOCK_TELEGRAM_USER, isForceDemoData } from "@/lib/dev";
import { getDemoUser } from "@/lib/demo-fixtures";

const SESSION_KEY = "influencer_user";

function buildMockUser(telegramId: number, userType: "blogger" | "client"): User {
  const now = new Date().toISOString();
  return {
    id: `dev-${telegramId}`,
    telegram_id: telegramId,
    telegram_username: "dev_local",
    first_name: "Dev",
    last_name: "User",
    photo_url: null,
    user_type: userType,
    full_name: "Dev User",
    bio: null,
    company_name: null,
    company_category: null,
    company_description: null,
    created_at: now,
    updated_at: now,
  };
}

export function useTelegramAuth() {
  const { user: tgUser, loading: tgLoading } = useTelegram();
  const [dbUser, setDbUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function authenticateUser() {
      if (tgLoading || !tgUser) {
        setLoading(false);
        return;
      }

      const useDevMockAuth = isStandaloneDev || tgUser.id === DEV_MOCK_TELEGRAM_USER.id;
      if (useDevMockAuth) {
        setLoading(true);
        try {
          let roleFromSession: "blogger" | "client" | null = null;
          try {
            const raw = localStorage.getItem(SESSION_KEY);
            if (raw) {
              const data = JSON.parse(raw) as { telegram_id?: number; user_type?: "blogger" | "client" };
              if (data.telegram_id === tgUser.id && data.user_type) {
                roleFromSession = data.user_type;
              }
            }
          } catch {
            /* ignore */
          }

          let nextUser: User | null = null;
          const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
          const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
          if (url && key) {
            try {
              const { data: row } = await supabase
                .from("users")
                .select("*")
                .eq("telegram_id", tgUser.id)
                .maybeSingle();
              if (row) {
                const r = row as User;
                nextUser = { ...r, user_type: roleFromSession ?? r.user_type };
              }
            } catch {
              /* ignore */
            }
          }

          if (!nextUser && isForceDemoData()) {
            const fx = getDemoUser(tgUser.id);
            if (fx && roleFromSession) {
              nextUser = { ...fx, user_type: roleFromSession };
            } else if (fx) {
              nextUser = fx;
            }
          }

          if (!nextUser && roleFromSession) {
            nextUser = buildMockUser(tgUser.id, roleFromSession);
          }

          setDbUser(nextUser);
        } finally {
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);

        const { data: existingUser, error: fetchError } = await supabase
          .from("users")
          .select("*")
          .eq("telegram_id", tgUser.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (existingUser) {
          setDbUser(existingUser);
          localStorage.setItem(
            SESSION_KEY,
            JSON.stringify({
              telegram_id: existingUser.telegram_id,
              user_type: existingUser.user_type,
            }),
          );
        }
      } catch (err: any) {
        console.error("Auth error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    authenticateUser();
  }, [tgUser, tgLoading]);

  const register = async (userType: "blogger" | "client") => {
    if (!tgUser) throw new Error("No Telegram user");

    const useDevMockAuth = isStandaloneDev || tgUser.id === DEV_MOCK_TELEGRAM_USER.id;
    if (useDevMockAuth) {
      let nextUser: User = buildMockUser(tgUser.id, userType);
      const fx = getDemoUser(tgUser.id);
      if (fx) {
        nextUser = { ...fx, user_type: userType };
      }
      setDbUser(nextUser);
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          telegram_id: tgUser.id,
          user_type: userType,
        }),
      );
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      if (url && key) {
        try {
          const { data: existing } = await supabase
            .from("users")
            .select("telegram_id")
            .eq("telegram_id", tgUser.id)
            .maybeSingle();
          if (existing) {
            await supabase
              .from("users")
              .update({ user_type: userType, updated_at: new Date().toISOString() })
              .eq("telegram_id", tgUser.id);
          } else {
            await supabase.from("users").insert({
              telegram_id: tgUser.id,
              telegram_username: tgUser.username || null,
              first_name: tgUser.first_name,
              last_name: tgUser.last_name || null,
              photo_url: tgUser.photo_url || null,
              user_type: userType,
              full_name:
                userType === "blogger"
                  ? `${tgUser.first_name} ${tgUser.last_name || ""}`.trim()
                  : null,
            });
          }
        } catch (e) {
          console.warn("[dev] Синхронизация роли с Supabase пропущена:", e);
        }
      }
      return nextUser;
    }

    try {
      setLoading(true);

      const userData = {
        telegram_id: tgUser.id,
        telegram_username: tgUser.username || null,
        first_name: tgUser.first_name,
        last_name: tgUser.last_name || null,
        photo_url: tgUser.photo_url || null,
        user_type: userType,
        ...(userType === "blogger" && {
          full_name: `${tgUser.first_name} ${tgUser.last_name || ""}`.trim(),
        }),
      };

      const { data, error } = await supabase
        .from("users")
        .upsert(userData, {
          onConflict: "telegram_id",
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) throw error;

      setDbUser(data);
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          telegram_id: data.telegram_id,
          user_type: data.user_type,
        }),
      );

      return data;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("influencer_user");
    setDbUser(null);
    router.push("/");
  };

  return {
    tgUser,
    dbUser,
    loading,
    error,
    register,
    logout,
    isAuthenticated: !!dbUser,
    isBlogger: dbUser?.user_type === "blogger",
    isClient: dbUser?.user_type === "client",
  };
}

"use client";

import { useEffect, useState } from "react";
import { useTelegram } from "@/components/TelegramProvider";
import { supabase, User } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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
            "influencer_user",
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
        "influencer_user",
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

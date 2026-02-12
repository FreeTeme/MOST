"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/config/database.config";
import type { SocialAccount } from "@/types";

export interface SocialFormData {
  platform: string;
  profile_url: string;
  followers: number;
  niche: string;
  analytics?: Record<string, unknown>;
}

export function useCreateSocial() {
  const router = useRouter();
  const { dbUser } = useTelegramAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSocial = useCallback(
    async (data: SocialFormData) => {
      if (!dbUser) {
        setError("Необходима авторизация");
        return;
      }
      if (!data.platform?.trim()) {
        setError("Укажите платформу");
        return;
      }
      if (!data.profile_url?.trim()) {
        setError("Укажите ссылку на профиль");
        return;
      }
      if (data.followers == null || Number(data.followers) < 0) {
        setError("Укажите число подписчиков");
        return;
      }
      if (!data.niche?.trim()) {
        setError("Укажите нишу");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const insert: Partial<SocialAccount> = {
          blogger_telegram_id: dbUser.telegram_id,
          platform: data.platform.trim(),
          profile_url: data.profile_url.trim(),
          followers: Number(data.followers) || 0,
          niche: data.niche.trim(),
          analytics: data.analytics ?? {},
          status: "active",
        };

        const { error: insertError } = await supabase
          .from(TABLES.social_accounts)
          .insert(insert);
        if (insertError) throw insertError;
        router.push("/items");
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Ошибка добавления соцсети";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dbUser, router]
  );

  return { createSocial, loading, error };
}

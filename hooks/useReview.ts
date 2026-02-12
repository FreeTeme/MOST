"use client";

import { useState, useCallback } from "react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/config/database.config";
import type { Review } from "@/types";

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export function useReview(targetTelegramId: number | undefined, onSuccess?: () => void) {
  const { dbUser } = useTelegramAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReview = useCallback(
    async (data: ReviewFormData) => {
      if (!dbUser || targetTelegramId == null) {
        setError("Недостаточно данных");
        return;
      }
      if (data.rating < 1 || data.rating > 5) {
        setError("Рейтинг от 1 до 5");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const insert: Partial<Review> = {
          rating: data.rating,
          comment: data.comment?.trim() || null,
          author_telegram_id: dbUser.telegram_id,
          target_telegram_id: targetTelegramId,
          order_id: null,
        };

        const { error: insertError } = await supabase
          .from(TABLES.reviews)
          .upsert(insert, {
            onConflict: "author_telegram_id,target_telegram_id",
          });
        if (insertError) throw insertError;
        onSuccess?.();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : "Ошибка отправки отзыва";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dbUser, targetTelegramId, onSuccess]
  );

  return { submitReview, loading, error };
}

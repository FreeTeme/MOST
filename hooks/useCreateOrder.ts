"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/config/database.config";
import type { Order } from "@/types";

export interface OrderFormData {
  title: string;
  description: string;
  category: string;
  budget_type: "money" | "barter";
  budget_amount: number | null;
  budget_currency: string;
  social_link: string;
}

export function useCreateOrder() {
  const router = useRouter();
  const { dbUser } = useTelegramAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = useCallback(
    async (data: OrderFormData) => {
      if (!dbUser) {
        setError("Необходима авторизация");
        return;
      }
      if (!data.title?.trim()) {
        setError("Укажите заголовок заказа");
        return;
      }
      if (!data.category?.trim()) {
        setError("Укажите категорию");
        return;
      }
      if (
        data.budget_type === "money" &&
        (data.budget_amount == null || Number(data.budget_amount) <= 0)
      ) {
        setError("Укажите сумму бюджета");
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const insert: Partial<Order> = {
          title: data.title.trim(),
          description: data.description?.trim() || null,
          category: data.category.trim(),
          budget_type: data.budget_type,
          budget_amount:
            data.budget_type === "money" && data.budget_amount != null
              ? Number(data.budget_amount)
              : null,
          budget_currency: data.budget_currency || "RUB",
          social_link: data.social_link?.trim() || null,
          status: "active",
          client_telegram_id: dbUser.telegram_id,
          applications_count: 0,
        };

        const { error: insertError } = await supabase
          .from(TABLES.orders)
          .insert(insert);
        if (insertError) throw insertError;
        router.push("/items");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Ошибка создания заказа";
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [dbUser, router]
  );

  return { createOrder, loading, error };
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { supabase } from "@/lib/supabase";
import { MY_ITEMS_CONFIG } from "@/config/pages.config";
import { TABLES } from "@/config/database.config";
import type { Order, SocialAccount } from "@/types";

type Item = Order | SocialAccount;

export function useItems() {
  const { role } = useRole();
  const { dbUser } = useTelegramAuth();
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  const config = role ? MY_ITEMS_CONFIG[role] : null;
  const telegramId = dbUser?.telegram_id ?? null;

  const fetchItems = useCallback(async () => {
    if (!config || telegramId == null) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (config.query === "orders") {
        const { data, error } = await supabase
          .from(TABLES.orders)
          .select("*")
          .eq("client_telegram_id", telegramId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setItems((data as Order[]) ?? []);
      } else {
        const { data, error } = await supabase
          .from(TABLES.social_accounts)
          .select("*")
          .eq("blogger_telegram_id", telegramId)
          .order("created_at", { ascending: false });
        if (error) throw error;
        setItems((data as SocialAccount[]) ?? []);
      }
    } catch (err) {
      console.error("useItems error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config, telegramId]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const deleteItem = useCallback(
    async (id: string) => {
      if (!config) return;
      const table =
        config.query === "orders" ? TABLES.orders : TABLES.social_accounts;
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
      setItems((prev) => prev.filter((item) => (item as { id: string }).id !== id));
    },
    [config]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<Order> | Partial<SocialAccount>) => {
      if (!config) return;
      const table =
        config.query === "orders" ? TABLES.orders : TABLES.social_accounts;
      const { error } = await supabase
        .from(table)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
      setItems((prev) =>
        prev.map((item) =>
          (item as { id: string }).id === id
            ? { ...item, ...updates }
            : item
        )
      );
    },
    [config]
  );

  return {
    items,
    loading,
    config,
    deleteItem,
    updateItem,
    refetch: fetchItems,
  };
}

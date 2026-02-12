"use client";

import { useState, useEffect, useCallback } from "react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { supabase } from "@/lib/supabase";
import { SEARCH_CONFIG } from "@/config/pages.config";
import { TABLES } from "@/config/database.config";
import type { Order, SocialAccount } from "@/types";

type SearchItem = Order | SocialAccount;

export function useSearch(initialFilters?: Record<string, string | number>) {
  const { role } = useRole();
  const { dbUser } = useTelegramAuth();
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string | number>>(
    initialFilters ?? {}
  );

  const config = role ? SEARCH_CONFIG[role] : null;

  const fetchItems = useCallback(async () => {
    if (!config || !role) {
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
          .eq("status", "active")
          .order("created_at", { ascending: false });

        if (error) throw error;
        setItems((data as Order[]) ?? []);
      } else {
        const query = supabase
          .from(TABLES.social_accounts)
          .select("*")
          .eq("status", "active")
          .order("followers", { ascending: false });

        if (filters.niche) {
          query.ilike("niche", `%${String(filters.niche)}%`);
        }
        if (typeof filters.followers === "number" && filters.followers > 0) {
          query.gte("followers", filters.followers);
        }

        const { data, error } = await query;
        if (error) throw error;
        setItems((data as SocialAccount[]) ?? []);
      }
    } catch (err) {
      console.error("Search error:", err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config, role, filters.niche, filters.followers]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleAction = useCallback(
    (item: SearchItem, _action: string) => {
      if (config?.actionButton.handler === "applyToOrder" && "id" in item) {
        return { type: "applyToOrder" as const, orderId: (item as Order).id };
      }
      if (
        config?.actionButton.handler === "viewBloggerProfile" &&
        "blogger_telegram_id" in item
      ) {
        return {
          type: "viewBloggerProfile" as const,
          telegramId: (item as SocialAccount).blogger_telegram_id,
        };
      }
      return null;
    },
    [config]
  );

  return {
    items,
    loading,
    filters,
    setFilters,
    handleAction,
    config,
    telegramId: dbUser?.telegram_id ?? null,
  };
}

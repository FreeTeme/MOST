"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { supabase } from "@/lib/supabase";
import { SEARCH_CONFIG } from "@/config/pages.config";
import { TABLES } from "@/config/database.config";
import type { Order, SocialAccount } from "@/types";
import type { UserType } from "@/types";
import { isForceDemoData } from "@/lib/dev";
import { getDemoSearchItems } from "@/lib/demo-fixtures";

type SearchItem = Order | SocialAccount;

const EMPTY_FILTERS: Record<string, string> = {
  category: "",
  budgetType: "all",
  budgetMin: "",
  niche: "",
  platform: "",
  followersMin: "",
};

/** Убирает символы, ломающие PostgREST ilike / or */
function sanitizeIlikeFragment(raw: string): string {
  return raw.trim().replace(/%/g, "").replace(/_/g, "").replace(/,/g, " ").slice(0, 120);
}

function parsePositiveInt(s: string): number | null {
  const n = parseInt(String(s).replace(/\s/g, ""), 10);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

/** Читаемое сообщение для PostgREST/Supabase и прочих ошибок (в console часто видно `{}` из‑за полей объекта). */
function describeFetchError(err: unknown): string {
  if (err == null) return String(err);
  if (typeof err !== "object") return String(err);
  const e = err as { message?: unknown; code?: unknown; details?: unknown; hint?: unknown };
  const parts = [
    e.message != null && String(e.message),
    e.code != null && `code=${String(e.code)}`,
    e.details != null && String(e.details),
    e.hint != null && String(e.hint),
  ].filter(Boolean);
  if (parts.length) return parts.join(" | ");
  if (err instanceof Error && err.message) return err.message;
  try {
    const s = JSON.stringify(err);
    if (s !== "{}") return s;
  } catch {
    /* ignore */
  }
  return Object.prototype.toString.call(err);
}

function hasActiveFilters(role: UserType | null, filters: Record<string, string>): boolean {
  if (!role) return false;
  if (role === "blogger") {
    const minB = parsePositiveInt(filters.budgetMin ?? "");
    return Boolean(
      filters.category ||
        (filters.budgetType && filters.budgetType !== "all") ||
        (minB !== null && minB > 0)
    );
  }
  const minF = parsePositiveInt(filters.followersMin ?? "");
  return Boolean(filters.niche?.trim() || filters.platform || (minF !== null && minF > 0));
}

export function useSearch() {
  const { role } = useRole();
  const { dbUser } = useTelegramAuth();
  const [items, setItems] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>(() => ({ ...EMPTY_FILTERS }));
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 320);

  const config = role ? SEARCH_CONFIG[role] : null;

  const hasActiveQuery = useMemo(() => {
    return Boolean(debouncedSearch.trim()) || hasActiveFilters(role ?? null, filters);
  }, [debouncedSearch, filters, role]);

  /** Для индикатора на FAB — без задержки дебаунса по строке поиска */
  const hasActiveUi = useMemo(() => {
    return Boolean(searchQuery.trim()) || hasActiveFilters(role ?? null, filters);
  }, [searchQuery, filters, role]);

  const fetchItems = useCallback(async () => {
    if (!config || !role) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (isForceDemoData()) {
        setItems(getDemoSearchItems(role, filters, debouncedSearch) as SearchItem[]);
        return;
      }

      if (
        !process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
        !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
      ) {
        console.error(
          "Search: задайте NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY в .env"
        );
        setItems([]);
        return;
      }

      if (config.query === "orders") {
        let q = supabase.from(TABLES.orders).select("*").eq("status", "active");

        const term = sanitizeIlikeFragment(debouncedSearch);
        if (term) {
          const p = `%${term}%`;
          q = q.or(`title.ilike.${p},description.ilike.${p}`);
        }

        if (filters.category) {
          q = q.eq("category", filters.category);
        }

        const bt = filters.budgetType ?? "all";
        if (bt === "money") q = q.eq("budget_type", "money");
        if (bt === "barter") q = q.eq("budget_type", "barter");

        const minB = parsePositiveInt(filters.budgetMin ?? "");
        if (minB !== null && minB > 0 && bt !== "barter") {
          q = q.eq("budget_type", "money").gte("budget_amount", minB);
        }

        q = q.order("created_at", { ascending: false });
        const { data, error } = await q;
        if (error) throw error;
        setItems((data as Order[]) ?? []);
      } else {
        let q = supabase.from(TABLES.social_accounts).select("*").eq("status", "active");

        const term = sanitizeIlikeFragment(debouncedSearch);
        if (term) {
          const p = `%${term}%`;
          q = q.or(`platform.ilike.${p},niche.ilike.${p},profile_url.ilike.${p}`);
        }

        if (filters.niche?.trim()) {
          q = q.ilike("niche", `%${sanitizeIlikeFragment(filters.niche)}%`);
        }

        if (filters.platform?.trim()) {
          q = q.eq("platform", filters.platform);
        }

        const minF = parsePositiveInt(filters.followersMin ?? "");
        if (minF !== null && minF > 0) {
          q = q.gte("followers", minF);
        }

        q = q.order("followers", { ascending: false });
        const { data, error } = await q;
        if (error) throw error;
        setItems((data as SocialAccount[]) ?? []);
      }
    } catch (err) {
      console.error("Search error:", describeFetchError(err), err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [config, role, debouncedSearch, filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const resetFiltersAndSearch = useCallback(() => {
    setFilters({ ...EMPTY_FILTERS });
    setSearchQuery("");
  }, []);

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
    searchQuery,
    setSearchQuery,
    resetFiltersAndSearch,
    hasActiveQuery,
    hasActiveUi,
    handleAction,
    config,
    telegramId: dbUser?.telegram_id ?? null,
  };
}

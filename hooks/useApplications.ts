"use client";

import { useState, useEffect, useCallback } from "react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { supabase } from "@/lib/supabase";
import { APPLICATIONS_CONFIG } from "@/config/pages.config";
import { TABLES } from "@/config/database.config";
import type {
  Application,
  ApplicationWithOrder,
  ApplicationWithBlogger,
  Order,
  User,
  SocialAccount,
} from "@/types";

type ApplicationItem = ApplicationWithOrder | ApplicationWithBlogger;

export function useApplications(orderId?: string) {
  const { role } = useRole();
  const { dbUser } = useTelegramAuth();
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [loading, setLoading] = useState(true);

  const config = role ? APPLICATIONS_CONFIG[role] : null;
  const telegramId = dbUser?.telegram_id ?? null;

  const fetchApplications = useCallback(async () => {
    if (!config || telegramId == null) {
      setApplications([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (role === "blogger") {
        const { data: apps, error: appsError } = await supabase
          .from(TABLES.applications)
          .select("*")
          .eq("blogger_telegram_id", telegramId)
          .order("applied_at", { ascending: false });
        if (appsError) throw appsError;

        const orderIds = [...new Set((apps ?? []).map((a) => a.order_id))];
        const { data: orders } = await supabase
          .from(TABLES.orders)
          .select("*")
          .in("id", orderIds);

        const orderMap = new Map<string, Order>();
        (orders ?? []).forEach((o) => orderMap.set(o.id, o as Order));

        const result: ApplicationWithOrder[] = (apps ?? []).map((a) => ({
          ...a,
          order: orderMap.get(a.order_id),
        }));
        setApplications(result);
      } else {
        let query = supabase
          .from(TABLES.applications)
          .select("*")
          .order("applied_at", { ascending: false });

        if (orderId) {
          query = query.eq("order_id", orderId);
        } else {
          const { data: myOrders } = await supabase
            .from(TABLES.orders)
            .select("id")
            .eq("client_telegram_id", telegramId);
          const ids = (myOrders ?? []).map((o) => o.id);
          if (ids.length === 0) {
            setApplications([]);
            setLoading(false);
            return;
          }
          query = query.in("order_id", ids);
        }

        const { data: apps, error: appsError } = await query;
        if (appsError) throw appsError;

        const bloggerIds = [...new Set((apps ?? []).map((a) => a.blogger_telegram_id))];
        const { data: users } = await supabase
          .from(TABLES.users)
          .select("*")
          .in("telegram_id", bloggerIds);
        const { data: socials } = await supabase
          .from(TABLES.social_accounts)
          .select("*")
          .in("blogger_telegram_id", bloggerIds);

        const userMap = new Map<number, User>();
        (users ?? []).forEach((u) => userMap.set((u as User).telegram_id, u as User));
        const socialsByBlogger = new Map<number, SocialAccount[]>();
        (socials ?? []).forEach((s) => {
          const sid = (s as SocialAccount).blogger_telegram_id;
          if (!socialsByBlogger.has(sid)) socialsByBlogger.set(sid, []);
          socialsByBlogger.get(sid)!.push(s as SocialAccount);
        });

        const result: ApplicationWithBlogger[] = (apps ?? []).map((a) => ({
          ...a,
          blogger: userMap.get(a.blogger_telegram_id),
          blogger_socials: socialsByBlogger.get(a.blogger_telegram_id) ?? [],
        }));
        setApplications(result);
      }
    } catch (err) {
      console.error("useApplications error:", err);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }, [config, telegramId, role, orderId]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const updateStatus = useCallback(
    async (applicationId: string, status: "accepted" | "rejected") => {
      const { error } = await supabase
        .from(TABLES.applications)
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", applicationId);
      if (error) throw error;
      setApplications((prev) =>
        prev.map((a) =>
          a.id === applicationId ? { ...a, status } : a
        )
      );
    },
    []
  );

  return {
    applications,
    loading,
    config,
    updateStatus,
    refetch: fetchApplications,
  };
}

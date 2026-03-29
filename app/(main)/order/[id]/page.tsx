"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useApplications } from "@/hooks/useApplications";
import { OrderCard } from "@/components/cards/OrderCard";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileScreen, ScreenHeader } from "@/components/mobile/mobile-screen";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/config/database.config";
import type { Order, User } from "@/types";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { showAlert } from "@/lib/telegram";
import { cn } from "@/lib/utils";

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const { role, isBlogger, isClient } = useRole();
  const { isAuthenticated, loading: authLoading, dbUser } = useTelegramAuth();
  const { applications, loading: appsLoading, updateStatus, refetch: refetchApps } = useApplications(orderId);
  const [order, setOrder] = useState<Order | null>(null);
  const [client, setClient] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(!!(authLoading === false && isAuthenticated), () => router.back());

  useEffect(() => {
    if (!orderId) return;
    let cancelled = false;
    (async () => {
      const { data: orderData, error: orderError } = await supabase
        .from(TABLES.orders)
        .select("*")
        .eq("id", orderId)
        .maybeSingle();
      if (orderError || !orderData) {
        if (!cancelled) setOrder(null);
        setLoading(false);
        return;
      }
      if (!cancelled) setOrder(orderData as Order);
      const { data: userData } = await supabase
        .from(TABLES.users)
        .select("*")
        .eq("telegram_id", (orderData as Order).client_telegram_id)
        .maybeSingle();
      if (!cancelled) setClient((userData as User) ?? null);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const myApplication = isBlogger && dbUser ? applications.find((a) => a.blogger_telegram_id === dbUser.telegram_id) : null;

  const canApply = isBlogger && !myApplication && order?.status === "active";

  const handleApply = async () => {
    if (!orderId || !dbUser || !canApply) return;
    setApplying(true);
    try {
      const { error } = await supabase.from(TABLES.applications).insert({
        order_id: orderId,
        blogger_telegram_id: dbUser.telegram_id,
        message: null,
        status: "pending",
      });
      if (error) throw error;
      await supabase
        .from(TABLES.orders)
        .update({
          applications_count: (order?.applications_count ?? 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);
      setOrder((prev) => (prev ? { ...prev, applications_count: prev.applications_count + 1 } : null));
      refetchApps();
    } catch {
      showAlert("Не удалось откликнуться");
    } finally {
      setApplying(false);
    }
  };

  if (!role) return null;

  if (loading && !order) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16">
        <Skeleton className="size-14 rounded-full" />
      </div>
    );
  }

  if (!order) {
    return (
      <MobileScreen className="pt-4">
        <p className="text-sm text-[var(--tg-theme-hint-color)]">Заказ не найден</p>
      </MobileScreen>
    );
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <MobileScreen className={cn("flex-1 pt-2", canApply && "pb-[calc(5.5rem+max(12px,env(safe-area-inset-bottom)))]")}>
        <ScreenHeader title="Заказ" size="medium" />
        <div className="space-y-5">
          <OrderCard order={order} client={client} variant="detailed" />
          {isClient && (
            <section className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-[var(--tg-theme-hint-color)]">Отклики</h2>
              {appsLoading ? (
                <Skeleton className="h-24 w-full rounded-2xl" />
              ) : applications.length === 0 ? (
                <p className="text-sm text-[var(--tg-theme-hint-color)]">Пока нет откликов</p>
              ) : (
                <ul className="list-none space-y-2.5 p-0">
                  {applications.map((app) => (
                    <li key={app.id}>
                      <ApplicationCard
                        application={app}
                        variant="incoming"
                        showStatus
                        actions={["accept", "reject"]}
                        onStatusChange={updateStatus}
                        onBloggerClick={(tid) => router.push(`/profile/${tid}`)}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      </MobileScreen>

      {canApply && (
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 z-[900]",
            "border-t border-[color-mix(in_oklab,var(--tg-theme-hint-color)_22%,transparent)]",
            "bg-[color-mix(in_oklab,var(--tg-theme-bg-color)_92%,transparent)] backdrop-blur-xl supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--tg-theme-bg-color)_78%,transparent)]"
          )}
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))", paddingTop: 12 }}
        >
          <div className="mx-auto w-full max-w-[var(--app-content-max)] px-[var(--app-page-gutter)]">
            <Button
              type="button"
              className="h-12 w-full rounded-xl text-base font-semibold"
              style={{
                backgroundColor: "var(--tg-theme-button-color)",
                color: "var(--tg-theme-button-text-color)",
              }}
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? "Отправка…" : "Откликнуться"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

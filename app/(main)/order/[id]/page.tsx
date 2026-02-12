"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useApplications } from "@/hooks/useApplications";
import { OrderCard } from "@/components/cards/OrderCard";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { Button } from "@telegram-apps/telegram-ui";
import { supabase } from "@/lib/supabase";
import { TABLES } from "@/config/database.config";
import type { Order, User } from "@/types";
import { Spinner } from "@telegram-apps/telegram-ui";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { showAlert } from "@/lib/telegram";

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

  const myApplication = isBlogger && dbUser
    ? applications.find((a) => a.blogger_telegram_id === dbUser.telegram_id)
    : null;

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
      setOrder((prev) =>
        prev ? { ...prev, applications_count: prev.applications_count + 1 } : null
      );
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
      <div className="flex justify-center py-12">
        <Spinner size="l" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-4">
        <p style={{ color: "var(--tg-theme-hint-color)" }}>Заказ не найден</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <OrderCard
        order={order}
        client={client}
        variant="detailed"
        onApply={canApply ? handleApply : undefined}
      />
      {canApply && (
        <div className="mt-4">
          <Button
            mode="filled"
            size="l"
            stretched
            onClick={handleApply}
            disabled={applying}
            loading={applying}
          >
            Откликнуться
          </Button>
        </div>
      )}
      {isClient && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--tg-theme-text-color)" }}>
            Отклики
          </h2>
          {appsLoading ? (
            <Spinner size="m" />
          ) : applications.length === 0 ? (
            <p style={{ color: "var(--tg-theme-hint-color)" }}>Пока нет откликов</p>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  variant="incoming"
                  showStatus
                  actions={["accept", "reject"]}
                  onStatusChange={updateStatus}
                  onBloggerClick={(tid) => router.push(`/profile/${tid}`)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

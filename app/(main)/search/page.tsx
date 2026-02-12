"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useSearch } from "@/hooks/useSearch";
import { ItemList } from "@/components/shared/ItemList";
import { SocialCard } from "@/components/cards/SocialCard";
import { OrderCard } from "@/components/cards/OrderCard";
import type { Order, SocialAccount } from "@/types";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function SearchPage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { items, loading, config, handleAction } = useSearch();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(!!(authLoading === false && isAuthenticated), () => router.push("/"));

  if (!role || !config) {
    return null;
  }

  const renderItem = (item: Order | SocialAccount) => {
    if (config.card === "OrderCard") {
      const order = item as Order;
      const actionResult = handleAction(item, config.actionButton.handler);
      return (
        <OrderCard
          key={order.id}
          order={order}
          variant="compact"
          onApply={
            actionResult?.type === "applyToOrder"
              ? () => router.push(`/order/${order.id}`)
              : undefined
          }
          onClick={() => router.push(`/order/${order.id}`)}
        />
      );
    }
    const social = item as SocialAccount;
    const actionResult = handleAction(item, config.actionButton.handler);
    return (
      <SocialCard
        key={social.id}
        social={social}
        variant="compact"
        onClick={
          actionResult?.type === "viewBloggerProfile"
            ? () => router.push(`/profile/${social.blogger_telegram_id}`)
            : undefined
        }
      />
    );
  };

  return (
    <div className="min-h-screen p-4 pb-24">
      <h1 className="text-xl font-bold mb-1" style={{ color: "var(--tg-theme-text-color)" }}>
        {config.title}
      </h1>
      <p className="mb-4 text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
        {config.description}
      </p>
      <ItemList
        items={items}
        renderItem={renderItem}
        emptyState={config.emptyState}
        loading={loading}
      />
    </div>
  );
}

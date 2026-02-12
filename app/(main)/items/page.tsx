"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useItems } from "@/hooks/useItems";
import { ItemList } from "@/components/shared/ItemList";
import { SocialCard } from "@/components/cards/SocialCard";
import { OrderCard } from "@/components/cards/OrderCard";
import type { Order, SocialAccount } from "@/types";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function ItemsPage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { items, loading, config, deleteItem } = useItems();

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
      return (
        <OrderCard
          key={order.id}
          order={order}
          variant="editable"
          onEdit={() => router.push(`/order/${order.id}`)}
          onClose={() => deleteItem(order.id).catch(console.error)}
        />
      );
    }
    const social = item as SocialAccount;
    return (
      <SocialCard
        key={social.id}
        social={social}
        variant="editable"
        onEdit={() => {}}
        onDelete={() => deleteItem(social.id).catch(console.error)}
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
        createButton={config.createButton}
      />
    </div>
  );
}

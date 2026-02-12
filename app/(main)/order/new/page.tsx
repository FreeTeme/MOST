"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { OrderForm } from "@/components/forms/OrderForm";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function NewOrderPage() {
  const router = useRouter();
  const { isClient } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { createOrder, loading, error } = useCreateOrder();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
    else if (!authLoading && isAuthenticated && !isClient) router.push("/items");
  }, [authLoading, isAuthenticated, isClient, router]);

  useWebAppBackButton(!!(authLoading === false && isAuthenticated && isClient), () => router.push("/items"));

  if (!isClient) {
    return null;
  }

  return (
    <div className="min-h-screen p-4 pb-24">
      <h1 className="text-xl font-bold mb-4" style={{ color: "var(--tg-theme-text-color)" }}>
        Создание заказа
      </h1>
      <OrderForm onSubmit={createOrder} loading={loading} error={error} />
    </div>
  );
}

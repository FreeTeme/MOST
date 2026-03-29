"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { OrderForm } from "@/components/forms/OrderForm";
import { Card, CardContent } from "@/components/ui/card";
import { MobileScreen, ScreenHeader } from "@/components/mobile/mobile-screen";
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
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileScreen className="pt-2">
        <ScreenHeader title="Новый заказ" description="Заполните поля — блогеры увидят карточку в поиске" size="medium" />
        <Card className="overflow-hidden">
          <CardContent>
            <OrderForm onSubmit={createOrder} loading={loading} error={error} />
          </CardContent>
        </Card>
      </MobileScreen>
    </div>
  );
}

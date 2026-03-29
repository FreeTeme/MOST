"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useCreateSocial } from "@/hooks/useCreateSocial";
import { SocialForm } from "@/components/forms/SocialForm";
import { Card, CardContent } from "@/components/ui/card";
import { MobileScreen, ScreenHeader } from "@/components/mobile/mobile-screen";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function NewSocialPage() {
  const router = useRouter();
  const { isBlogger } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { createSocial, loading, error } = useCreateSocial();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
    else if (!authLoading && isAuthenticated && !isBlogger) router.push("/items");
  }, [authLoading, isAuthenticated, isBlogger, router]);

  useWebAppBackButton(!!(authLoading === false && isAuthenticated && isBlogger), () => router.push("/items"));

  if (!isBlogger) {
    return null;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileScreen className="pt-2">
        <ScreenHeader
          title="Новая соцсеть"
          description="Укажите площадку и ссылку — заказчики смогут найти вас в поиске"
          size="medium"
        />
        <Card className="overflow-hidden">
          <CardContent>
            <SocialForm onSubmit={createSocial} loading={loading} error={error} />
          </CardContent>
        </Card>
      </MobileScreen>
    </div>
  );
}

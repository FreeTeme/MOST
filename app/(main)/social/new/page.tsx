"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useCreateSocial } from "@/hooks/useCreateSocial";
import { SocialForm } from "@/components/forms/SocialForm";
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
    <div className="min-h-screen p-4 pb-24">
      <h1 className="text-xl font-bold mb-4" style={{ color: "var(--tg-theme-text-color)" }}>
        Добавление соцсети
      </h1>
      <SocialForm onSubmit={createSocial} loading={loading} error={error} />
    </div>
  );
}

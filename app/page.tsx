"use client";

import { useEffect } from "react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@telegram-apps/telegram-ui";

export default function HomePage() {
  const { tgUser, dbUser, loading, isAuthenticated } = useTelegramAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!tgUser) return;
    if (isAuthenticated && dbUser) {
      router.replace("/search");
    } else {
      router.replace("/role-select");
    }
  }, [loading, tgUser, isAuthenticated, dbUser, router]);

  if (loading || (tgUser && !isAuthenticated)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="l" />
      </div>
    );
  }

  if (!tgUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--tg-theme-text-color)" }}>
            Ошибка
          </h1>
          <p style={{ color: "var(--tg-theme-hint-color)" }}>
            Это приложение работает только внутри Telegram
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="l" />
    </div>
  );
}

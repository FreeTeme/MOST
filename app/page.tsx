"use client";

import { useEffect } from "react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileScreen } from "@/components/mobile/mobile-screen";
import { STORAGE_KEYS } from "@/config/roles.config";

export default function HomePage() {
  const { tgUser, dbUser, loading, isAuthenticated } = useTelegramAuth();
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined" || loading) return;

    /** Локально: снова показать «Кто вы?» — откройте http://localhost:3000/?reselect=1 */
    if (
      process.env.NODE_ENV !== "production" &&
      new URLSearchParams(window.location.search).get("reselect") === "1"
    ) {
      localStorage.removeItem(STORAGE_KEYS.session);
      window.history.replaceState({}, "", "/");
      window.location.replace("/role-select");
      return;
    }

    if (!tgUser) return;
    if (isAuthenticated && dbUser) {
      router.replace("/search");
    } else {
      router.replace("/role-select");
    }
  }, [loading, tgUser, isAuthenticated, dbUser, router]);

  if (loading || (tgUser && !isAuthenticated)) {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--tg-theme-bg-color)]"
        style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <MobileScreen className="flex flex-col items-center gap-4 text-center">
          <Skeleton className="size-16 rounded-2xl" />
          <div className="space-y-2">
            <Skeleton className="mx-auto h-5 w-28 rounded-md" />
            <Skeleton className="mx-auto h-3 w-40 rounded-md" />
          </div>
        </MobileScreen>
      </div>
    );
  }

  if (!tgUser) {
    return (
      <div
        className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center"
        style={{
          paddingTop: "max(1rem, env(safe-area-inset-top))",
          paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
          backgroundColor: "var(--tg-theme-bg-color)",
          color: "var(--tg-theme-text-color)",
        }}
      >
        <h1 className="text-xl font-bold">Только в Telegram</h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-[var(--tg-theme-hint-color)]">
          MOST — мини-приложение для блогеров и заказчиков. Откройте его из чата или меню Telegram.
        </p>
      </div>
    );
  }

  return (
    <div
      className="flex min-h-[100dvh] flex-col items-center justify-center bg-[var(--tg-theme-bg-color)]"
      style={{ paddingTop: "env(safe-area-inset-top)", paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <Skeleton className="size-14 rounded-2xl" />
    </div>
  );
}

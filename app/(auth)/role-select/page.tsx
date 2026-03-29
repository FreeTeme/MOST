"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Sparkles } from "lucide-react";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileScreen } from "@/components/mobile/mobile-screen";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { showAlert } from "@/lib/telegram";
import { isStandaloneDev } from "@/lib/dev";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types";

type Role = UserType;

const ROLES: {
  id: Role;
  badge: string;
  title: string;
  description: string;
  icon: typeof Sparkles;
  gradient: string;
  iconWrap: string;
}[] = [
  {
    id: "blogger",
    badge: "Блогер",
    title: "Ищу заказы",
    description: "Рекламные интеграции и отклики на подходящие кампании",
    icon: Sparkles,
    gradient:
      "from-[color-mix(in_oklab,var(--tg-theme-button-color)_22%,var(--tg-theme-bg-color))] via-[color-mix(in_oklab,var(--tg-theme-secondary-bg-color)_35%,var(--tg-theme-bg-color))] to-transparent",
    iconWrap:
      "bg-[color-mix(in_oklab,var(--tg-theme-button-color)_18%,var(--tg-theme-bg-color))] text-[var(--tg-theme-button-color)]",
  },
  {
    id: "client",
    badge: "Заказчик",
    title: "Ищу блогеров",
    description: "Публикация заказов и подбор исполнителей под задачу",
    icon: Building2,
    gradient:
      "from-[color-mix(in_oklab,var(--tg-theme-hint-color)_38%,var(--tg-theme-bg-color))] via-[color-mix(in_oklab,var(--tg-theme-secondary-bg-color)_28%,var(--tg-theme-bg-color))] to-transparent",
    iconWrap:
      "bg-[color-mix(in_oklab,var(--tg-theme-hint-color)_22%,var(--tg-theme-bg-color))] text-[var(--tg-theme-text-color)]",
  },
];

async function showWebAppProgress() {
  if (isStandaloneDev) return;
  const WebApp = (await import("@twa-dev/sdk")).default;
  WebApp.MainButton.showProgress?.();
}

function hideWebAppProgress() {
  if (isStandaloneDev) return;
  import("@twa-dev/sdk").then((m) => m.default.MainButton?.hideProgress?.());
}

export default function RoleSelectPage() {
  const router = useRouter();
  const { tgUser, register, loading: authLoading } = useTelegramAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const submitLockRef = useRef(false);

  useWebAppBackButton(true, () => router.push("/"));

  const handleSelectRole = useCallback(
    async (role: Role) => {
      if (authLoading || submitLockRef.current) return;
      submitLockRef.current = true;
      setSelectedRole(role);
      try {
        await showWebAppProgress();
        await register(role);
        router.push("/search");
      } catch {
        showAlert("Ошибка при регистрации");
      } finally {
        hideWebAppProgress();
        submitLockRef.current = false;
        setSelectedRole(null);
      }
    },
    [register, router, authLoading]
  );

  if (authLoading) {
    return (
      <div
        className="flex min-h-[100dvh] flex-col bg-[var(--tg-theme-bg-color)] text-[var(--tg-theme-text-color)]"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <MobileScreen width="full" className="flex flex-1 flex-col gap-6 pt-4">
          <div className="space-y-3 text-center">
            <Skeleton className="mx-auto h-9 w-52 rounded-xl" />
            <Skeleton className="mx-auto h-4 w-64 rounded-md" />
          </div>
          <div className="flex flex-1 flex-col gap-4">
            <Skeleton className="h-56 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
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
        <p className="text-lg font-bold">Нужен Telegram</p>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-[var(--tg-theme-hint-color)]">
          Откройте приложение как Mini App внутри Telegram
        </p>
      </div>
    );
  }

  const isSubmitting = selectedRole !== null;

  return (
    <div
      className="app-shell-gradient flex min-h-[100dvh] flex-col text-[var(--tg-theme-text-color)]"
      style={{ paddingTop: "max(var(--space-2), env(safe-area-inset-top))" }}
    >
      <MobileScreen
        width="full"
        className="flex flex-1 flex-col pb-[max(var(--space-4),env(safe-area-inset-bottom))]"
      >
        <header className="shrink-0 pb-[var(--space-2)] pt-[var(--space-1)] text-center">
          <h1 className="app-title-display">Кто вы?</h1>
        </header>

        <main className="app-grid-responsive-cols flex-1 content-start justify-items-stretch pt-[var(--space-2)]">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const busy = isSubmitting && selectedRole === role.id;

            return (
              <Card
                key={role.id}
                role="button"
                tabIndex={isSubmitting ? -1 : 0}
                aria-busy={busy}
                aria-disabled={isSubmitting}
                aria-label={`${role.badge}. ${role.title}. ${role.description}. Нажмите, чтобы продолжить`}
                className={cn(
                  "app-motion overflow-hidden backdrop-blur-sm transition-[transform,box-shadow] duration-[var(--app-duration)]",
                  "outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--tg-theme-button-color)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--tg-theme-bg-color)]",
                  !isSubmitting && "cursor-pointer active:scale-[0.985]",
                  isSubmitting && "pointer-events-none",
                  isSubmitting && !busy && "opacity-50"
                )}
                onClick={() => {
                  if (isSubmitting) return;
                  void handleSelectRole(role.id);
                }}
                onKeyDown={(e) => {
                  if (isSubmitting) return;
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    void handleSelectRole(role.id);
                  }
                }}
              >
                <div className={cn("relative flex h-[5.5rem] shrink-0 items-center justify-center bg-gradient-to-br", role.gradient)}>
                  <span className="app-overline absolute left-[var(--space-3)] top-[var(--space-3)] rounded-[var(--radius-app-pill)] bg-[color-mix(in_oklab,var(--tg-theme-bg-color)_88%,transparent)] px-[var(--space-2)] py-1 text-[length:var(--text-overline)] backdrop-blur-sm">
                    {role.badge}
                  </span>
                  <div className={cn("flex size-12 items-center justify-center rounded-[var(--radius-app-md)]", role.iconWrap)} aria-hidden>
                    <Icon className="size-6" strokeWidth={1.75} />
                  </div>
                </div>

                <CardHeader className="space-y-[var(--space-2)] px-[var(--space-4)] pb-[var(--space-2)] pt-[var(--space-4)]">
                  <CardTitle className="text-[length:var(--text-title)] font-bold leading-[var(--text-title--line)]">
                    {role.title}
                  </CardTitle>
                  <CardDescription className="text-[length:var(--text-body-sm)] leading-[var(--text-body-sm--line)]">
                    {role.description}
                  </CardDescription>
                </CardHeader>

                <CardFooter className="px-[var(--space-4)] pb-[var(--space-4)] pt-0">
                  <div
                    aria-hidden
                    className="flex h-12 min-h-12 w-full items-center justify-center rounded-[var(--radius-app-sm)] text-[length:var(--text-body-sm)] font-semibold"
                    style={{
                      backgroundColor: "var(--tg-theme-button-color)",
                      color: "var(--tg-theme-button-text-color)",
                    }}
                  >
                    {busy ? "Сохранение…" : "Продолжить"}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </main>
      </MobileScreen>
    </div>
  );
}

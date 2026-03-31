"use client";

import { useCallback, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { Tag, UserRound } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileScreen } from "@/components/mobile/mobile-screen";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { showAlert } from "@/lib/telegram";
import { isStandaloneDev } from "@/lib/dev";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types";

async function showWebAppProgress() {
  if (isStandaloneDev) return;
  const WebApp = (await import("@twa-dev/sdk")).default;
  WebApp.MainButton.showProgress?.();
}

function hideWebAppProgress() {
  if (isStandaloneDev) return;
  import("@twa-dev/sdk").then((m) => m.default.MainButton?.hideProgress?.());
}

function AvatarOrbitDecor() {
  const items: { emoji: string; anchor: string; bubble: string }[] = [
    { emoji: "🏷️", anchor: "left-[6%] top-[4%]", bubble: "size-11 text-xl" },
    { emoji: "💄", anchor: "left-1/2 top-0 -translate-x-1/2", bubble: "size-12 text-2xl" },
    { emoji: "👤", anchor: "right-[8%] top-[8%]", bubble: "size-10 text-lg" },
    { emoji: "🛍️", anchor: "bottom-[12%] left-[4%]", bubble: "size-12 text-2xl" },
    { emoji: "🍔", anchor: "bottom-[10%] right-[6%]", bubble: "size-12 text-2xl" },
  ];
  return (
    <>
      {items.map(({ emoji, anchor, bubble }, i) => (
        <span key={`${emoji}-${i}`} className={cn("pointer-events-none absolute", anchor)} aria-hidden>
          <span
            style={{ "--orbit-delay": `${i * 0.28}s` } as CSSProperties}
            className={cn(
              "role-select-orbit-float flex items-center justify-center rounded-full bg-white/90 shadow-[0_4px_14px_-4px_rgba(0,0,0,0.12)] ring-1 ring-white/80 backdrop-blur-[2px]",
              bubble
            )}
          >
            <span className="leading-none">{emoji}</span>
          </span>
        </span>
      ))}
    </>
  );
}

function TelegramAvatar({ firstName, photoUrl }: { firstName: string; photoUrl?: string }) {
  const initial = firstName.trim().charAt(0).toUpperCase() || "?";

  const inner = photoUrl ? (
    <div className="relative size-[7.25rem] shrink-0 overflow-hidden rounded-full ring-4 ring-white">
      {/* eslint-disable-next-line @next/next/no-img-element — URL аватарки из Telegram, домены не фиксированы */}
      <img src={photoUrl} alt="" className="size-full object-cover" />
    </div>
  ) : (
    <div
      className="flex size-[7.25rem] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb8a8] to-[#e753a0] text-4xl font-bold text-white ring-4 ring-white"
      aria-hidden
    >
      {initial}
    </div>
  );

  return <div className="role-select-avatar-ring relative inline-flex rounded-full">{inner}</div>;
}

export default function RoleSelectPage() {
  const router = useRouter();
  const { tgUser, register, loading: authLoading } = useTelegramAuth();
  const [selectedRole, setSelectedRole] = useState<UserType | null>(null);
  const submitLockRef = useRef(false);

  useWebAppBackButton(true, () => router.push("/"));

  const handleSelectRole = useCallback(
    async (role: UserType) => {
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
        className="role-select-warm-bg flex min-h-[100dvh] flex-col text-[#1a1a1a]"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        <MobileScreen width="full" className="flex flex-1 flex-col items-center gap-8 pt-10">
          <Skeleton className="h-8 w-32 rounded-full" />
          <Skeleton className="size-28 rounded-full" />
          <div className="w-full max-w-md space-y-4 px-2">
            <Skeleton className="h-[3.75rem] w-full rounded-full" />
            <Skeleton className="h-[3.75rem] w-full rounded-full" />
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

  const firstName = tgUser.first_name?.trim() || "друг";
  const isSubmitting = selectedRole !== null;

  return (
    <div
      className="role-select-warm-bg flex min-h-[100dvh] flex-col overflow-x-hidden text-[#1a1a1a]"
      style={{
        paddingTop: "max(var(--space-3), env(safe-area-inset-top))",
        paddingBottom: "max(var(--space-6), env(safe-area-inset-bottom))",
      }}
    >
      <MobileScreen width="full" className="flex flex-1 flex-col items-center px-[var(--app-page-gutter)]">
        <p
          className="role-select-fade-up role-select-logo-glow mb-8 bg-gradient-to-r from-[#ff9b71] to-[#e753a0] bg-clip-text pt-2 text-center font-black tracking-tight text-transparent"
          style={
            {
              "--role-select-delay": "0.05s",
              fontSize: "1.625rem",
              letterSpacing: "-0.03em",
            } as CSSProperties
          }
        >
          MOST
        </p>

        <div
          className="role-select-fade-up relative mb-10 w-full max-w-[17.5rem]"
          style={{ "--role-select-delay": "0.12s" } as CSSProperties}
        >
          <div className="relative z-10 mx-auto flex w-fit justify-center pt-6 pb-8">
            <div className="relative">
              <AvatarOrbitDecor />
              <TelegramAvatar firstName={firstName} photoUrl={tgUser.photo_url} />
            </div>
          </div>
        </div>

        <h1
          className="role-select-fade-up mb-2 text-center text-[1.625rem] font-bold leading-tight tracking-tight text-[#1a1a1a]"
          style={{ "--role-select-delay": "0.28s" } as CSSProperties}
        >
          Привет, {firstName}!
        </h1>
        <p
          className="role-select-fade-up mb-10 max-w-[22rem] text-center text-[0.9375rem] leading-snug text-[color-mix(in_oklab,#1a1a1a_52%,#888)]"
          style={{ "--role-select-delay": "0.36s" } as CSSProperties}
        >
          Выберите, как вы хотите использовать платформу
        </p>

        <div className="flex w-full max-w-md flex-col gap-7">
          <div
            className="role-select-fade-up flex flex-col gap-2.5"
            style={{ "--role-select-delay": "0.44s" } as CSSProperties}
          >
            <button
              type="button"
              disabled={isSubmitting}
              aria-busy={selectedRole === "blogger"}
              className="role-select-btn-blogger"
              onClick={() => void handleSelectRole("blogger")}
            >
              <span>{selectedRole === "blogger" ? "Сохранение…" : "Я блогер"}</span>
              <span className="role-select-btn-icon-blogger" aria-hidden>
                <UserRound className="size-[1.35rem]" strokeWidth={2.25} />
              </span>
            </button>
            <p className="px-1 text-center text-[0.8125rem] leading-snug text-[color-mix(in_oklab,#1a1a1a_58%,#666)]">
              Создаю контент и ищу заказы и коллаборации с брендами
            </p>
          </div>

          <div
            className="role-select-fade-up flex flex-col gap-2.5"
            style={{ "--role-select-delay": "0.54s" } as CSSProperties}
          >
            <button
              type="button"
              disabled={isSubmitting}
              aria-busy={selectedRole === "client"}
              className="role-select-btn-brand"
              onClick={() => void handleSelectRole("client")}
            >
              <span>{selectedRole === "client" ? "Сохранение…" : "Я бренд"}</span>
              <span className="role-select-btn-icon-brand" aria-hidden>
                <Tag className="size-[1.35rem]" strokeWidth={2.25} />
              </span>
            </button>
            <p className="px-1 text-center text-[0.8125rem] leading-snug text-[color-mix(in_oklab,#1a1a1a_52%,#666)]">
              Публикую задачи и ищу блогеров для продвижения
            </p>
          </div>
        </div>
      </MobileScreen>
    </div>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Inbox, LayoutList, Search, UserRound } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { getTabsForRole, isTabRoute } from "@/config/nav.config";
import type { TabId } from "@/config/nav.config";
import type { UserType } from "@/types";
import { cn } from "@/lib/utils";

const ICON_CLASS = "size-[22px] shrink-0";

const TAB_ICONS: Record<
  TabId,
  React.ComponentType<{ className?: string; strokeWidth?: number }>
> = {
  "/search": Search,
  "/items": LayoutList,
  "/applications": Inbox,
  "/profile/me": UserRound,
};

const PROFILE_TAB_ID = "/profile/me" satisfies TabId;

export function AppTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  const { dbUser } = useTelegramAuth();

  const effectiveRole: UserType | null = role ?? dbUser?.user_type ?? null;

  if (!isTabRoute(pathname) || !effectiveRole) return null;

  const tabs = getTabsForRole(effectiveRole);
  if (tabs.length === 0) return null;

  const railTabs = tabs.filter((t) => t.id !== PROFILE_TAB_ID);
  const profileActive = pathname === PROFILE_TAB_ID;

  return (
    <nav
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[1000]"
      style={{
        paddingTop: "var(--space-2)",
        paddingBottom: "max(var(--space-3), env(safe-area-inset-bottom))",
        paddingInline: "var(--app-page-gutter)",
      }}
      aria-label="Основные разделы"
    >
      <div className="pointer-events-auto mx-auto flex max-w-[var(--app-content-max)] items-center justify-center gap-[var(--space-3)]">
        <div
          className={cn(
            "flex min-h-[var(--app-tabbar-pill-h)] min-w-0 flex-1 items-stretch",
            "rounded-[var(--radius-app-pill)] border border-[var(--app-border)]",
            "bg-[color-mix(in_oklab,var(--app-surface-card)_94%,transparent)]",
            "shadow-[var(--app-shadow-card)] backdrop-blur-xl",
            "supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--app-surface-card)_88%,transparent)]",
            "px-1 py-1"
          )}
        >
          {railTabs.map((tab) => {
            const selected = pathname === tab.path;
            const Icon = TAB_ICONS[tab.id];
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  if (!selected) router.push(tab.path);
                }}
                aria-current={selected ? "page" : undefined}
                className={cn(
                  "app-motion flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5",
                  "rounded-[var(--radius-app-pill)] border-0 px-0.5 py-1",
                  "transition-[color,background-color,transform,box-shadow] duration-[var(--app-duration-fast)]",
                  selected
                    ? "app-tabbar-active-slot"
                    : "bg-transparent text-[color-mix(in_oklab,var(--tg-theme-hint-color)_88%,var(--tg-theme-text-color))] active:scale-[0.97] active:bg-[color-mix(in_oklab,var(--tg-theme-hint-color)_8%,transparent)]"
                )}
              >
                {Icon ? (
                  <Icon className={ICON_CLASS} strokeWidth={selected ? 2.25 : 2} aria-hidden />
                ) : null}
                <span className="max-w-full truncate text-center text-[length:var(--text-caption)] font-semibold leading-tight tracking-[0.02em]">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        <Link
          href={PROFILE_TAB_ID}
          aria-label="Профиль"
          aria-current={profileActive ? "page" : undefined}
          className={cn(
            "tap-compact app-motion flex size-[var(--app-tabbar-pill-h)] shrink-0 items-center justify-center overflow-hidden",
            "rounded-[var(--radius-app-pill)] border border-[var(--app-border)]",
            "bg-[var(--app-surface-card)] shadow-[var(--app-shadow-sm)]",
            "transition-[transform,box-shadow] duration-[var(--app-duration-fast)] active:scale-[0.97]",
            profileActive &&
              "ring-2 ring-[color-mix(in_oklab,var(--app-gradient-peach)_65%,transparent)] ring-offset-2 ring-offset-[var(--app-canvas)]"
          )}
        >
          {dbUser?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- внешний URL Telegram без доменов в next.config
            <img src={dbUser.photo_url} alt="" className="size-full object-cover" />
          ) : (
            <UserRound className="size-[1.35rem] text-[var(--tg-theme-hint-color)]" strokeWidth={2} aria-hidden />
          )}
        </Link>
      </div>
    </nav>
  );
}

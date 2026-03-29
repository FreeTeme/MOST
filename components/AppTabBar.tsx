"use client";

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

export function AppTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  const { dbUser } = useTelegramAuth();

  const effectiveRole: UserType | null = role ?? dbUser?.user_type ?? null;

  if (!isTabRoute(pathname) || !effectiveRole) return null;

  const tabs = getTabsForRole(effectiveRole);
  if (tabs.length === 0) return null;

  return (
    <nav
      className={cn(
        "app-motion fixed bottom-0 left-0 right-0 z-[1000]",
        "border-t border-[var(--app-border)]",
        "bg-[color-mix(in_oklab,var(--tg-theme-bg-color)_86%,transparent)] backdrop-blur-2xl supports-[backdrop-filter]:bg-[color-mix(in_oklab,var(--tg-theme-bg-color)_72%,transparent)]",
        "shadow-[0_-1px_0_var(--app-border)]"
      )}
      style={{
        paddingBottom: "max(var(--space-2), env(safe-area-inset-bottom))",
        paddingTop: "var(--space-2)",
      }}
      aria-label="Основные разделы"
    >
      <div className="mx-auto flex min-h-[52px] max-w-lg items-stretch justify-between gap-1 px-[var(--app-page-gutter)]">
        {tabs.map((tab) => {
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
                "app-motion flex min-h-[52px] min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-[var(--radius-app-md)] border-0 px-1",
                "transition-[color,background-color,transform] duration-[var(--app-duration-fast)]",
                selected
                  ? "bg-[color-mix(in_oklab,var(--tg-theme-button-color)_16%,transparent)] text-[var(--tg-theme-button-color)] shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--tg-theme-button-color)_22%,transparent)]"
                  : "bg-transparent text-[color-mix(in_oklab,var(--tg-theme-hint-color)_88%,var(--tg-theme-text-color))] active:scale-[0.97] active:bg-[color-mix(in_oklab,var(--tg-theme-hint-color)_10%,transparent)]"
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
    </nav>
  );
}

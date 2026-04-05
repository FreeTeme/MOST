"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Flame, Inbox, LayoutList, UserRound } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { getTabsForRole, isTabRoute } from "@/config/nav.config";
import type { TabId } from "@/config/nav.config";
import type { UserType } from "@/types";
import { cn } from "@/lib/utils";

const PROFILE_TAB_ID = "/profile/me" satisfies TabId;

const ICON_CLASS = "size-[22px] shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]";

function railTabDisplay(
  tabId: TabId,
  role: UserType
): { label: string; Icon: React.ComponentType<{ className?: string; strokeWidth?: number }> } {
  if (tabId === "/search") {
    return role === "client"
      ? { label: "Креаторы", Icon: UserRound }
      : { label: "Офферы", Icon: Flame };
  }
  if (tabId === "/items") {
    return role === "client" ? { label: "Офферы", Icon: Flame } : { label: "Мои", Icon: LayoutList };
  }
  if (tabId === "/applications") {
    return { label: "Отклики", Icon: Inbox };
  }
  return { label: "Профиль", Icon: UserRound };
}

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
      <div className="pointer-events-auto mx-auto flex max-w-[var(--app-content-max)] items-end justify-center gap-3">
        <div
          className={cn(
            "flex min-h-[var(--app-tabbar-pill-h)] min-w-0 flex-1 items-stretch",
            "rounded-full bg-white",
            "shadow-[0_12px_40px_-12px_rgba(0,0,0,0.2),0_4px_14px_-4px_rgba(0,0,0,0.08)]",
            "ring-1 ring-black/[0.05]",
            "px-1.5 py-1.5"
          )}
        >
          {railTabs.map((tab) => {
            const selected = pathname === tab.path;
            const { label, Icon } = railTabDisplay(tab.id, effectiveRole);
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
                  "rounded-full border-0 px-1 py-1",
                  "transition-[color,background-color,transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
                  "motion-reduce:transition-none",
                  selected
                    ? "app-tabbar-active-slot"
                    : "bg-transparent text-[#636366] active:scale-[0.96] motion-reduce:active:scale-100 active:bg-black/[0.03]"
                )}
              >
                <Icon
                  className={cn(ICON_CLASS, selected && "scale-105 motion-reduce:scale-100")}
                  strokeWidth={selected ? 2.35 : 2}
                  aria-hidden
                />
                <span className="max-w-full truncate text-center text-[0.65rem] font-semibold leading-tight tracking-wide">
                  {label}
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
            "tap-compact app-motion flex size-[var(--app-tabbar-pill-h)] shrink-0 items-center justify-center overflow-hidden rounded-full",
            "bg-white shadow-[0_10px_32px_-10px_rgba(0,0,0,0.18)] ring-1 ring-black/[0.06]",
            "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
            "active:scale-[0.94] motion-reduce:active:scale-100",
            profileActive && "ring-[3px] ring-[color-mix(in_oklab,var(--app-gradient-peach)_65%,transparent)]"
          )}
        >
          {dbUser?.photo_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- внешний URL Telegram без remotePatterns
            <img src={dbUser.photo_url} alt="" className="size-full object-cover" />
          ) : (
            <UserRound className="size-[1.35rem] text-[#aeaeb2]" strokeWidth={2} aria-hidden />
          )}
        </Link>
      </div>
    </nav>
  );
}

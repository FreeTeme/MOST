"use client";

import { usePathname, useRouter } from "next/navigation";
import { Flex } from "antd";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { getTabsForRole, isTabRoute } from "@/config/nav.config";
import type { TabId } from "@/config/nav.config";
import type { UserType } from "@/types";

const ICON_SIZE = 28;

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 28 28" fill="currentColor" aria-hidden>
      <path d="M20.5 19h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L20.5 19zm-6 0c-2.49 0-4.5-2.01-4.5-4.5S11.01 10 13.5 10s4.5 2.01 4.5 4.5-2.01 4.5-4.5 4.5z" />
    </svg>
  );
}

function IconList({ className }: { className?: string }) {
  return (
    <svg className={className} width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 28 28" fill="currentColor" aria-hidden>
      <path d="M5 7a1.5 1.5 0 0 1 1.5-1.5h15A1.5 1.5 0 0 1 23 7v1.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 5 8.5V7zm0 6.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5V15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 5 15v-1.5zm0 6.5a1.5 1.5 0 0 1 1.5-1.5h15a1.5 1.5 0 0 1 1.5 1.5V21.5a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 5 21.5V20z" />
    </svg>
  );
}

function IconChat({ className }: { className?: string }) {
  return (
    <svg className={className} width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 28 28" fill="currentColor" aria-hidden>
      <path d="M14 2C7.37 2 2 6.92 2 12.84c0 3.41 1.94 6.42 4.88 8.1-.26.96-.99 3.56-1.15 4.1-.14.48.19.47.41.34.16-.1 2.5-1.7 3.52-2.38.58.08 1.18.12 1.8.12 6.63 0 12-4.92 12-10.84S20.63 2 14 2z" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 28 28" fill="currentColor" aria-hidden>
      <path d="M14 14c3.31 0 6-2.69 6-6s-2.69-6-6-6-6 2.69-6 6 2.69 6 6 6zm0 2c-4.42 0-8 2.24-8 5v3h16v-3c0-2.76-3.58-5-8-5z" />
    </svg>
  );
}

const TAB_ICONS: Record<TabId, React.ComponentType<{ className?: string }>> = {
  "/search": IconSearch,
  "/items": IconList,
  "/applications": IconChat,
  "/profile/me": IconUser,
};

export function AppTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  const { dbUser } = useTelegramAuth();

  // Роль может прийти из useRole (localStorage) или из dbUser после загрузки авторизации
  const effectiveRole: UserType | null = role ?? dbUser?.user_type ?? null;

  if (!isTabRoute(pathname) || !effectiveRole) return null;

  const tabs = getTabsForRole(effectiveRole);
  if (tabs.length === 0) return null;

  return (
    <Flex
      align="center"
      justify="space-around"
      className="fixed bottom-0 left-0 right-0 z-[1000] border-t border-[var(--tg-theme-hint-color, #999)] bg-[var(--tg-theme-bg-color)]"
      style={{
        paddingBottom: "max(8px, env(safe-area-inset-bottom))",
        paddingTop: 8,
        minHeight: 56,
      }}
    >
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
            className="flex flex-col items-center justify-center gap-1 min-w-[44px] min-h-[44px] border-0 bg-transparent cursor-pointer"
            style={{
              color: selected ? "var(--tg-theme-button-color, #2481cc)" : "var(--tg-theme-hint-color, #999)",
            }}
          >
            {Icon ? <Icon /> : null}
            <span className="text-xs">{tab.label}</span>
          </button>
        );
      })}
    </Flex>
  );
}

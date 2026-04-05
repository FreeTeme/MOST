"use client";

import { usePathname } from "next/navigation";
import { AppTabBar } from "@/components/AppTabBar";
import { isTabRoute } from "@/config/nav.config";
import { cn } from "@/lib/utils";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTabBar = isTabRoute(pathname);

  return (
    <>
      <div
        className={cn(
          "relative flex min-h-[100dvh] w-full min-w-0 flex-col overflow-x-hidden",
          showTabBar ? "pb-[var(--app-tabbar-total)]" : "pb-[max(1rem,env(safe-area-inset-bottom))]"
        )}
      >
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col",
            pathname === "/search"
              ? "bg-[#f5f5f5]"
              : pathname.startsWith("/profile")
                ? "bg-[#f2f2f7]"
                : "app-shell-gradient"
          )}
        >
          {children}
        </div>
      </div>
      <AppTabBar />
    </>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { AppTabBar } from "@/components/AppTabBar";
import { isTabRoute } from "@/config/nav.config";

/** Bottom tab bar height (approx.) + safe area. Match with Tabbar styling. */
const TABBAR_HEIGHT = "64px";

export function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showTabBar = isTabRoute(pathname);

  return (
    <>
      <div
        className="min-h-[100dvh] w-full overflow-x-hidden"
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: showTabBar ? `calc(${TABBAR_HEIGHT} + env(safe-area-inset-bottom))` : "env(safe-area-inset-bottom)",
        }}
      >
        {children}
      </div>
      <AppTabBar />
    </>
  );
}

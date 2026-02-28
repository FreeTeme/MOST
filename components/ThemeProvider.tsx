"use client";

import { useEffect } from "react";
import { isStandaloneDev } from "@/lib/dev";

const THEME_FALLBACKS: Record<string, string> = {
  bg_color: "#ffffff",
  text_color: "#000000",
  button_color: "#2481cc",
  button_text_color: "#ffffff",
  hint_color: "#999999",
  secondary_bg_color: "#f0f2f5",
};

function toCssKey(key: string) {
  return `--tg-theme-${key.replace(/_/g, "-")}`;
}

function applyFallbackTheme() {
  Object.entries(THEME_FALLBACKS).forEach(([key, value]) => {
    const cssKey = toCssKey(key);
    document.documentElement.style.setProperty(cssKey, value);
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isStandaloneDev) {
      applyFallbackTheme();
      return;
    }

    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      try {
        WebApp.ready();
        WebApp.expand();
        WebApp.disableVerticalSwipes();
      } catch {
        // не в Telegram — применяем только fallback
      }
      const theme = WebApp.themeParams ?? {};
      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(toCssKey(key), String(value));
      });
      Object.entries(THEME_FALLBACKS).forEach(([key, value]) => {
        const cssKey = toCssKey(key);
        if (!document.documentElement.style.getPropertyValue(cssKey)) {
          document.documentElement.style.setProperty(cssKey, value);
        }
      });
    });
  }, []);

  return <>{children}</>;
}

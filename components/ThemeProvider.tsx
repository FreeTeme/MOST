"use client";

import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && WebApp) {
      WebApp.ready();
      WebApp.expand();
      WebApp.disableVerticalSwipes();

      // Устанавливаем CSS переменные для темы Telegram
      const theme = WebApp.themeParams;

      Object.entries(theme).forEach(([key, value]) => {
        document.documentElement.style.setProperty(
          `--tg-theme-${key.replace(/_/g, "-")}`,
          value,
        );
      });

      // Для светлой темы принудительно
      document.documentElement.style.setProperty(
        "--tg-theme-bg-color",
        "#ffffff",
      );
      document.documentElement.style.setProperty(
        "--tg-theme-text-color",
        "#000000",
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-color",
        "#2481cc",
      );
      document.documentElement.style.setProperty(
        "--tg-theme-button-text-color",
        "#ffffff",
      );
      document.documentElement.style.setProperty(
        "--tg-theme-hint-color",
        "#999999",
      );
      document.documentElement.style.setProperty(
        "--tg-theme-secondary-bg-color",
        "#f0f2f5",
      );
    }
  }, []);

  return <>{children}</>;
}

"use client";

import { useEffect } from "react";
import { isStandaloneDev } from "@/lib/dev";

/** Значения по умолчанию, если в themeParams нет ключа (Telegram присылает не всё в старых клиентах). */
const THEME_FALLBACKS_LIGHT: Record<string, string> = {
  bg_color: "#ffffff",
  text_color: "#1a1a1a",
  hint_color: "#8e8e93",
  link_color: "#2481cc",
  button_color: "#2481cc",
  button_text_color: "#ffffff",
  secondary_bg_color: "#efefef",
  destructive_text_color: "#ff3b30",
  section_bg_color: "#ffffff",
  section_separator_color: "#c8c7cc",
  subtitle_text_color: "#8e8e93",
};

const THEME_FALLBACKS_DARK: Record<string, string> = {
  bg_color: "#1c1c1e",
  text_color: "#ffffff",
  hint_color: "#8e8e93",
  link_color: "#64b5ef",
  button_color: "#5294e2",
  button_text_color: "#ffffff",
  secondary_bg_color: "#2c2c2e",
  destructive_text_color: "#ff453a",
  section_bg_color: "#2c2c2e",
  section_separator_color: "#48484a",
  subtitle_text_color: "#8e8e93",
};

function toCssKey(key: string) {
  return `--tg-theme-${key.replace(/_/g, "-")}`;
}

function mergeTelegramTheme(
  scheme: "light" | "dark",
  themeParams: Partial<Record<string, string | undefined>>
): Record<string, string> {
  const base = scheme === "dark" ? THEME_FALLBACKS_DARK : THEME_FALLBACKS_LIGHT;
  const merged: Record<string, string> = { ...base };
  Object.entries(themeParams).forEach(([k, v]) => {
    if (typeof v === "string" && v.length > 0) {
      merged[k] = v;
    }
  });
  return merged;
}

function applyTelegramVars(root: HTMLElement, merged: Record<string, string>) {
  Object.entries(merged).forEach(([key, value]) => {
    root.style.setProperty(toCssKey(key), value);
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;

    if (isStandaloneDev) {
      const applyDev = () => {
        const scheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        applyTelegramVars(root, mergeTelegramTheme(scheme, {}));
        root.style.colorScheme = scheme;
      };
      applyDev();
      const mq = window.matchMedia("(prefers-color-scheme: dark)");
      mq.addEventListener("change", applyDev);
      return () => mq.removeEventListener("change", applyDev);
    }

    let cleanup: (() => void) | undefined;

    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      const sync = () => {
        try {
          WebApp.ready();
          WebApp.expand();
          WebApp.disableVerticalSwipes();
        } catch {
          /** не внутри Telegram */
        }

        const scheme: "light" | "dark" = WebApp.colorScheme === "dark" ? "dark" : "light";
        const merged = mergeTelegramTheme(
          scheme,
          WebApp.themeParams as unknown as Partial<Record<string, string>>
        );
        applyTelegramVars(root, merged);
        root.style.colorScheme = scheme;
      };

      sync();
      WebApp.onEvent("themeChanged", sync);
      cleanup = () => WebApp.offEvent("themeChanged", sync);
    });

    return () => cleanup?.();
  }, []);

  return <>{children}</>;
}

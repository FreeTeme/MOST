"use client";

import { useEffect } from "react";
import { isStandaloneDev } from "@/lib/dev";

export function useWebAppBackButton(show: boolean, onClick?: () => void) {
  useEffect(() => {
    if (!show || !onClick || isStandaloneDev) return;
    let cancelled = false;
    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      if (cancelled) return;
      try {
        WebApp.BackButton.show();
        WebApp.BackButton.onClick(onClick);
      } catch {
        // не в Telegram
      }
    });
    return () => {
      cancelled = true;
      import("@twa-dev/sdk").then(({ default: WebApp }) => {
        try {
          WebApp.BackButton.hide();
        } catch {
          // ignore
        }
      });
    };
  }, [show, onClick]);
}

"use client";

import { useEffect } from "react";

export function useWebAppBackButton(show: boolean, onClick: () => void) {
  useEffect(() => {
    if (!show) return;
    let cancelled = false;
    import("@twa-dev/sdk").then(({ default: WebApp }) => {
      if (cancelled) return;
      WebApp.BackButton.show();
      WebApp.BackButton.onClick(onClick);
    });
    return () => {
      cancelled = true;
      import("@twa-dev/sdk").then(({ default: WebApp }) => WebApp.BackButton.hide());
    };
  }, [show, onClick]);
}

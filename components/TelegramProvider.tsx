"use client";

import { useEffect, useState, createContext, useContext } from "react";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramContextType {
  webApp: unknown;
  user: TelegramUser | null;
  loading: boolean;
  initData: string;
}

const TelegramContext = createContext<TelegramContextType>({
  webApp: null,
  user: null,
  loading: true,
  initData: "",
});

export const useTelegram = () => useContext(TelegramContext);

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webApp, setWebApp] = useState<unknown>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [initData, setInitData] = useState("");

  useEffect(() => {
    let cancelled = false;
    import("@twa-dev/sdk").then((module) => {
      const WebApp = module.default;
      if (cancelled || typeof window === "undefined") return;
      try {
        WebApp.ready();
        WebApp.expand();
        setWebApp(WebApp);
        setInitData(WebApp.initData || "");
        if (WebApp.initDataUnsafe?.user) {
          setUser(WebApp.initDataUnsafe.user);
        }
      } catch (error) {
        console.error("Telegram WebApp init error:", error);
      } finally {
        setLoading(false);
      }
    }).catch(() => setLoading(false));
    return () => { cancelled = true; };
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        user,
        loading,
        initData,
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

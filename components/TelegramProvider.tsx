"use client";

import { useEffect, useState, createContext, useContext } from "react";
import WebApp from "@twa-dev/sdk";

interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
}

interface TelegramContextType {
  webApp: typeof WebApp | null;
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
  const [webApp, setWebApp] = useState<typeof WebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      WebApp.ready();
      WebApp.expand();

      setWebApp(WebApp);

      if (WebApp.initDataUnsafe?.user) {
        setUser(WebApp.initDataUnsafe.user);
      }
    } catch (error) {
      console.error("Telegram WebApp init error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TelegramContext.Provider
      value={{
        webApp,
        user,
        loading,
        initData: WebApp.initData || "",
      }}
    >
      {children}
    </TelegramContext.Provider>
  );
}

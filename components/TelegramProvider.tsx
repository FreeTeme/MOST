"use client";

import { useEffect, useState, createContext, useContext } from "react";
import { isStandaloneDev, DEV_MOCK_TELEGRAM_USER } from "@/lib/dev";

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

const getInitialUser = (): TelegramUser | null => {
  if (typeof window === "undefined") return null;
  if (process.env.NODE_ENV === "production") return null;
  if (isStandaloneDev) return DEV_MOCK_TELEGRAM_USER as TelegramUser;
  if (process.env.NODE_ENV === "development") return DEV_MOCK_TELEGRAM_USER as TelegramUser;
  return null;
};

const getInitialLoading = (): boolean => {
  if (process.env.NODE_ENV === "production") return true;
  if (isStandaloneDev) return false;
  if (typeof window !== "undefined" && process.env.NODE_ENV === "development") return false;
  return true;
};

export default function TelegramProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [webApp, setWebApp] = useState<unknown>(null);
  const [user, setUser] = useState<TelegramUser | null>(getInitialUser);
  const [loading, setLoading] = useState(getInitialLoading);
  const [initData, setInitData] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (isStandaloneDev) {
      setUser(DEV_MOCK_TELEGRAM_USER as TelegramUser);
      setLoading(false);
      return;
    }

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
        } else if (process.env.NODE_ENV === "development") {
          setUser(DEV_MOCK_TELEGRAM_USER as TelegramUser);
        }
      } catch (error) {
        console.error("Telegram WebApp init error:", error);
        if (process.env.NODE_ENV === "development") {
          setUser(DEV_MOCK_TELEGRAM_USER as TelegramUser);
        }
      } finally {
        setLoading(false);
      }
    }).catch(() => {
      if (process.env.NODE_ENV === "development") {
        setUser(DEV_MOCK_TELEGRAM_USER as TelegramUser);
      }
      setLoading(false);
    });
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

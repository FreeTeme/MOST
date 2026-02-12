"use client";

import { useEffect } from "react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useRouter } from "next/navigation";
import { Button, Spinner } from "@telegram-apps/telegram-ui";
import WebApp from "@twa-dev/sdk";

export default function HomePage() {
  const { tgUser, dbUser, loading, isAuthenticated, register } =
    useTelegramAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && dbUser) {
      router.push(`/${dbUser.user_type === "blogger" ? "search" : "search"}`);
    }
  }, [loading, isAuthenticated, dbUser, router]);

  useEffect(() => {
    if (!loading && tgUser && !isAuthenticated) {
      WebApp.MainButton.setParams({
        text: "СТАТЬ БЛОГЕРОМ",
        color: "#2481cc",
        text_color: "#ffffff",
      });
      WebApp.MainButton.show();
      WebApp.MainButton.onClick(async () => {
        WebApp.MainButton.showProgress();
        try {
          await register("blogger");
          router.push("/search");
        } catch (error) {
          WebApp.showAlert("Ошибка регистрации");
        } finally {
          WebApp.MainButton.hideProgress();
        }
      });
    }
  }, [loading, tgUser, isAuthenticated, register, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="l" />
      </div>
    );
  }

  if (!tgUser) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">❌ Ошибка</h1>
          <p className="text-gray-600">
            Это приложение работает только внутри Telegram
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] p-4">
      <div className="max-w-md mx-auto pt-12">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: "var(--tg-theme-text-color)" }}
          >
            Influencer Platform
          </h1>
          <p style={{ color: "var(--tg-theme-hint-color)" }}>
            👋 Привет, {tgUser.first_name}!
          </p>
        </div>

        <div className="bg-[var(--tg-theme-secondary-bg-color)] rounded-xl p-6 mb-4">
          <p
            className="text-center mb-4"
            style={{ color: "var(--tg-theme-text-color)" }}
          >
            Нажмите кнопку внизу, чтобы продолжить как блогер
          </p>
          <Button
            mode="bezeled"
            size="l"
            stretched
            onClick={() => router.push("/role-select")}
          >
            Выбрать роль
          </Button>
        </div>
      </div>
    </div>
  );
}

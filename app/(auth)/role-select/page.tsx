"use client";

import { useEffect } from "react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useRouter } from "next/navigation";
import { Card, Cell, Button } from "@telegram-apps/telegram-ui";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { showAlert } from "@/lib/telegram";

export default function RoleSelectPage() {
  const { register, loading } = useTelegramAuth();
  const router = useRouter();

  useWebAppBackButton(true, () => router.push("/"));

  const handleSelectRole = async (role: "blogger" | "client") => {
    try {
      const WebApp = (await import("@twa-dev/sdk")).default;
      WebApp.MainButton.showProgress();
      await register(role);
      router.push("/search");
    } catch {
      showAlert("Ошибка при регистрации");
    } finally {
      import("@twa-dev/sdk").then((m) => m.default.MainButton.hideProgress());
    }
  };

  return (
    <div className="min-h-screen bg-[var(--tg-theme-bg-color)] p-4">
      <div className="pt-4">
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: "var(--tg-theme-text-color)" }}
        >
          Кто вы?
        </h1>
        <p className="mb-6" style={{ color: "var(--tg-theme-hint-color)" }}>
          Выберите роль, чтобы продолжить
        </p>

        <div className="space-y-4">
          <Card>
            <Cell
              before={
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(36, 129, 204, 0.1)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  📱
                </div>
              }
              subtitle="Ищу заказы для своего блога"
              after={
                <Button
                  mode="filled"
                  size="s"
                  onClick={() => handleSelectRole("blogger")}
                  disabled={loading}
                >
                  Выбрать
                </Button>
              }
            >
              Я блогер
            </Cell>
          </Card>

          <Card>
            <Cell
              before={
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: "rgba(36, 129, 204, 0.1)",
                    borderRadius: 12,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                  }}
                >
                  💼
                </div>
              }
              subtitle="Ищу блогеров для рекламы"
              after={
                <Button
                  mode="filled"
                  size="s"
                  onClick={() => handleSelectRole("client")}
                  disabled={loading}
                >
                  Выбрать
                </Button>
              }
            >
              Я заказчик
            </Cell>
          </Card>
        </div>
      </div>
    </div>
  );
}

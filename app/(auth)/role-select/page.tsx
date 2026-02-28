"use client";

import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useRouter } from "next/navigation";
import { Card, Button, Flex, Typography } from "antd";
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
    <div className="min-h-screen flex flex-col bg-[var(--tg-theme-bg-color)]">
      <div className="px-4 pt-6 pb-4">
        <Typography.Title level={2} className="!mb-1">
          Кто вы?
        </Typography.Title>
        <Typography.Text type="secondary">
          Выберите роль для продолжения
        </Typography.Text>
      </div>

      <div className="px-4 space-y-3">
        <Card size="small" className="rounded-2xl">
          <Flex align="center" gap={12}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(36,129,204,0.12)" }}
            >
              📱
            </div>
            <Flex vertical className="flex-1 min-w-0">
              <Typography.Text strong>Я блогер</Typography.Text>
              <Typography.Text type="secondary" className="text-sm">
                Нахожу рекламные заказы
              </Typography.Text>
            </Flex>
            <Button
              type="primary"
              size="small"
              loading={loading}
              onClick={() => handleSelectRole("blogger")}
            >
              Выбрать
            </Button>
          </Flex>
        </Card>

        <Card size="small" className="rounded-2xl">
          <Flex align="center" gap={12}>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "rgba(129,36,204,0.12)" }}
            >
              💼
            </div>
            <Flex vertical className="flex-1 min-w-0">
              <Typography.Text strong>Я заказчик</Typography.Text>
              <Typography.Text type="secondary" className="text-sm">
                Нахожу блогеров для рекламы
              </Typography.Text>
            </Flex>
            <Button
              type="primary"
              size="small"
              loading={loading}
              onClick={() => handleSelectRole("client")}
            >
              Выбрать
            </Button>
          </Flex>
        </Card>
      </div>

      <div className="mt-auto text-center px-6 pb-6">
        <Typography.Text type="secondary" className="text-xs">
          Роль можно изменить позже в настройках профиля
        </Typography.Text>
      </div>
    </div>
  );
}

"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { showAlert } from "@/lib/telegram";
import { isStandaloneDev } from "@/lib/dev";

type Role = "blogger" | "client";

const ROLES = [
  {
    id: "blogger",
    badge: "Блогер",
    title: "Я блогер",
    description: "Нахожу рекламные заказы",
  },
  {
    id: "client",
    badge: "Заказчик",
    title: "Я заказчик",
    description: "Нахожу блогеров для рекламы",
  },
] as const;

async function showWebAppProgress() {
  if (isStandaloneDev) return;
  const WebApp = (await import("@twa-dev/sdk")).default;
  WebApp.MainButton.showProgress?.();
}

function hideWebAppProgress() {
  if (isStandaloneDev) return;
  import("@twa-dev/sdk").then((m) => m.default.MainButton?.hideProgress?.());
}

export default function RoleSelectPage() {
  const router = useRouter();
  const { register, loading } = useTelegramAuth();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  useWebAppBackButton(true, () => router.push("/"));

  const handleSelectRole = useCallback(
    async (role: Role) => {
      if (loading) return;
      setSelectedRole(role);
      try {
        await showWebAppProgress();
        await register(role);
        router.push("/search");
      } catch {
        showAlert("Ошибка при регистрации");
      } finally {
        hideWebAppProgress();
        setSelectedRole(null);
      }
    },
    [register, router, loading]
  );

  return (
    <div className="flex min-h-screen flex-col bg-background p-4">
      <header className="py-8 text-center">
        <h1 className="text-3xl font-bold">Кто вы?</h1>
        <p className="text-sm text-muted-foreground">Выберите роль для продолжения</p>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center">
        <div className="flex w-full flex-col items-center gap-6">
          {ROLES.map((role) => {
            const isLoading = loading && selectedRole === role.id;

            return (
              <Card
                key={role.id}
                className="relative mx-auto w-full max-w-sm overflow-hidden pt-0"
              >
                <div className="absolute inset-0 z-30 aspect-video bg-black/35" />
                <img
                  src="https://avatar.vercel.sh/shadcn1"
                  alt=""
                  className="relative z-20 aspect-video w-full object-cover brightness-60 grayscale dark:brightness-40"
                />
                <CardHeader>
                  <CardAction>
                    <Badge variant="secondary">{role.badge}</Badge>
                  </CardAction>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={isLoading}
                    onClick={() => handleSelectRole(role.id)}
                  >
                    {isLoading ? "Загрузка…" : "Выбрать"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-xs text-muted-foreground">
          Роль можно изменить позже в настройках профиля
        </p>
      </footer>
    </div>
  );
}
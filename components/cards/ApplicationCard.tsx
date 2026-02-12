"use client";

import { Card, Cell, Button } from "@telegram-apps/telegram-ui";
import type { ApplicationWithOrder, ApplicationWithBlogger } from "@/types";
import type { ApplicationCardVariant } from "@/types";

type ApplicationItem = ApplicationWithOrder | ApplicationWithBlogger;

interface ApplicationCardProps {
  application: ApplicationItem;
  variant: ApplicationCardVariant;
  showStatus?: boolean;
  actions?: ("accept" | "reject")[];
  onStatusChange?: (applicationId: string, status: "accepted" | "rejected") => void;
  onOrderClick?: (orderId: string) => void;
  onBloggerClick?: (telegramId: number) => void;
}

const STATUS_LABELS: Record<string, string> = {
  pending: "На рассмотрении",
  accepted: "Принят",
  rejected: "Отклонён",
};

export function ApplicationCard({
  application,
  variant,
  showStatus = true,
  actions = [],
  onStatusChange,
  onOrderClick,
  onBloggerClick,
}: ApplicationCardProps) {
  const isOutgoing = variant === "outgoing";
  const order = "order" in application ? application.order : null;
  const blogger = "blogger" in application ? application.blogger : null;

  const title = isOutgoing
    ? order?.title ?? "Заказ"
    : blogger
      ? blogger.full_name || [blogger.first_name, blogger.last_name].filter(Boolean).join(" ") || `@${blogger.telegram_username}`
      : "Блогер";

  const subtitle = isOutgoing
    ? order
      ? `${order.category} · ${order.budget_amount ?? "—"} ${order.budget_currency}`
      : application.applied_at
        ? new Date(application.applied_at).toLocaleDateString("ru")
        : ""
    : application.message
      ? application.message.slice(0, 80) + (application.message.length > 80 ? "…" : "")
      : new Date(application.applied_at).toLocaleDateString("ru");

  return (
    <Card>
      <Cell
        before={
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "var(--tg-theme-secondary-bg-color)" }}
          >
            {isOutgoing ? "📋" : "👤"}
          </div>
        }
        subtitle={subtitle}
        onClick={
          isOutgoing && order
            ? () => onOrderClick?.(order.id)
            : !isOutgoing && blogger
              ? () => onBloggerClick?.(blogger.telegram_id)
              : undefined
        }
        multiline
      >
        <span style={{ color: "var(--tg-theme-text-color)" }}>{title}</span>
        {showStatus && (
          <span
            className="ml-2 text-sm"
            style={{ color: "var(--tg-theme-hint-color)" }}
          >
            · {STATUS_LABELS[application.status] ?? application.status}
          </span>
        )}
      </Cell>
      {actions.includes("accept") && application.status === "pending" && (
        <div className="flex gap-2 p-3 pt-0">
          <Button
            mode="filled"
            size="s"
            onClick={() => onStatusChange?.(application.id, "accepted")}
          >
            Принять
          </Button>
          <Button
            mode="plain"
            size="s"
            onClick={() => onStatusChange?.(application.id, "rejected")}
            style={{ color: "#e53935" }}
          >
            Отклонить
          </Button>
        </div>
      )}
    </Card>
  );
}

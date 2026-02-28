"use client";

import { Card, Button, Flex, Typography } from "antd";
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

  const handleClick = () => {
    if (isOutgoing && order) onOrderClick?.(order.id);
    else if (!isOutgoing && blogger) onBloggerClick?.(blogger.telegram_id);
  };

  return (
    <Card size="small" className="rounded-2xl">
      <Flex align="flex-start" gap={12} onClick={handleClick} className="cursor-pointer">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
        >
          {isOutgoing ? "📋" : "👤"}
        </div>
        <Flex vertical className="flex-1 min-w-0">
          <Typography.Text strong>
            {title}
            {showStatus && (
              <span className="ml-2 text-sm font-normal text-[var(--tg-theme-hint-color,#999)]">
                · {STATUS_LABELS[application.status] ?? application.status}
              </span>
            )}
          </Typography.Text>
          <Typography.Text type="secondary" className="text-sm">
            {subtitle}
          </Typography.Text>
        </Flex>
      </Flex>
      {actions.includes("accept") && application.status === "pending" && (
        <Flex gap={8} className="mt-3 pt-0">
          <Button
            type="primary"
            size="small"
            onClick={() => onStatusChange?.(application.id, "accepted")}
          >
            Принять
          </Button>
          <Button
            size="small"
            danger
            onClick={() => onStatusChange?.(application.id, "rejected")}
          >
            Отклонить
          </Button>
        </Flex>
      )}
    </Card>
  );
}

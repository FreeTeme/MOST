"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
    <Card>
      <CardContent className="pt-6">
        <div
          className="flex items-start gap-3 cursor-pointer"
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          role="button"
          tabIndex={0}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
            style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
          >
            {isOutgoing ? "📋" : "👤"}
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="font-medium" style={{ color: "var(--tg-theme-text-color)" }}>
              {title}
              {showStatus && (
                <span className="ml-2 text-sm font-normal" style={{ color: "var(--tg-theme-hint-color, #999)" }}>
                  · {STATUS_LABELS[application.status] ?? application.status}
                </span>
              )}
            </p>
            <p className="text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
              {subtitle}
            </p>
          </div>
        </div>
        {actions.includes("accept") && application.status === "pending" && (
          <div className="flex gap-2 mt-3">
            <Button
              size="sm"
              onClick={() => onStatusChange?.(application.id, "accepted")}
            >
              Принять
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={() => onStatusChange?.(application.id, "rejected")}
            >
              Отклонить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

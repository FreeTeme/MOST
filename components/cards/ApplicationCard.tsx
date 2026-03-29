"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
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
    ? (order?.title ?? "Заказ")
    : blogger
      ? blogger.full_name ||
        [blogger.first_name, blogger.last_name].filter(Boolean).join(" ") ||
        `@${blogger.telegram_username}`
      : "Блогер";

  const subtitle = isOutgoing
    ? order
      ? `${order.category} · ${order.budget_amount ?? "—"} ${order.budget_currency}`
      : application.applied_at
        ? new Date(application.applied_at).toLocaleDateString("ru")
        : ""
    : application.message
      ? `${application.message.slice(0, 80)}${application.message.length > 80 ? "…" : ""}`
      : new Date(application.applied_at).toLocaleDateString("ru");

  const handleClick = () => {
    if (isOutgoing && order) onOrderClick?.(order.id);
    else if (!isOutgoing && blogger) onBloggerClick?.(blogger.telegram_id);
  };

  const Icon = isOutgoing ? ClipboardList : UserRound;

  return (
    <Card className="app-motion overflow-hidden">
      <CardContent>
        <div
          className={cn(
            "flex cursor-pointer gap-[var(--space-3)] rounded-[var(--radius-app-sm)] outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--tg-theme-button-color)_35%,transparent)]",
            "transition-transform duration-[var(--app-duration-fast)] active:scale-[0.985]"
          )}
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          role="button"
          tabIndex={0}
        >
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-app-md)]"
            style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
          >
            <Icon className="size-5" style={{ color: "var(--tg-theme-button-color)" }} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[length:var(--text-body-sm)] font-semibold leading-[var(--text-body-sm--line)] text-[var(--tg-theme-text-color)]">
              {title}
              {showStatus ? (
                <span className="ml-1 text-[length:var(--text-caption)] font-normal text-[var(--tg-theme-hint-color)]">
                  · {STATUS_LABELS[application.status] ?? application.status}
                </span>
              ) : null}
            </p>
            <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              {subtitle}
            </p>
          </div>
        </div>
        {actions.includes("accept") && application.status === "pending" && (
          <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] sm:flex-row">
            <Button
              type="button"
              className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)] text-[length:var(--text-body-sm)] font-semibold"
              style={{
                backgroundColor: "var(--tg-theme-button-color)",
                color: "var(--tg-theme-button-text-color)",
              }}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(application.id, "accepted");
              }}
            >
              Принять
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)] text-[length:var(--text-body-sm)] font-semibold"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(application.id, "rejected");
              }}
            >
              Отклонить
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

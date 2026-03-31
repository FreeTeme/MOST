"use client";

import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import { emojiForOrderCategory, emojiForSocialPlatform } from "@/config/card-display.config";
import type { ApplicationWithOrder, ApplicationWithBlogger, Order } from "@/types";
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

function formatOrderBudgetLine(order: Order): string {
  if (order.budget_type === "barter") return "Бартер";
  if (order.budget_amount != null) {
    return `${Number(order.budget_amount).toLocaleString("ru-RU")} ${order.budget_currency}`;
  }
  return "—";
}

function ApplicationStatusBadge({ status }: { status: string }) {
  const label = STATUS_LABELS[status] ?? status;
  if (status === "accepted") {
    return (
      <span
        className={cn(
          "shrink-0 rounded-[var(--radius-app-pill)] px-[var(--space-2)] py-0.5",
          "text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--tracking-overline)]",
          "bg-[color-mix(in_oklab,#22c55e_18%,var(--app-surface-elevated))]",
          "text-[color-mix(in_oklab,#166534_88%,var(--tg-theme-text-color))]"
        )}
      >
        {label}
      </span>
    );
  }
  if (status === "rejected") {
    return (
      <span
        className={cn(
          "shrink-0 rounded-[var(--radius-app-pill)] px-[var(--space-2)] py-0.5",
          "text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--tracking-overline)]",
          "bg-[color-mix(in_oklab,var(--destructive)_14%,var(--app-surface-elevated))]",
          "text-[var(--destructive)]"
        )}
      >
        {label}
      </span>
    );
  }
  return (
    <span
      className={cn(
        "shrink-0 rounded-[var(--radius-app-pill)] px-[var(--space-2)] py-0.5",
        "text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--tracking-overline)]",
        "bg-[var(--app-surface-elevated)] text-[var(--tg-theme-hint-color)]"
      )}
    >
      {label}
    </span>
  );
}

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
  const bloggerSocials = "blogger_socials" in application ? application.blogger_socials : undefined;

  const title = isOutgoing
    ? (order?.title ?? "Заказ")
    : blogger
      ? blogger.full_name ||
        [blogger.first_name, blogger.last_name].filter(Boolean).join(" ") ||
        `@${blogger.telegram_username}`
      : "Блогер";

  const subtitle = isOutgoing
    ? order
      ? `${order.category} · ${formatOrderBudgetLine(order)}`
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

  const leadEmoji = isOutgoing
    ? emojiForOrderCategory(order?.category ?? "")
    : bloggerSocials?.length
      ? emojiForSocialPlatform(bloggerSocials[0].platform)
      : null;

  const iconShellClass = isOutgoing
    ? "bg-[color-mix(in_oklab,var(--app-gradient-peach)_14%,var(--app-surface-elevated))]"
    : "bg-[color-mix(in_oklab,var(--tg-theme-hint-color)_14%,var(--app-surface-elevated))]";

  return (
    <Card className="app-motion overflow-hidden">
      <CardContent className="px-[var(--space-4)] py-[var(--space-4)]">
        <div
          className={cn(
            "flex gap-[var(--space-3)]",
            "rounded-[var(--radius-app-md)] outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--app-gradient-peach)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-surface-card)]",
            "cursor-pointer transition-transform duration-[var(--app-duration-fast)] active:scale-[0.985]"
          )}
          onClick={handleClick}
          onKeyDown={(e) => e.key === "Enter" && handleClick()}
          role="button"
          tabIndex={0}
        >
          <div
            className={cn(
              "flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-app-lg)] text-[length:var(--text-title)]",
              iconShellClass
            )}
            aria-hidden
          >
            {leadEmoji ? (
              <span>{leadEmoji}</span>
            ) : (
              <Icon
                className={cn(
                  "size-6",
                  isOutgoing
                    ? "text-[color-mix(in_oklab,var(--app-gradient-rose)_72%,var(--tg-theme-text-color))]"
                    : "text-[var(--tg-theme-hint-color)]"
                )}
                strokeWidth={1.65}
              />
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-[var(--space-2)]">
            <div className="flex flex-wrap items-start justify-between gap-x-[var(--space-2)] gap-y-[var(--space-1)]">
              <p className="line-clamp-2 min-w-0 flex-1 text-[length:var(--text-body)] font-bold leading-[var(--text-body--line)] text-[var(--tg-theme-text-color)]">
                {title}
              </p>
              {showStatus ? <ApplicationStatusBadge status={application.status} /> : null}
            </div>
            <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              {subtitle}
            </p>
          </div>
        </div>
        {actions.includes("accept") && application.status === "pending" && (
          <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] sm:flex-row">
            <button
              type="button"
              className="app-btn-primary-gradient tap-compact min-h-12 flex-1 px-[var(--space-4)] text-[length:var(--text-body-sm)]"
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(application.id, "accepted");
              }}
            >
              Принять
            </button>
            <button
              type="button"
              className={cn(
                "tap-compact flex min-h-12 flex-1 items-center justify-center rounded-[var(--radius-app-pill)]",
                "border border-[color-mix(in_oklab,var(--destructive)_38%,var(--app-border))]",
                "bg-[var(--app-surface-card)] px-[var(--space-4)] text-[length:var(--text-body-sm)] font-semibold text-[var(--destructive)]",
                "transition-colors duration-[var(--app-duration-fast)]",
                "hover:bg-[color-mix(in_oklab,var(--destructive)_6%,var(--app-surface-card))]"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onStatusChange?.(application.id, "rejected");
              }}
            >
              Отклонить
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

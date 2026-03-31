"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { emojiForOrderCategory } from "@/config/card-display.config";
import type { Order, User } from "@/types";
import type { OrderCardVariant } from "@/types";

interface OrderCardProps {
  order: Order;
  client?: User | null;
  variant: OrderCardVariant;
  onApply?: () => void;
  onEdit?: () => void;
  onClose?: () => void;
  onClick?: () => void;
}

function formatBudget(order: Order): string {
  if (order.budget_type === "barter") return "Бартер";
  if (order.budget_amount != null) {
    return `${Number(order.budget_amount).toLocaleString("ru-RU")} ${order.budget_currency}`;
  }
  return "—";
}

function BudgetTypeBadge({ order }: { order: Order }) {
  if (order.budget_type === "barter") {
    return (
      <span
        className={cn(
          "shrink-0 rounded-[var(--radius-app-pill)] px-[var(--space-2)] py-0.5",
          "text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--tracking-overline)]",
          "bg-[color-mix(in_oklab,#22c55e_20%,var(--app-surface-elevated))]",
          "text-[color-mix(in_oklab,#166534_88%,var(--tg-theme-text-color))]"
        )}
      >
        Бартер
      </span>
    );
  }
  if (order.budget_type === "money") {
    return (
      <span
        className={cn(
          "shrink-0 rounded-[var(--radius-app-pill)] px-[var(--space-2)] py-0.5",
          "text-[length:var(--text-overline)] font-semibold uppercase tracking-[var(--tracking-overline)]",
          "bg-[color-mix(in_oklab,var(--tg-theme-button-color)_14%,var(--app-surface-elevated))]",
          "text-[var(--tg-theme-button-color)]"
        )}
      >
        Деньги
      </span>
    );
  }
  return null;
}

export function OrderCard({
  order,
  client,
  variant,
  onApply,
  onEdit,
  onClose,
  onClick,
}: OrderCardProps) {
  const isPressable = variant !== "editable" && !!onClick;
  const catEmoji = emojiForOrderCategory(order.category);

  return (
    <Card
      className={cn(
        "app-motion overflow-hidden transition-[transform,box-shadow] duration-[var(--app-duration-fast)]",
        isPressable && "cursor-pointer active:scale-[0.985]"
      )}
    >
      <CardContent className="px-[var(--space-4)] py-[var(--space-4)]">
        <div
          className={cn(
            "flex gap-[var(--space-3)]",
            isPressable &&
              "rounded-[var(--radius-app-md)] outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--app-gradient-peach)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-surface-card)]"
          )}
          onClick={isPressable ? onClick : undefined}
          onKeyDown={isPressable && onClick ? (e) => e.key === "Enter" && onClick() : undefined}
          role={isPressable ? "button" : undefined}
          tabIndex={isPressable ? 0 : undefined}
        >
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-app-lg)]"
            style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
          >
            <FileText className="size-6" style={{ color: "var(--tg-theme-button-color)" }} aria-hidden />
          </div>
          <div className="min-w-0 flex-1 space-y-[var(--space-2)]">
            <div className="flex items-start justify-between gap-[var(--space-2)]">
              <p className="line-clamp-2 text-[length:var(--text-body)] font-bold leading-[var(--text-body--line)] text-[var(--tg-theme-text-color)]">
                {order.title}
              </p>
              <BudgetTypeBadge order={order} />
            </div>

            {variant === "compact" && order.description ? (
              <p className="line-clamp-2 text-[length:var(--text-body-sm)] leading-[var(--text-body-sm--line)] text-[color-mix(in_oklab,var(--tg-theme-hint-color)_92%,var(--tg-theme-text-color))]">
                {order.description}
              </p>
            ) : null}

            {variant === "detailed" && order.description ? (
              <p className="text-[length:var(--text-body-sm)] leading-relaxed text-[var(--tg-theme-hint-color)]">{order.description}</p>
            ) : null}

            {variant === "detailed" && client ? (
              <p className="text-[length:var(--text-body-sm)] text-[var(--tg-theme-hint-color)]">
                Заказчик: {client.company_name || client.full_name || "—"}
              </p>
            ) : null}

            <div className="flex flex-wrap gap-[var(--space-2)]">
              <span className="app-chip inline-flex py-[var(--space-1)] text-[length:var(--text-caption)]">
                <span aria-hidden>{catEmoji}</span>
                <span>{order.category}</span>
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-[var(--space-2)] text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              <span className="font-medium text-[color-mix(in_oklab,var(--tg-theme-text-color)_78%,var(--tg-theme-hint-color))]">{formatBudget(order)}</span>
              {order.applications_count > 0 ? (
                <span>
                  {order.applications_count}{" "}
                  {order.applications_count === 1 ? "отклик" : order.applications_count < 5 ? "отклика" : "откликов"}
                </span>
              ) : (
                <span>Нет откликов</span>
              )}
            </div>
          </div>
        </div>

        {variant === "compact" && onApply && (
          <button
            type="button"
            className="app-btn-primary-gradient tap-compact mt-[var(--space-4)] w-full"
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
          >
            Откликнуться
          </button>
        )}

        {variant === "editable" && (onEdit || onClose) && (
          <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] sm:flex-row">
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-pill)]"
                onClick={onEdit}
              >
                Изменить
              </Button>
            )}
            {onClose && (
              <Button
                type="button"
                variant="destructive"
                className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-pill)]"
                onClick={onClose}
              >
                Закрыть
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

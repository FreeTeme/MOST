"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { cn } from "@/lib/utils";
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
    return `${Number(order.budget_amount).toLocaleString()} ${order.budget_currency}`;
  }
  return "—";
}

const ctaStyle = {
  backgroundColor: "var(--tg-theme-button-color)",
  color: "var(--tg-theme-button-text-color)",
} as const;

export function OrderCard({
  order,
  client,
  variant,
  onApply,
  onEdit,
  onClose,
  onClick,
}: OrderCardProps) {
  const subtitle =
    variant === "compact"
      ? `${order.category} · ${formatBudget(order)}${order.applications_count > 0 ? ` · ${order.applications_count} откликов` : ""}`
      : variant === "detailed"
        ? `${order.category} · ${formatBudget(order)}`
        : `${order.category} · ${formatBudget(order)}`;

  const isPressable = variant !== "editable" && !!onClick;

  return (
    <Card
      className={cn(
        "app-motion overflow-hidden transition-[transform,box-shadow] duration-[var(--app-duration-fast)]",
        isPressable && "cursor-pointer active:scale-[0.985]"
      )}
    >
      <CardContent>
        <div
          className={cn(
            "flex gap-[var(--space-3)]",
            isPressable &&
              "rounded-[var(--radius-app-sm)] outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--tg-theme-button-color)_35%,transparent)]"
          )}
          onClick={isPressable ? onClick : undefined}
          onKeyDown={
            isPressable && onClick ? (e) => e.key === "Enter" && onClick() : undefined
          }
          role={isPressable ? "button" : undefined}
          tabIndex={isPressable ? 0 : undefined}
        >
          <div
            className="flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-app-md)]"
            style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
          >
            <FileText className="size-5" style={{ color: "var(--tg-theme-button-color)" }} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[length:var(--text-body-sm)] font-semibold leading-[var(--text-body-sm--line)] text-[var(--tg-theme-text-color)]">
              {order.title}
            </p>
            <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              {subtitle}
            </p>
            {variant === "detailed" && order.description && (
              <p className="mt-2 text-sm leading-relaxed text-[var(--tg-theme-hint-color)]">{order.description}</p>
            )}
            {variant === "detailed" && client && (
              <p className="mt-1 text-sm text-[var(--tg-theme-hint-color)]">
                Заказчик: {client.company_name || client.full_name || "—"}
              </p>
            )}
          </div>
        </div>
        {variant === "compact" && onApply && (
          <Button
            size="sm"
            className="tap-compact mt-[var(--space-4)] h-12 w-full rounded-[var(--radius-app-sm)] text-[length:var(--text-body-sm)] font-semibold"
            style={ctaStyle}
            onClick={(e) => {
              e.stopPropagation();
              onApply();
            }}
          >
            Откликнуться
          </Button>
        )}
        {variant === "editable" && (onEdit || onClose) && (
          <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] sm:flex-row">
            {onEdit && (
              <Button
                type="button"
                variant="outline"
                className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)]"
                onClick={onEdit}
              >
                Изменить
              </Button>
            )}
            {onClose && (
              <Button
                type="button"
                variant="destructive"
                className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)]"
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

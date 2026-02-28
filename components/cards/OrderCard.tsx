"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
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

  return (
    <Card>
      <CardContent className="pt-6">
        <div
          className={`flex items-start gap-3 ${variant !== "editable" ? "cursor-pointer" : ""}`}
          onClick={variant !== "editable" ? onClick : undefined}
          onKeyDown={
            variant !== "editable" && onClick
              ? (e) => e.key === "Enter" && onClick()
              : undefined
          }
          role={variant !== "editable" ? "button" : undefined}
          tabIndex={variant !== "editable" ? 0 : undefined}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
          >
            <FileText className="size-5" style={{ color: "var(--tg-theme-button-color)" }} />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="font-medium" style={{ color: "var(--tg-theme-text-color)" }}>
              {order.title}
            </p>
            <p className="text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
              {subtitle}
            </p>
            {variant === "detailed" && order.description && (
              <p className="text-sm mt-2 block" style={{ color: "var(--tg-theme-hint-color)" }}>
                {order.description}
              </p>
            )}
            {variant === "detailed" && client && (
              <p className="text-sm mt-1 block" style={{ color: "var(--tg-theme-hint-color)" }}>
                Заказчик: {client.company_name || client.full_name || "—"}
              </p>
            )}
          </div>
        </div>
        {variant === "compact" && onApply && (
          <Button size="sm" className="w-full mt-3" onClick={onApply}>
            Откликнуться
          </Button>
        )}
        {variant === "editable" && (onEdit || onClose) && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                Изменить
              </Button>
            )}
            {onClose && (
              <Button size="sm" variant="destructive" onClick={onClose}>
                Закрыть
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

"use client";

import { Card, Cell, Button } from "@telegram-apps/telegram-ui";
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

  const content = (
    <Cell
      before={
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: "var(--tg-theme-secondary-bg-color)" }}
        >
          📋
        </div>
      }
      subtitle={subtitle}
      onClick={variant !== "editable" ? onClick : undefined}
      multiline
    >
      <span style={{ color: "var(--tg-theme-text-color)" }}>{order.title}</span>
      {variant === "detailed" && order.description && (
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          {order.description}
        </p>
      )}
      {variant === "detailed" && client && (
        <p className="mt-1 text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
          Заказчик: {client.company_name || client.full_name || "—"}
        </p>
      )}
    </Cell>
  );

  return (
    <Card>
      {content}
      {variant === "compact" && onApply && (
        <div className="p-3 pt-0">
          <Button mode="filled" size="s" stretched onClick={onApply}>
            Откликнуться
          </Button>
        </div>
      )}
      {variant === "editable" && (onEdit || onClose) && (
        <div className="flex gap-2 p-3 pt-0">
          {onEdit && (
            <Button mode="bezeled" size="s" onClick={onEdit}>
              Изменить
            </Button>
          )}
          {onClose && (
            <Button mode="plain" size="s" onClick={onClose} style={{ color: "#e53935" }}>
              Закрыть
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

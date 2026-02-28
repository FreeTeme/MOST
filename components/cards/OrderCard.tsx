"use client";

import { Card, Button, Flex, Typography } from "antd";
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
    <Card size="small" className="rounded-2xl">
      <Flex
        align="flex-start"
        gap={12}
        onClick={variant !== "editable" ? onClick : undefined}
        className={variant !== "editable" ? "cursor-pointer" : ""}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
        >
          📋
        </div>
        <Flex vertical className="flex-1 min-w-0">
          <Typography.Text strong>{order.title}</Typography.Text>
          <Typography.Text type="secondary" className="text-sm">
            {subtitle}
          </Typography.Text>
          {variant === "detailed" && order.description && (
            <Typography.Text type="secondary" className="text-sm mt-2 block">
              {order.description}
            </Typography.Text>
          )}
          {variant === "detailed" && client && (
            <Typography.Text type="secondary" className="text-sm mt-1 block">
              Заказчик: {client.company_name || client.full_name || "—"}
            </Typography.Text>
          )}
        </Flex>
      </Flex>
      {variant === "compact" && onApply && (
        <Button type="primary" size="small" block className="mt-3" onClick={onApply}>
          Откликнуться
        </Button>
      )}
      {variant === "editable" && (onEdit || onClose) && (
        <Flex gap={8} className="mt-3">
          {onEdit && (
            <Button size="small" onClick={onEdit}>
              Изменить
            </Button>
          )}
          {onClose && (
            <Button size="small" danger onClick={onClose}>
              Закрыть
            </Button>
          )}
        </Flex>
      )}
    </Card>
  );
}

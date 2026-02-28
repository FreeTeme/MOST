"use client";

import { Card, Button, Flex, Typography } from "antd";
import type { SocialAccount, User } from "@/types";
import type { SocialCardVariant } from "@/types";

interface SocialCardProps {
  social: SocialAccount;
  blogger?: User | null;
  variant: SocialCardVariant;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function SocialCard({
  social,
  blogger,
  variant,
  onClick,
  onEdit,
  onDelete,
}: SocialCardProps) {
  const displayName =
    blogger?.full_name ||
    [blogger?.first_name, blogger?.last_name].filter(Boolean).join(" ") ||
    `@${blogger?.telegram_username || "—"}`;

  const subtitle =
    variant === "compact"
      ? `${social.platform} · ${social.followers.toLocaleString()} подп. · ${social.niche}`
      : variant === "detailed"
        ? `${social.platform} · ${social.followers.toLocaleString()} подписчиков`
        : `${social.platform} · ${social.niche}`;

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
          📱
        </div>
        <Flex vertical className="flex-1 min-w-0">
          <Typography.Text strong>{displayName}</Typography.Text>
          <Typography.Text type="secondary" className="text-sm">
            {subtitle}
          </Typography.Text>
          {variant === "detailed" && social.profile_url && (
            <a
              href={social.profile_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm mt-1"
              style={{ color: "var(--tg-theme-button-color, #2481cc)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {social.profile_url}
            </a>
          )}
        </Flex>
      </Flex>
      {variant === "editable" && (onEdit || onDelete) && (
        <Flex gap={8} className="mt-3">
          {onEdit && (
            <Button size="small" onClick={onEdit}>
              Изменить
            </Button>
          )}
          {onDelete && (
            <Button size="small" danger onClick={onDelete}>
              Удалить
            </Button>
          )}
        </Flex>
      )}
    </Card>
  );
}

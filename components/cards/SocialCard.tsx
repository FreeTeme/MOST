"use client";

import { Card, Cell, Button } from "@telegram-apps/telegram-ui";
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

  const content = (
    <Cell
      before={
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0"
          style={{ background: "var(--tg-theme-secondary-bg-color)" }}
        >
          📱
        </div>
      }
      subtitle={subtitle}
      onClick={variant !== "editable" ? onClick : undefined}
      multiline
    >
      <span style={{ color: "var(--tg-theme-text-color)" }}>{displayName}</span>
      {variant === "detailed" && social.profile_url && (
        <div className="mt-1">
          <a
            href={social.profile_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm"
            style={{ color: "var(--tg-theme-link-color)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {social.profile_url}
          </a>
        </div>
      )}
    </Cell>
  );

  return (
    <Card>
      {content}
      {variant === "editable" && (onEdit || onDelete) && (
        <div className="flex gap-2 p-3 pt-0">
          {onEdit && (
            <Button mode="bezeled" size="s" onClick={onEdit}>
              Изменить
            </Button>
          )}
          {onDelete && (
            <Button mode="plain" size="s" onClick={onDelete} style={{ color: "#e53935" }}>
              Удалить
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}

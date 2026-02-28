"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
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
            <Smartphone className="size-5" style={{ color: "var(--tg-theme-button-color)" }} />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="font-medium" style={{ color: "var(--tg-theme-text-color)" }}>
              {displayName}
            </p>
            <p className="text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
              {subtitle}
            </p>
            {variant === "detailed" && social.profile_url && (
              <a
                href={social.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm mt-1 block"
                style={{ color: "var(--tg-theme-button-color, #2481cc)" }}
                onClick={(e) => e.stopPropagation()}
              >
                {social.profile_url}
              </a>
            )}
          </div>
        </div>
        {variant === "editable" && (onEdit || onDelete) && (
          <div className="flex gap-2 mt-3">
            {onEdit && (
              <Button size="sm" variant="outline" onClick={onEdit}>
                Изменить
              </Button>
            )}
            {onDelete && (
              <Button size="sm" variant="destructive" onClick={onDelete}>
                Удалить
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

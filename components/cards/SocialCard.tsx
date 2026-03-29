"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";
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
            isPressable && "rounded-[var(--radius-app-sm)] outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,var(--tg-theme-button-color)_35%,transparent)]"
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
            <Smartphone className="size-5" style={{ color: "var(--tg-theme-button-color)" }} />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <p className="text-[length:var(--text-body-sm)] font-semibold leading-[var(--text-body-sm--line)] text-[var(--tg-theme-text-color)]">
              {displayName}
            </p>
            <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              {subtitle}
            </p>
            {variant === "detailed" && social.profile_url && (
              <a
                href={social.profile_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-[var(--space-2)] block text-[length:var(--text-caption)] font-semibold leading-[var(--text-caption--line)] text-[var(--tg-theme-button-color)]"
                onClick={(e) => e.stopPropagation()}
              >
                {social.profile_url}
              </a>
            )}
          </div>
        </div>
        {variant === "editable" && (onEdit || onDelete) && (
          <div className="mt-[var(--space-4)] flex flex-col gap-[var(--space-2)] sm:flex-row">
            {onEdit && (
              <Button type="button" variant="outline" className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)]" onClick={onEdit}>
                Изменить
              </Button>
            )}
            {onDelete && (
              <Button type="button" variant="destructive" className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)]" onClick={onDelete}>
                Удалить
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

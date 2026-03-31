"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { emojiForNiche, emojiForSocialPlatform } from "@/config/card-display.config";
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

export function SocialCard({ social, blogger, variant, onClick, onEdit, onDelete }: SocialCardProps) {
  const displayName =
    blogger?.full_name ||
    [blogger?.first_name, blogger?.last_name].filter(Boolean).join(" ") ||
    `@${blogger?.telegram_username || "—"}`;

  const platformEmoji = emojiForSocialPlatform(social.platform);
  const nicheEmoji = emojiForNiche(social.niche);

  const isPressable = variant !== "editable" && !!onClick;

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
            className="flex size-14 shrink-0 items-center justify-center rounded-[var(--radius-app-lg)] text-[length:var(--text-title)]"
            style={{ background: "var(--tg-theme-secondary-bg-color, #f0f2f5)" }}
            aria-hidden
          >
            <span>{platformEmoji}</span>
          </div>
          <div className="min-w-0 flex-1 space-y-[var(--space-2)]">
            <p className="line-clamp-2 text-[length:var(--text-body)] font-bold leading-[var(--text-body--line)] text-[var(--tg-theme-text-color)]">
              {displayName}
            </p>
            <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              {social.platform} · {social.followers.toLocaleString("ru-RU")} подп.
            </p>

            {variant === "compact" && social.niche ? (
              <div className="flex flex-wrap gap-[var(--space-2)]">
                <span className="app-chip inline-flex py-[var(--space-1)] text-[length:var(--text-caption)]">
                  <span aria-hidden>{nicheEmoji}</span>
                  <span className="line-clamp-1">{social.niche}</span>
                </span>
              </div>
            ) : null}

            {variant === "detailed" && (
              <>
                <p className="text-[length:var(--text-body-sm)] text-[var(--tg-theme-hint-color)]">Ниша: {social.niche}</p>
                {social.profile_url && (
                  <a
                    href={social.profile_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-[var(--space-1)] block text-[length:var(--text-caption)] font-semibold leading-[var(--text-caption--line)] text-[var(--tg-theme-button-color)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {social.profile_url}
                  </a>
                )}
              </>
            )}
          </div>
        </div>

        {variant === "editable" && (onEdit || onDelete) && (
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
            {onDelete && (
              <Button
                type="button"
                variant="destructive"
                className="tap-compact h-12 min-h-12 flex-1 rounded-[var(--radius-app-pill)]"
                onClick={onDelete}
              >
                Удалить
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

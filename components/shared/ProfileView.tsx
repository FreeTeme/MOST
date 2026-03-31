"use client";

import { MessageCircle } from "lucide-react";
import type { User, SocialAccount, Order, Review } from "@/types";
import { SocialCard } from "@/components/cards/SocialCard";
import { OrderCard } from "@/components/cards/OrderCard";
import { ReviewList } from "./ReviewList";
import { cn } from "@/lib/utils";
import { openTelegramLink } from "@/lib/telegram";

interface ProfileConfigShape {
  title: string;
  fields: string[];
  card: string;
  cardVariant: string;
  canEdit: boolean;
  showReviews: boolean;
  actions?: string[];
}

export interface ProfileViewProps {
  profile: User;
  items: SocialAccount[] | Order[];
  reviews: Review[];
  config: ProfileConfigShape | null;
  isOwnProfile: boolean;
  /** Зарезервировано для экрана редактирования профиля */
  onUpdateProfile?: (updates: Partial<User>) => Promise<void>;
  onEditItem?: (item: SocialAccount | Order) => void;
  onDeleteItem?: (item: SocialAccount | Order) => void;
  onWriteReview?: () => void;
}

const fieldLabels: Record<string, string> = {
  full_name: "Имя",
  bio: "О себе",
  telegram: "Telegram",
  company_name: "Название компании",
  category: "Категория",
  description: "Описание",
};

function computeProfileCompleteness(profile: User): number {
  if (profile.user_type === "blogger") {
    const checks = [
      Boolean(profile.full_name?.trim() || profile.first_name),
      Boolean(profile.bio?.trim()),
      Boolean(profile.photo_url),
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }
  const checks = [
    Boolean(profile.company_name?.trim()),
    Boolean(profile.company_category?.trim()),
    Boolean(profile.company_description?.trim()),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function Section({
  title,
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("flex flex-col gap-[var(--space-4)]", className)}>
      {title ? <h2 className="app-overline">{title}</h2> : null}
      {children}
    </section>
  );
}

function AvatarBlock({
  profile,
  className,
  ringClass,
}: {
  profile: User;
  className?: string;
  ringClass?: string;
}) {
  if (profile.photo_url) {
    return (
      <img
        src={profile.photo_url}
        alt=""
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center font-bold",
        className,
        ringClass,
        "bg-[var(--tg-theme-button-color)] text-[var(--tg-theme-button-text-color)]"
      )}
    >
      <span className="text-[length:var(--text-title)] leading-none">
        {(profile.first_name?.[0] || profile.company_name?.[0] || "?").toUpperCase()}
      </span>
    </div>
  );
}

export function ProfileView({
  profile,
  items,
  reviews,
  config,
  isOwnProfile,
  onEditItem,
  onDeleteItem,
  onWriteReview,
}: ProfileViewProps) {
  if (!config) return null;

  const isBlogger = profile.user_type === "blogger";
  const completeness = computeProfileCompleteness(profile);

  const getFieldValue = (field: string): string => {
    switch (field) {
      case "full_name":
        return profile.full_name || [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "—";
      case "bio":
        return profile.bio || "—";
      case "telegram":
        return profile.telegram_username ? `@${profile.telegram_username}` : "—";
      case "company_name":
        return profile.company_name || "—";
      case "category":
        return profile.company_category || "—";
      case "description":
        return profile.company_description || "—";
      default:
        return "—";
    }
  };

  const primaryTitle = isBlogger ? getFieldValue("full_name") : getFieldValue("company_name");
  const heroSubtitle = isBlogger
    ? profile.telegram_username
      ? `@${profile.telegram_username}`
      : getFieldValue("category") !== "—"
        ? getFieldValue("category")
        : "Блогер"
    : profile.company_category || (profile.telegram_username ? `@${profile.telegram_username}` : "Компания");

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      {/* Hero: референс — фото или мягкий градиент + затемнение снизу */}
      <div className="-mx-[var(--app-page-gutter)]">
        <div
          className={cn(
            "relative min-h-[14rem] w-full overflow-hidden",
            "rounded-b-[var(--radius-app-xl)] sm:min-h-[15rem]"
          )}
        >
          {profile.photo_url ? (
            <>
              <img
                src={profile.photo_url}
                alt=""
                className="absolute inset-0 size-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklab,var(--tg-theme-text-color)_78%,transparent)] via-[color-mix(in_oklab,var(--tg-theme-text-color)_35%,transparent)] to-transparent"
                aria-hidden
              />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 bg-[color-mix(in_oklab,var(--app-gradient-peach)_42%,var(--app-canvas))]"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_oklab,var(--app-gradient-rose)_28%,transparent)] to-transparent"
                aria-hidden
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-[color-mix(in_oklab,var(--tg-theme-text-color)_55%,transparent)] via-transparent to-transparent"
                aria-hidden
              />
            </>
          )}

          <div className="relative flex min-h-[14rem] flex-col justify-end p-[var(--space-4)] pb-[var(--space-5)] sm:min-h-[15rem]">
            <div className="flex items-end gap-[var(--space-3)]">
              <AvatarBlock
                profile={profile}
                className="size-14 shrink-0 rounded-[var(--radius-app-md)] ring-2 ring-white/90"
              />
              <div className="min-w-0 pb-0.5">
                <p className="truncate text-[length:var(--text-title)] font-bold leading-[var(--text-title--line)] text-white drop-shadow-md">
                  {primaryTitle}
                </p>
                <p className="mt-0.5 truncate text-[length:var(--text-body-sm)] leading-[var(--text-body-sm--line)] text-white/90 drop-shadow">
                  {heroSubtitle}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isOwnProfile ? (
        <Section title="Мой профиль">
          <div className="app-card-elevated p-[var(--space-4)]">
            <div className="mb-[var(--space-3)] flex items-center justify-between gap-[var(--space-3)]">
              <span
                className={cn(
                  "rounded-[var(--radius-app-pill)] px-[var(--space-3)] py-1",
                  "text-[length:var(--text-caption)] font-semibold leading-[var(--text-caption--line)]",
                  "bg-[color-mix(in_oklab,#22c55e_22%,var(--app-surface-elevated))]",
                  "text-[color-mix(in_oklab,#166534_90%,var(--tg-theme-text-color))]"
                )}
              >
                Активен
              </span>
              <span className="text-[length:var(--text-title)] font-bold tabular-nums text-[var(--app-gradient-rose)]">
                {completeness}%
              </span>
            </div>
            <p className="app-form-label mb-[var(--space-2)]">Заполненность профиля</p>
            <div className="h-2.5 w-full overflow-hidden rounded-[var(--radius-app-pill)] bg-[var(--app-surface-elevated)]">
              <div
                className="h-full min-w-0 rounded-[var(--radius-app-pill)] transition-[width] duration-[var(--app-duration)] ease-out"
                style={{
                  width: `${completeness}%`,
                  background: "var(--app-gradient-primary)",
                }}
              />
            </div>
            <p className="mt-[var(--space-3)] text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              Заполните профиль — так заказчикам и блогерам проще доверять и договариваться.
            </p>
          </div>
        </Section>
      ) : null}

      <Section title="Основное">
        <div className="app-card divide-y divide-[var(--app-border)] overflow-hidden p-0">
          {config.fields.map((field) => (
            <div key={field} className="px-[var(--space-4)] py-[var(--space-4)] sm:px-[var(--space-5)]">
              <p className="app-form-label">{fieldLabels[field] ?? field}</p>
              <p className="mt-[var(--space-2)] text-[length:var(--text-body-sm)] leading-[var(--text-body-sm--line)] text-[var(--tg-theme-text-color)]">
                {getFieldValue(field)}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {items.length > 0 && (
        <Section title={isBlogger ? "Соцсети" : "Заказы"}>
          <div className="flex flex-col gap-[var(--app-list-gap)]">
            {items.map((item) =>
              isBlogger ? (
                <SocialCard
                  key={(item as SocialAccount).id}
                  social={item as SocialAccount}
                  blogger={profile}
                  variant={config.cardVariant as "compact" | "detailed" | "editable"}
                  onEdit={onEditItem ? () => onEditItem(item) : undefined}
                  onDelete={onDeleteItem ? () => onDeleteItem(item) : undefined}
                />
              ) : (
                <OrderCard
                  key={(item as Order).id}
                  order={item as Order}
                  client={profile}
                  variant={config.cardVariant as "compact" | "detailed" | "editable"}
                  onEdit={onEditItem ? () => onEditItem(item) : undefined}
                  onClose={onDeleteItem ? () => onDeleteItem(item) : undefined}
                />
              )
            )}
          </div>
        </Section>
      )}

      {config.showReviews && (
        <section className="flex flex-col gap-[var(--space-4)]">
          <div className="flex items-center justify-between gap-[var(--space-3)]">
            <h2 className="app-overline">Отзывы</h2>
            {!isOwnProfile && config.actions?.includes("write_review") && onWriteReview ? (
              <button
                type="button"
                onClick={onWriteReview}
                className="tap-compact shrink-0 text-[length:var(--text-caption)] font-semibold text-[var(--tg-theme-button-color)]"
              >
                Написать отзыв
              </button>
            ) : null}
          </div>
          <ReviewList reviews={reviews} />
        </section>
      )}

      {!isOwnProfile && profile.telegram_username ? (
        <button
          type="button"
          className="app-btn-primary-gradient tap-compact w-full gap-[var(--space-2)]"
          onClick={() => openTelegramLink(`https://t.me/${profile.telegram_username}`)}
        >
          <MessageCircle className="size-5 shrink-0" strokeWidth={2} aria-hidden />
          Написать в Telegram
        </button>
      ) : null}
    </div>
  );
}

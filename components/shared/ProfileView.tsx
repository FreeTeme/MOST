"use client";

import type { User, SocialAccount, Order, Review } from "@/types";
import { SocialCard } from "@/components/cards/SocialCard";
import { OrderCard } from "@/components/cards/OrderCard";
import { ReviewList } from "./ReviewList";
import { cn } from "@/lib/utils";

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

  return (
    <div className="flex flex-col gap-[var(--space-6)]">
      <div
        className={cn(
          "flex items-center gap-[var(--space-4)] rounded-[var(--radius-app-lg)] p-[var(--space-4)] shadow-[var(--app-shadow-xs)]",
          "bg-[var(--app-surface-muted)] ring-1 ring-[var(--app-border)]"
        )}
      >
        {profile.photo_url ? (
          <img src={profile.photo_url} alt="" className="size-16 shrink-0 rounded-full object-cover ring-2 ring-[color-mix(in_oklab,var(--tg-theme-hint-color)_20%,transparent)]" />
        ) : (
          <div
            className="flex size-16 shrink-0 items-center justify-center rounded-full text-xl font-bold"
            style={{ background: "var(--tg-theme-button-color)", color: "var(--tg-theme-button-text-color)" }}
          >
            {(profile.first_name?.[0] || "?").toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-[length:var(--text-title)] font-bold leading-[var(--text-title--line)] text-[var(--tg-theme-text-color)]">
            {isBlogger ? getFieldValue("full_name") : getFieldValue("company_name")}
          </p>
          {profile.telegram_username ? (
            <p className="mt-1 truncate text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
              @{profile.telegram_username}
            </p>
          ) : null}
        </div>
      </div>

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
    </div>
  );
}

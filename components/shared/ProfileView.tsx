"use client";

import type { User, SocialAccount, Order, Review } from "@/types";
import { SocialCard } from "@/components/cards/SocialCard";
import { OrderCard } from "@/components/cards/OrderCard";
import { ReviewList } from "./ReviewList";
interface ProfileConfigShape {
  title: string;
  fields: string[];
  card: string;
  cardVariant: string;
  canEdit: boolean;
  showReviews: boolean;
  actions?: string[];
}

interface ProfileViewProps {
  profile: User;
  items: SocialAccount[] | Order[];
  reviews: Review[];
  config: ProfileConfigShape | null;
  isOwnProfile: boolean;
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

export function ProfileView({
  profile,
  items,
  reviews,
  config,
  isOwnProfile,
  onUpdateProfile,
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
    <div className="space-y-6">
      <div
        className="rounded-xl p-4 flex items-center gap-4"
        style={{ background: "var(--tg-theme-secondary-bg-color)" }}
      >
        {profile.photo_url ? (
          <img
            src={profile.photo_url}
            alt=""
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
            style={{ background: "var(--tg-theme-button-color)", color: "var(--tg-theme-button-text-color)" }}
          >
            {(profile.first_name?.[0] || "?").toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-semibold truncate" style={{ color: "var(--tg-theme-text-color)" }}>
            {isBlogger ? getFieldValue("full_name") : getFieldValue("company_name")}
          </h1>
          {profile.telegram_username && (
            <p className="text-sm truncate" style={{ color: "var(--tg-theme-hint-color)" }}>
              @{profile.telegram_username}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        {config.fields.map((field) => (
          <div key={field}>
            <span className="text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
              {fieldLabels[field] ?? field}:
            </span>
            <p style={{ color: "var(--tg-theme-text-color)" }}>{getFieldValue(field)}</p>
          </div>
        ))}
      </div>

      {items.length > 0 && (
        <div>
          <h2 className="text-lg font-medium mb-3" style={{ color: "var(--tg-theme-text-color)" }}>
            {isBlogger ? "Соцсети" : "Заказы"}
          </h2>
          <div className="space-y-3">
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
        </div>
      )}

      {config.showReviews && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-medium" style={{ color: "var(--tg-theme-text-color)" }}>
              Отзывы
            </h2>
            {!isOwnProfile && config.actions?.includes("write_review") && onWriteReview && (
              <button
                type="button"
                onClick={onWriteReview}
                className="text-sm font-medium"
                style={{ color: "var(--tg-theme-link-color)" }}
              >
                Написать отзыв
              </button>
            )}
          </div>
          <ReviewList reviews={reviews} />
        </div>
      )}
    </div>
  );
}

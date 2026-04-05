"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Flame } from "lucide-react";
import type { User, SocialAccount, Order, Review } from "@/types";
import { OrderCard } from "@/components/cards/OrderCard";
import { ReviewList } from "./ReviewList";
import { cn } from "@/lib/utils";
import { openTelegramLink } from "@/lib/telegram";
import { ProfileEditForm } from "@/components/profile/ProfileEditForm";
import { ProfileSocialGrouped } from "@/components/profile/profile-social-grouped";

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

function SectionCaps({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("flex flex-col gap-3", className)}>
      <h2 className="px-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#8e8e93]">{title}</h2>
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
    return <img src={profile.photo_url} alt="" className={cn("object-cover", className)} />;
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
      <span className="text-lg leading-none">
        {(profile.first_name?.[0] || profile.company_name?.[0] || "?").toUpperCase()}
      </span>
    </div>
  );
}

function ProfileStatusSwitch({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={active}
      onClick={onToggle}
      className={cn(
        "relative h-7 w-[3.25rem] shrink-0 rounded-full transition-colors duration-200 touch-manipulation",
        active ? "bg-[#34c759]" : "bg-[#e9e9ea]"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 size-6 rounded-full bg-white shadow-md transition-transform duration-200 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
          active ? "translate-x-[1.375rem]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

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
  const [editing, setEditing] = useState(false);
  const [statusOn, setStatusOn] = useState(true);

  if (!config) return null;

  const isBlogger = profile.user_type === "blogger";
  const completeness = computeProfileCompleteness(profile);
  const canEditProfile = Boolean(config.canEdit && onUpdateProfile);

  const socialItems = useMemo(
    () => (isBlogger ? (items as SocialAccount[]).filter(Boolean) : []),
    [isBlogger, items]
  );

  const firstSocial = socialItems[0];
  const yearJoined = new Date(profile.created_at).getFullYear();

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
  const locationLine = isBlogger
    ? firstSocial?.niche?.trim() ||
      (profile.telegram_username ? `@${profile.telegram_username}` : "Блогер")
    : profile.company_category || (profile.telegram_username ? `@${profile.telegram_username}` : "Компания");
  const metaLine = `на платформе с ${yearJoined}`;

  const showTelegramCta = !isOwnProfile && Boolean(profile.telegram_username);

  return (
    <div className={cn("flex flex-col gap-5", showTelegramCta && "pb-[5.75rem]")}>
      <div className="-mx-[var(--app-page-gutter)]">
        <div className="relative min-h-[min(52vw,17.5rem)] w-full max-h-[20rem] overflow-hidden rounded-b-[1.75rem] sm:min-h-[15.5rem]">
          {profile.photo_url ? (
            <>
              <img src={profile.photo_url} alt="" className="absolute inset-0 size-full object-cover" />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/10"
                aria-hidden
              />
            </>
          ) : (
            <>
              <div
                className="absolute inset-0 bg-gradient-to-br from-[#ffd4c4] via-[#ffe8f0] to-[#f0b8d8]"
                aria-hidden
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/5" aria-hidden />
            </>
          )}

          {canEditProfile && !editing ? (
            <div className="absolute left-3 top-3 right-3 z-10 flex items-center justify-between gap-2">
              <span className="size-10" aria-hidden />
              <button
                type="button"
                onClick={() => setEditing(true)}
                className={cn(
                  "rounded-full border border-white/40 bg-white/25 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md",
                  "shadow-lg transition-[transform,background-color] active:scale-95 active:bg-white/35",
                  "touch-manipulation"
                )}
              >
                Изм.
              </button>
            </div>
          ) : null}

          {editing ? (
            <div className="absolute left-3 top-3 z-10">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className={cn(
                  "flex size-10 items-center justify-center rounded-full border border-white/40 bg-white/25 text-white backdrop-blur-md",
                  "transition-[transform,background-color] active:scale-95",
                  "touch-manipulation"
                )}
                aria-label="Назад"
              >
                <ChevronLeft className="size-5" strokeWidth={2.25} />
              </button>
            </div>
          ) : null}

          <div className="relative flex min-h-[min(52vw,17.5rem)] max-h-[20rem] flex-col justify-end p-4 pb-5 sm:min-h-[15.5rem]">
            <div className="flex items-end gap-3">
              <AvatarBlock
                profile={profile}
                className="size-[3.25rem] shrink-0 rounded-xl ring-2 ring-white/95 shadow-lg"
              />
              <div className="min-w-0 flex-1 pb-0.5">
                <p className="truncate text-lg font-bold leading-tight tracking-tight text-white drop-shadow-md">
                  {primaryTitle}
                </p>
                <p className="mt-0.5 truncate text-sm font-medium text-white/95 drop-shadow">{locationLine}</p>
                <p className="mt-0.5 truncate text-xs text-white/80 drop-shadow">{metaLine}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {editing && onUpdateProfile ? (
        <div className="rounded-[1.5rem] border border-black/[0.04] bg-white px-4 py-5 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.12)]">
          <ProfileEditForm profile={profile} onSave={onUpdateProfile} onCancel={() => setEditing(false)} />
        </div>
      ) : null}

      {!editing && isOwnProfile ? (
        <SectionCaps title="Мой профиль">
          <div className="rounded-[1.5rem] border border-black/[0.04] bg-white px-4 py-4 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.1)]">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="rounded-full bg-[#e8f8ec] px-3 py-1.5 text-xs font-semibold text-[#1a7f37]">
                Активен
              </span>
              <ProfileStatusSwitch active={statusOn} onToggle={() => setStatusOn((v) => !v)} />
            </div>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <p className="text-sm font-semibold text-[#1c1c1e]">Заполненность профиля</p>
              <span className="text-lg font-bold tabular-nums text-[#34c759]">{completeness}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#ececec]">
              <div
                className="h-full min-w-0 rounded-full transition-[width] duration-500 ease-out"
                style={{
                  width: `${completeness}%`,
                  background: "var(--app-gradient-primary)",
                }}
              />
            </div>
            <p className="mt-3 text-xs leading-relaxed text-[#8e8e93]">
              Чем выше заполненность, тем больше доверия у партнёров и шансов на сотрудничество.
            </p>
          </div>
        </SectionCaps>
      ) : null}

      {!editing ? (
        <>
          <SectionCaps title="Основное">
            <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.04] bg-white shadow-[0_8px_32px_-16px_rgba(0,0,0,0.1)]">
              {config.fields.map((field, i) => (
                <div
                  key={field}
                  className={cn(
                    "px-4 py-4",
                    i > 0 && "border-t border-[#f2f2f7]"
                  )}
                >
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#aeaeb2]">
                    {fieldLabels[field] ?? field}
                  </p>
                  <p className="mt-2 text-[0.9375rem] leading-snug text-[#1c1c1e]">{getFieldValue(field)}</p>
                </div>
              ))}
            </div>
          </SectionCaps>

          {isBlogger && socialItems.length > 0 ? (
            <SectionCaps title="Соцсети">
              <ProfileSocialGrouped items={socialItems} />
              {isOwnProfile ? (
                <Link
                  href="/items"
                  className="mt-2 block text-center text-sm font-semibold text-[#ff9b71] active:opacity-70"
                >
                  Управлять соцсетями
                </Link>
              ) : null}
            </SectionCaps>
          ) : null}

          {!isBlogger && items.length > 0 ? (
            <SectionCaps title="Заказы">
              <div className="flex flex-col gap-3">
                {(items as Order[]).map((item) => (
                  <OrderCard
                    key={item.id}
                    order={item}
                    client={profile}
                    variant={config.cardVariant as "compact" | "detailed" | "editable"}
                    onEdit={onEditItem ? () => onEditItem(item) : undefined}
                    onClose={onDeleteItem ? () => onDeleteItem(item) : undefined}
                  />
                ))}
              </div>
            </SectionCaps>
          ) : null}

          {isBlogger && isOwnProfile && socialItems.length === 0 ? (
            <SectionCaps title="Соцсети">
              <Link
                href="/social/new"
                className={cn(
                  "flex items-center justify-center rounded-[1.5rem] border border-dashed border-[#c7c7cc] bg-white/80 py-10 text-sm font-semibold text-[#ff9b71]",
                  "shadow-sm touch-manipulation active:scale-[0.99]"
                )}
              >
                Добавить соцсеть
              </Link>
            </SectionCaps>
          ) : null}

          {config.showReviews ? (
            <section className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3 px-0.5">
                <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#8e8e93]">
                  Отзывы
                </h2>
                {!isOwnProfile && config.actions?.includes("write_review") && onWriteReview ? (
                  <button
                    type="button"
                    onClick={onWriteReview}
                    className="text-xs font-semibold text-[#e753a0] active:opacity-70"
                  >
                    Написать отзыв
                  </button>
                ) : null}
              </div>
              <div className="rounded-[1.5rem] border border-black/[0.04] bg-white p-3 shadow-[0_6px_24px_-12px_rgba(0,0,0,0.08)]">
                <ReviewList reviews={reviews} />
              </div>
            </section>
          ) : null}

          {!isOwnProfile ? (
            <SectionCaps title="О сервисе">
              <p className="rounded-[1.25rem] bg-white/90 px-4 py-3.5 text-xs leading-relaxed text-[#8e8e93] shadow-sm">
                Аккаунт Telegram создан ~ {yearJoined} г. Убедитесь, что общаетесь с реальным человеком. Платформа не
                несёт ответственности за действия третьих лиц.
              </p>
            </SectionCaps>
          ) : null}
        </>
      ) : null}

      {showTelegramCta ? (
        <div className="fixed inset-x-0 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-[40] mx-auto flex w-full max-w-[var(--app-content-max)] justify-center px-[var(--app-page-gutter)]">
          <button
            type="button"
            className={cn(
              "app-btn-primary-gradient flex w-full max-w-md items-center justify-center gap-2 rounded-full py-3.5 text-base font-bold shadow-[0_8px_28px_-8px_rgba(231,83,160,0.45)]",
              "touch-manipulation transition-transform active:scale-[0.98]"
            )}
            onClick={() => openTelegramLink(`https://t.me/${profile.telegram_username}`)}
          >
            <Flame className="size-5 shrink-0" strokeWidth={2.2} aria-hidden />
            Написать в Telegram
          </button>
        </div>
      ) : null}
    </div>
  );
}

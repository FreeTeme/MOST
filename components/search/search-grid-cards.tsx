"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { emojiForOrderCategory, emojiForSocialPlatform } from "@/config/card-display.config";
import { bloggerSearchPortraitUrl } from "@/lib/blogger-search-portrait";
import type { Order, SocialAccount } from "@/types";
import { PlatformBrandRow } from "@/components/search/platform-brand-row";

function formatBudgetShort(order: Order): string {
  if (order.budget_type === "barter") return "Бартер";
  if (order.budget_amount != null) {
    return `${Number(order.budget_amount).toLocaleString("ru-RU")} ${order.budget_currency}`;
  }
  return "—";
}

function orderPortraitUrl(orderId: string): string {
  const seed = encodeURIComponent(`order-${orderId.slice(0, 12)}`);
  return `https://picsum.photos/seed/${seed}/400/520`;
}

const cardAnim = cn(
  "group relative flex w-full flex-col overflow-hidden rounded-[1.25rem] bg-white text-left",
  "shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12),0_2px_8px_-4px_rgba(0,0,0,0.06)]",
  "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
  "touch-manipulation will-change-transform motion-reduce:transition-none",
  "app-motion focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,#e753a0_45%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5f5f5]",
  "hover:shadow-[0_12px_36px_-12px_rgba(0,0,0,0.14)] motion-reduce:hover:shadow-none"
);

/** Карточка заказа — фото сверху как в ленте креаторов */
export function SearchOrderGridCard({
  order,
  onClick,
}: {
  order: Order;
  onClick?: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = orderPortraitUrl(order.id);
  const catEmoji = emojiForOrderCategory(order.category);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        cardAnim,
        onClick && "cursor-pointer active:scale-[0.98] motion-reduce:active:scale-100"
      )}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#eee]" aria-hidden>
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element -- внешний picsum, без remotePatterns
          <img
            src={src}
            alt=""
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100 group-active:scale-[1.02] motion-reduce:transition-none"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-[#ffe8df] to-[#ffd6e8] text-[2.5rem]">
            {catEmoji}
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent" />
      </div>
      <div className="flex flex-col gap-1 px-3 pb-3.5 pt-2.5">
        <p className="line-clamp-2 text-[0.8125rem] font-bold leading-snug text-[#1a1a1a]">{order.title}</p>
        <p className="line-clamp-1 text-[0.6875rem] text-[#8e8e93]">
          {order.category} · {formatBudgetShort(order)}
        </p>
      </div>
    </button>
  );
}

function displayTitleForSocial(s: SocialAccount): string {
  const niche = s.niche?.trim();
  if (niche) return niche.length > 36 ? `${niche.slice(0, 34)}…` : niche;
  try {
    const u = new URL(s.profile_url);
    const path = u.pathname.replace(/\//g, " ").trim();
    if (path) return path.slice(0, 32) + (path.length > 32 ? "…" : "");
  } catch {
    /* ignore */
  }
  return "Креатор";
}

function displayLocationLine(s: SocialAccount): string {
  return `Россия · ${s.followers.toLocaleString("ru-RU")} подп.`;
}

/** Карточка креатора — портрет + имя/локация + ряд соц-иконок (INSTADIUM). */
export function SearchBloggerGridCard({
  social,
  onClick,
}: {
  social: SocialAccount;
  onClick?: () => void;
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const src = bloggerSearchPortraitUrl(social.blogger_telegram_id, social.id);
  const platformEmoji = emojiForSocialPlatform(social.platform);

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        cardAnim,
        onClick && "cursor-pointer active:scale-[0.98] motion-reduce:active:scale-100"
      )}
    >
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[1.25rem] bg-[#e8e8ed]"
        aria-hidden
      >
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt=""
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04] motion-reduce:group-hover:scale-100 group-active:scale-[1.02] motion-reduce:transition-none"
            loading="lazy"
            decoding="async"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-[#dcecff] via-[#fff5f8] to-[#ffd6e8]">
            <span className="text-[2.75rem] leading-none drop-shadow-sm">{platformEmoji}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
      </div>
      <div className="flex flex-col gap-1 px-3 pb-3 pt-2">
        <p className="line-clamp-2 text-left text-[0.8125rem] font-bold leading-snug text-[#1a1a1a]">
          {displayTitleForSocial(social)}
        </p>
        <p className="line-clamp-1 text-left text-[0.6875rem] text-[#8e8e93]">{displayLocationLine(social)}</p>
        <PlatformBrandRow activePlatform={social.platform} />
      </div>
    </button>
  );
}

"use client";

import { ChevronRight } from "lucide-react";
import { emojiForSocialPlatform } from "@/config/card-display.config";
import type { SocialAccount } from "@/types";
import { cn } from "@/lib/utils";

function metricFromAnalytics(analytics: Record<string, unknown>, key: string): string | null {
  const v = analytics[key];
  if (v == null) return null;
  if (typeof v === "number") return String(v);
  if (typeof v === "string" && v.trim()) return v.trim();
  return null;
}

function formatReachLabel(platform: string, analytics: Record<string, unknown>): string | null {
  const reels = metricFromAnalytics(analytics, "reels_avg_reach");
  const avg = metricFromAnalytics(analytics, "avg_reach");
  const raw = reels ?? avg;
  if (!raw) return null;
  const n = Number(raw.replace(/\s/g, ""));
  if (!Number.isNaN(n)) {
    const kind =
      platform.toLowerCase().includes("instagram") || platform.toLowerCase().includes("insta")
        ? "Reels"
        : "пост";
    return `${n.toLocaleString("ru-RU")} ср. охват ${kind}`;
  }
  return `ср. охват ${raw}`;
}

interface ProfileSocialGroupedProps {
  items: SocialAccount[];
  className?: string;
}

/** Одна белая карточка со строками соцсетей (референс INSTADIUM, публичный профиль). */
export function ProfileSocialGrouped({ items, className }: ProfileSocialGroupedProps) {
  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-black/[0.04] bg-white",
        "shadow-[0_8px_32px_-16px_rgba(0,0,0,0.12)]",
        className
      )}
    >
      <ul className="m-0 list-none divide-y divide-[#ececec] p-0">
        {items.map((social) => {
          const emoji = emojiForSocialPlatform(social.platform);
          const reach = formatReachLabel(social.platform, social.analytics ?? {});
          const href = social.profile_url?.trim() || undefined;

          const row = (
            <>
              <div
                className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#f2f2f7] text-xl"
                aria-hidden
              >
                {emoji}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-bold leading-tight text-[#1c1c1e]">{social.platform}</p>
                <p className="mt-0.5 text-[0.8125rem] text-[#8e8e93]">
                  {social.followers.toLocaleString("ru-RU")} подписчиков
                  {reach ? ` · ${reach}` : ""}
                </p>
              </div>
              <ChevronRight className="size-5 shrink-0 text-[#c7c7cc]" strokeWidth={2} aria-hidden />
            </>
          );

          if (href) {
            return (
              <li key={social.id}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "flex items-center gap-3 px-4 py-3.5 transition-colors active:bg-[#f9f9f9]",
                    "touch-manipulation"
                  )}
                >
                  {row}
                </a>
              </li>
            );
          }

          return (
            <li key={social.id}>
              <div className="flex items-center gap-3 px-4 py-3.5">{row}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

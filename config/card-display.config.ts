/**
 * Эмодзи для чипов категорий/платформ (визуал референса ленты).
 * Ключи синхронизированы с `ORDER_CATEGORIES` / `BLOGGER_PLATFORMS`.
 */
import { BLOGGER_PLATFORMS, ORDER_CATEGORIES } from "@/config/search-ui.config";

const ORDER_EMOJI: Partial<Record<(typeof ORDER_CATEGORIES)[number], string>> = {
  Реклама: "📣",
  Обзор: "🎬",
  Интеграция: "🤝",
  Сторис: "📱",
  Пост: "📝",
  Другое: "✨",
};

const PLATFORM_EMOJI: Partial<Record<(typeof BLOGGER_PLATFORMS)[number], string>> = {
  Telegram: "💬",
  YouTube: "▶️",
  VK: "🔵",
  Дзен: "📰",
  Instagram: "📸",
  TikTok: "🎵",
  Другое: "📱",
};

export function emojiForOrderCategory(category: string): string {
  return ORDER_EMOJI[category as keyof typeof ORDER_EMOJI] ?? "📋";
}

export function emojiForSocialPlatform(platform: string): string {
  return PLATFORM_EMOJI[platform as keyof typeof PLATFORM_EMOJI] ?? "📱";
}

export function emojiForNiche(_niche: string): string {
  return "🎯";
}

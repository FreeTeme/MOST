/** Стабильный портрет для карточки креатора (без поля фото в social_accounts). */
export function bloggerSearchPortraitUrl(bloggerTelegramId: number, socialId: string): string {
  const seed = encodeURIComponent(`most-${bloggerTelegramId}-${socialId.slice(0, 8)}`);
  return `https://picsum.photos/seed/${seed}/400/520`;
}

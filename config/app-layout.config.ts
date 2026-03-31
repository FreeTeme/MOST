/**
 * Адаптив приложения — mobile-first, без отдельного флага «мобильный».
 *
 * Фактические значения заданы в `app/globals.css`:
 * - `--app-content-max` — ширина основной колонки (32rem → 42rem @768px → 56rem @1024px)
 * - `--app-page-gutter` — горизонтальные поля (20px → 24px → 32px)
 *
 * Светлая/тёмная тема: `ThemeProvider` подставляет `--tg-theme-*` из Telegram и `themeChanged`;
 * shadcn-токены (`--background`, `--foreground`, …) в `globals.css` считаются от них.
 *
 * Визуальный слой референса (фаза A): `--app-canvas`, `--app-gradient-primary`, `--radius-app-card`,
 * утилиты `.app-btn-primary-gradient`, `.app-chip`, `.app-pill-input`, `.app-card-elevated`.
 *
 * `MobileScreen`: по умолчанию `width="column"` (узкая колонка + поля). Для кромки экрана —
 * `width="full"` (без `max-w` и без горизонтальных полей компонента; safe-area на `.app-root`).
 *
 * Брейкпоинты совпадают с Tailwind: `sm` 640px, `md` 768px, `lg` 1024px, `xl` 1280px.
 * Для сеток в разметке предпочтительны `md:grid-cols-2` или класс `.app-grid-responsive-cols`.
 */
export const APP_LAYOUT_CSS_VARS = {
  contentMax: "--app-content-max",
  pageGutter: "--app-page-gutter",
} as const;

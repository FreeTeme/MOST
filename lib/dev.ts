/**
 * Режим локальной разработки без Telegram.
 *
 * В development (npm run dev) при открытии в обычном браузере приложение
 * автоматически использует мок-пользователя. В production (деплой) всегда
 * работает только внутри Telegram — мок не используется.
 *
 * Опционально в .env.local: NEXT_PUBLIC_STANDALONE_DEV=true для явного включения.
 * На сервере эту переменную не задавать — иначе поведение как в production.
 */
const isProduction =
  typeof process !== "undefined" && process.env.NODE_ENV === "production";
const raw = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_STANDALONE_DEV : undefined;
const normalized = typeof raw === "string" ? raw.trim().toLowerCase() : "";
export const isStandaloneDev =
  !isProduction &&
  (normalized === "true" || normalized === "1" || normalized === "yes");

export const DEV_MOCK_TELEGRAM_USER = {
  id: 999999999,
  first_name: "Dev",
  last_name: "User",
  username: "dev_local",
} as const;

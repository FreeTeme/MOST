/**
 * Режим локальной разработки без Telegram.
 *
 * В development (npm run dev) при открытии в обычном браузере приложение
 * автоматически использует мок-пользователя. В production (деплой) всегда
 * работает только внутри Telegram — мок не используется.
 *
 * Опционально в .env.local: NEXT_PUBLIC_STANDALONE_DEV=true для явного включения.
 * На сервере эту переменную не задавать — иначе поведение как в production.
 *
 * Демо-данные в БД (см. `supabase/seed_demo.sql`): по умолчанию мок = блогер **999999999**.
 * Для просмотра экранов заказчика укажите `NEXT_PUBLIC_DEV_MOCK_TELEGRAM_ID=888888888`.
 */
const isProduction =
  typeof process !== "undefined" && process.env.NODE_ENV === "production";
const raw = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_STANDALONE_DEV : undefined;
const normalized = typeof raw === "string" ? raw.trim().toLowerCase() : "";
export const isStandaloneDev =
  !isProduction &&
  (normalized === "true" || normalized === "1" || normalized === "yes");

function readDevMockTelegramId(): number {
  const rawId =
    typeof process !== "undefined" ? process.env.NEXT_PUBLIC_DEV_MOCK_TELEGRAM_ID : undefined;
  if (typeof rawId !== "string" || rawId.trim() === "") return 999999999;
  const n = Number(rawId.trim());
  if (!Number.isFinite(n) || n <= 0 || n > Number.MAX_SAFE_INTEGER) return 999999999;
  return Math.trunc(n);
}

const devMockId = readDevMockTelegramId();

export const DEV_MOCK_TELEGRAM_USER = {
  id: devMockId,
  first_name: "Dev",
  last_name: "User",
  username: "dev_local",
} as const;

/**
 * В dev подставлять фикстуры из `lib/demo-fixtures.ts` вместо ответов Supabase.
 *
 * Включается если:
 * - `NEXT_PUBLIC_FORCE_DEMO_DATA=true`, или
 * - локально не заданы оба `NEXT_PUBLIC_SUPABASE_URL` и `NEXT_PUBLIC_SUPABASE_ANON_KEY`
 *   (удобно: просто `npm run dev` без `.env`).
 *
 * Выключить принудительно: `NEXT_PUBLIC_FORCE_DEMO_DATA=false` (нужны оба ключа Supabase).
 */
export function isForceDemoData(): boolean {
  if (typeof process === "undefined") return false;
  if (process.env.NODE_ENV === "production") return false;
  const v = process.env.NEXT_PUBLIC_FORCE_DEMO_DATA?.trim().toLowerCase();
  if (v === "false" || v === "0" || v === "no") return false;
  if (v === "true" || v === "1" || v === "yes") return true;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  return !url || !key;
}

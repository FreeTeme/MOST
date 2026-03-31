-- Демо-данные для локального просмотра UI (npm run dev + Supabase).
--
-- КАК ЗАПУСТИТЬ
-- 1. Выполните миграцию `001_initial.sql` (если ещё не применялась).
-- 2. Если в проекте включён RLS без политик для `anon` — выполните `002_dev_rls_anon_policies.sql`
--    (иначе списки из приложения будут пустыми).
-- 3. В Supabase: SQL Editor → вставьте этот файл → Run.
-- 4. `.env.local`: NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_ANON_KEY; перезапуск `npm run dev`.
--
-- БЕЗ БД / БЫСТРЫЙ ПРОСМОТР UI
-- В `.env.local` добавьте: NEXT_PUBLIC_FORCE_DEMO_DATA=true
-- Тогда данные берутся из `lib/demo-fixtures.ts` (поиск, профиль, отклики, заказы).
--
-- ВАЖНО: в Telegram у вас «настоящий» telegram id — он не совпадёт с 999999999 из сида.
-- Либо открывайте Mini App в обычном браузере (dev-мок), либо FORCE_DEMO_DATA, либо добавьте
-- в seed свои строки с вашим telegram_id.
--
-- ПЕРСОНЫ (telegram_id)
--   999999999 — основной мок в браузере по умолчанию: в БД заведён как блогер + есть его заказ как у клиента (для сценариев «мои заказы» после смены роли).
--   888888888 — демо-заказчик «Анна» (переключите .env: NEXT_PUBLIC_DEV_MOCK_TELEGRAM_ID=888888888).
--   777777777 — NPC-блогер «Марина» (поиск, чужой профиль, входящие отклики).
--
-- РОЛЬ В ПРИЛОЖЕНИИ
--   С мок-айди 999999999 выберите на экране «Кто вы?» роль **Блогер** — совпадёт с сидом (и с БД после первого выбора).
--   Для экранов заказчика: в `.env.local` задайте NEXT_PUBLIC_DEV_MOCK_TELEGRAM_ID=888888888, перезапуск dev, в приложении роль **Заказчик**.

BEGIN;

-- Чистка предыдущего прогона (порядок из-за FK)
DELETE FROM applications
WHERE blogger_telegram_id IN (999999999::bigint, 888888888::bigint, 777777777::bigint)
   OR order_id IN (
     SELECT id FROM orders
     WHERE client_telegram_id IN (999999999::bigint, 888888888::bigint)
   );

DELETE FROM reviews
WHERE author_telegram_id IN (999999999::bigint, 888888888::bigint, 777777777::bigint)
   OR target_telegram_id IN (999999999::bigint, 888888888::bigint, 777777777::bigint);

DELETE FROM orders
WHERE client_telegram_id IN (999999999::bigint, 888888888::bigint);

DELETE FROM social_accounts
WHERE blogger_telegram_id IN (999999999::bigint, 777777777::bigint);

DELETE FROM users
WHERE telegram_id IN (999999999::bigint, 888888888::bigint, 777777777::bigint);

-- Пользователи
INSERT INTO users (
  telegram_id, telegram_username, first_name, last_name, photo_url, user_type,
  full_name, bio, company_name, company_category, company_description,
  created_at, updated_at
) VALUES
(
  999999999, 'demo_blogger_alex', 'Алексей', 'Демо', NULL, 'blogger',
  'Алексей Демо',
  'Снимаю обзоры и сторис. Красота и локальный бизнес.',
  NULL, NULL, NULL,
  now() - interval '40 days', now() - interval '1 day'
),
(
  888888888, 'demo_client_anna', 'Анна', 'Демидова', NULL, 'client',
  'Анна Демидова',
  NULL,
  'ООО «Сияние»', 'FMCG / красота',
  'Производитель уходовой косметики, ищем блогеров на интеграции и сторис.',
  now() - interval '120 days', now() - interval '2 days'
),
(
  777777777, 'marina_blog', 'Марина', 'Волкова', NULL, 'blogger',
  'Марина Волкова',
  'YouTube про путешествия и городской вайб.',
  NULL, NULL, NULL,
  now() - interval '200 days', now() - interval '3 hours'
);

-- Соцсети (поиск «блогеры», профили)
INSERT INTO social_accounts (
  blogger_telegram_id, platform, profile_url, followers, niche, analytics, status,
  created_at, updated_at
) VALUES
(
  999999999, 'Instagram', 'https://instagram.com/demo_alex_beauty', 18400,
  'Красота и уход', '{}', 'active',
  now() - interval '30 days', now() - interval '5 days'
),
(
  999999999, 'TikTok', 'https://tiktok.com/@demo_alex', 52000,
  'Лайфстайл', '{}', 'active',
  now() - interval '20 days', now() - interval '2 days'
),
(
  777777777, 'YouTube', 'https://youtube.com/@marina_travels', 96000,
  'Путешествия', '{}', 'active',
  now() - interval '90 days', now() - interval '1 day'
);

-- Заказы
INSERT INTO orders (
  id, title, description, category, budget_type, budget_amount, budget_currency,
  social_link, status, client_telegram_id, applications_count,
  created_at, updated_at
) VALUES
(
  'a1111111-1111-4111-8111-111111111101',
  'Съёмка Stories для кофейни',
  'Нужны 3–5 сторис в формате «день из жизни», показать интерьер и напитки без жёсткого сценария.',
  'Сторис', 'money', 12000, 'RUB',
  'https://instagram.com/demo_coffee_spb', 'active', 888888888, 2,
  now() - interval '5 days', now() - interval '4 hours'
),
(
  'a1111111-1111-4111-8111-111111111102',
  'Обзор приложения доставки еды',
  '10–12 минут честного обзора: онбординг, плюсы/минусы, кому зайдёт. Промокод вышлем после согласования.',
  'Обзор', 'barter', NULL, 'RUB',
  'https://apps.apple.com/app/demofood', 'active', 888888888, 1,
  now() - interval '12 days', now() - interval '1 day'
),
(
  'a1111111-1111-4111-8111-111111111103',
  'Реклама косметического бренда',
  'Интеграция в пост или Reels: акцент на состав и текстуру. Референсы — в брифе.',
  'Реклама', 'money', 45000, 'RUB',
  'https://t.me/demo_beauty_channel', 'active', 888888888, 0,
  now() - interval '2 days', now() - interval '30 minutes'
),
(
  'a1111111-1111-4111-8111-111111111104',
  'Коллаборация с блогерами (сезон)',
  'Ищем 2–3 формата: обзор линейки + сторис с упоминанием промокода. Детали по запросу.',
  'Интеграция', 'money', 80000, 'RUB',
  NULL, 'active', 999999999, 1,
  now() - interval '8 days', now() - interval '2 days'
);

-- Отклики (счётчики на заказах уже выставлены в INSERT выше)
INSERT INTO applications (order_id, blogger_telegram_id, message, status, applied_at, updated_at)
VALUES
(
  'a1111111-1111-4111-8111-111111111101',
  999999999,
  'Готов снять в выходные, портфолио в шапке профиля. Могу показать раскадровку.',
  'pending',
  now() - interval '4 days',
  now() - interval '4 days'
),
(
  'a1111111-1111-4111-8111-111111111102',
  999999999,
  'Делал похожие обзоры приложений, скину ссылки в личку.',
  'accepted',
  now() - interval '10 days',
  now() - interval '3 days'
),
(
  'a1111111-1111-4111-8111-111111111101',
  777777777,
  'Сторис + упоминание в телеграм-канале, если подойду по охватам.',
  'pending',
  now() - interval '3 days',
  now() - interval '3 days'
),
(
  'a1111111-1111-4111-8111-111111111104',
  777777777,
  'Интересен формат интеграции, готова обсудить сценарий под YouTube Shorts.',
  'pending',
  now() - interval '6 days',
  now() - interval '6 days'
);

-- Отзывы (профиль блогера 777777777)
INSERT INTO reviews (rating, comment, author_telegram_id, target_telegram_id, order_id, created_at)
VALUES
(
  5,
  'Всё в срок, отличный контент и коммуникация. Повторим к следующему запуску.',
  888888888,
  777777777,
  'a1111111-1111-4111-8111-111111111102',
  now() - interval '14 days'
),
(
  4,
  'Хороший разбор продукта, договорились о небольших правках — ок.',
  999999999,
  777777777,
  NULL,
  now() - interval '60 days'
);

COMMIT;

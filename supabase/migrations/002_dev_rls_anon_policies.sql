-- ВКЛЮЧАТЬ ТОЛЬКО ДЛЯ ПЕСОЧНИЦЫ / ЛОКАЛЬНОГО ПРОЕКТА
-- Если в Supabase Dashboard для таблиц включён RLS, а политик для `anon` нет —
-- клиент с NEXT_PUBLIC_SUPABASE_ANON_KEY получает пустые ответы без ошибок.
-- Этот файл открывает доступ роли `anon` ко всем строкам (как без RLS).
--
-- В продакшене замените на нормальные политики (по telegram_id, auth.uid() и т.д.).

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_dev_all_users" ON users;
CREATE POLICY "anon_dev_all_users" ON users FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_dev_all_social_accounts" ON social_accounts;
CREATE POLICY "anon_dev_all_social_accounts" ON social_accounts FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_dev_all_orders" ON orders;
CREATE POLICY "anon_dev_all_orders" ON orders FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_dev_all_applications" ON applications;
CREATE POLICY "anon_dev_all_applications" ON applications FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_dev_all_reviews" ON reviews;
CREATE POLICY "anon_dev_all_reviews" ON reviews FOR ALL TO anon USING (true) WITH CHECK (true);

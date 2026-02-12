-- Influencer Platform: initial schema
-- Run in Supabase SQL Editor or via Supabase CLI

-- Пользователи (единая таблица для блогеров и заказчиков)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  telegram_id BIGINT UNIQUE NOT NULL,
  telegram_username TEXT,
  first_name TEXT,
  last_name TEXT,
  photo_url TEXT,
  user_type TEXT NOT NULL CHECK (user_type IN ('blogger', 'client')),
  full_name TEXT,
  bio TEXT,
  company_name TEXT,
  company_category TEXT,
  company_description TEXT,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Социальные сети блогера
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blogger_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  platform TEXT NOT NULL,
  profile_url TEXT NOT NULL,
  followers INTEGER NOT NULL DEFAULT 0,
  niche TEXT NOT NULL,
  analytics JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(blogger_telegram_id, platform)
);

-- Заказы
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  budget_type TEXT CHECK (budget_type IN ('money', 'barter')),
  budget_amount DECIMAL(10,2),
  budget_currency TEXT DEFAULT 'RUB',
  social_link TEXT,
  status TEXT DEFAULT 'active',
  client_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Отклики на заказы
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  blogger_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(order_id, blogger_telegram_id)
);

-- Отзывы
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  author_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  target_telegram_id BIGINT NOT NULL REFERENCES users(telegram_id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(author_telegram_id, target_telegram_id)
);

-- Индексы для частых запросов
CREATE INDEX IF NOT EXISTS idx_social_accounts_blogger ON social_accounts(blogger_telegram_id);
CREATE INDEX IF NOT EXISTS idx_orders_client ON orders(client_telegram_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_applications_order ON applications(order_id);
CREATE INDEX IF NOT EXISTS idx_applications_blogger ON applications(blogger_telegram_id);
CREATE INDEX IF NOT EXISTS idx_reviews_target ON reviews(target_telegram_id);

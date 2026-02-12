# Influencer Platform — Telegram Mini App
## Полная спецификация проекта для разработки

---

## 1. ОБЩАЯ ИНФОРМАЦИЯ

**Название проекта:** Influencer Platform
**Тип:** Telegram Mini App
**Платформа:** Next.js + Supabase + Vercel
**Цель:** Платформа-агрегатор для поиска инфлюенсеров и заказов

**Ключевая особенность:** Все страницы универсальны для двух ролей (блогер/заказчик). Разница только в конфигах и карточках.

---

## 2. ТЕХНОЛОГИЧЕСКИЙ СТЕК

### 2.1 Frontend
- Next.js 15+ (App Router)
- TypeScript 5+
- Tailwind CSS 3+
- @telegram-apps/telegram-ui 2.x — нативные компоненты Telegram
- @twa-dev/sdk — Telegram WebApp SDK

### 2.2 Backend & Database
- Supabase (PostgreSQL) — единственный бэкенд
- supabase-js — клиент для запросов
- Row Level Security (будет добавлено позже)

### 2.3 Авторизация
- **НЕ ИСПОЛЬЗУЕТСЯ** Supabase Auth
- **НЕ ИСПОЛЬЗУЮТСЯ** JWT токены
- **НЕ ИСПОЛЬЗУЮТСЯ** email/password
- **ИСПОЛЬЗУЕТСЯ** Telegram ID как первичный ключ
- **ИСПОЛЬЗУЕТСЯ** localStorage для хранения сессии

### 2.4 Хостинг
- Vercel (Hobby) — автоматический деплой из GitHub

---

## 3. АРХИТЕКТУРА ПРОЕКТА

### 3.1 Ключевой принцип
Страница не знает, кто ее открыл — блогер или заказчик. Страница получает конфиг из централизованного файла конфигурации на основе роли и рендерит соответствующие компоненты.

### 3.2 Структура папок

```
src/
├── app/
│   ├── (main)/
│   │   ├── search/
│   │   │   └── page.tsx              # Универсальный поиск (заказы/блогеры)
│   │   ├── items/
│   │   │   └── page.tsx              # Мои предметы (соцсети/заказы)
│   │   ├── applications/
│   │   │   └── page.tsx              # Отклики (исходящие/входящие)
│   │   ├── profile/
│   │   │   ├── me/
│   │   │   │   └── page.tsx          # Мой профиль (редактирование)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Публичный профиль (просмотр)
│   │   ├── order/
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Создание заказа (client only)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Детальная заказа
│   │   └── social/
│   │       └── new/
│   │           └── page.tsx          # Добавление соцсети (blogger only)
│   │
│   ├── (auth)/
│   │   └── role-select/
│   │       └── page.tsx              # Выбор роли
│   │
│   └── page.tsx                      # Стартовая (редирект)
│
├── components/
│   ├── cards/
│   │   ├── SocialCard.tsx           # Карточка блогера/соцсети
│   │   ├── OrderCard.tsx            # Карточка заказа
│   │   └── ApplicationCard.tsx      # Карточка отклика
│   ├── forms/
│   │   ├── OrderForm.tsx            # Форма создания заказа
│   │   ├── SocialForm.tsx           # Форма добавления соцсети
│   │   └── ReviewForm.tsx           # Форма написания отзыва
│   └── shared/
│       ├── ProfileView.tsx          # Универсальный просмотр профиля
│       ├── ItemList.tsx            # Универсальный список карточек
│       └── ReviewList.tsx          # Список отзывов
│
├── hooks/
│   ├── useRole.ts                  # Получение роли из localStorage
│   ├── useTelegramAuth.ts          # Авторизация по Telegram ID
│   ├── useSearch.ts               # Универсальный поиск
│   ├── useItems.ts                # Мои предметы (соцсети/заказы)
│   ├── useApplications.ts         # Отклики (исходящие/входящие)
│   ├── useProfile.ts              # Загрузка профиля
│   ├── useCreateOrder.ts          # Создание заказа
│   ├── useCreateSocial.ts         # Добавление соцсети
│   └── useReview.ts               # Работа с отзывами
│
├── config/
│   ├── roles.config.ts           # Конфигурация ролей и прав
│   ├── pages.config.ts           # Конфигурация всех страниц
│   └── database.config.ts        # Названия таблиц и полей
│
├── lib/
│   ├── supabase.ts               # Supabase клиент и типы
│   └── telegram.ts               # Telegram WebApp утилиты
│
├── types/
│   └── index.ts                  # Глобальные TypeScript типы
│
└── styles/
    └── globals.css              # Глобальные стили
```

---

## 4. БАЗА ДАННЫХ

### 4.1 Таблицы PostgreSQL

```sql
-- Пользователи (единая таблица для блогеров и заказчиков)
CREATE TABLE users (
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
CREATE TABLE social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blogger_telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
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
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  budget_type TEXT CHECK (budget_type IN ('money', 'barter')),
  budget_amount DECIMAL(10,2),
  budget_currency TEXT DEFAULT 'RUB',
  social_link TEXT,
  status TEXT DEFAULT 'active',
  client_telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Отклики на заказы
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  blogger_telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
  message TEXT,
  status TEXT DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  UNIQUE(order_id, blogger_telegram_id)
);

-- Отзывы
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  author_telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
  target_telegram_id BIGINT REFERENCES users(telegram_id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(author_telegram_id, target_telegram_id)
);
```

### 4.2 Связи между таблицами
- `users.telegram_id` связан со всеми внешними ключами
- Все операции привязываются к `telegram_id`, не к UUID

---

## 5. РОЛИ И РАЗРЕШЕНИЯ

### 5.1 Блогер
- Может искать заказы
- Может откликаться на заказы
- Может просматривать свои отклики
- Может добавлять/редактировать/удалять соцсети
- Может просматривать свой профиль
- Может просматривать чужие профили
- Может писать отзывы заказчикам
- Может читать отзывы на заказчиков
- **НЕ МОЖЕТ** создавать заказы
- **НЕ МОЖЕТ** принимать/отклонять отклики

### 5.2 Заказчик
- Может искать блогеров
- Может создавать/редактировать/закрывать заказы
- Может просматривать отклики на свои заказы
- Может принимать/отклонять отклики
- Может просматривать свой профиль
- Может просматривать чужие профили
- Может писать отзывы блогерам
- Может читать отзывы на свою компанию
- **НЕ МОЖЕТ** откликаться на заказы
- **НЕ МОЖЕТ** добавлять соцсети

---

## 6. КОНФИГУРАЦИЯ СТРАНИЦ

### 6.1 Файл конфигурации (`config/pages.config.ts`)

```typescript
// Поиск (универсальный)
export const SEARCH_CONFIG = {
  blogger: {
    title: 'Поиск заказов',
    description: 'Найдите заказы под ваш блог',
    query: 'orders',
    card: 'OrderCard',
    cardVariant: 'compact',
    emptyState: 'Нет подходящих заказов',
    filters: ['category', 'budget'],
    actionButton: {
      text: 'Откликнуться',
      handler: 'applyToOrder'
    }
  },
  client: {
    title: 'Поиск блогеров',
    description: 'Найдите блогеров для рекламы',
    query: 'social_accounts',
    card: 'SocialCard',
    cardVariant: 'compact',
    emptyState: 'Нет блогеров',
    filters: ['niche', 'followers'],
    actionButton: {
      text: 'Смотреть профиль',
      handler: 'viewBloggerProfile'
    }
  }
}

// Мои предметы (соцсети/заказы)
export const MY_ITEMS_CONFIG = {
  blogger: {
    title: 'Мои соцсети',
    description: 'Управляйте вашими соцсетями',
    query: 'social_accounts',
    card: 'SocialCard',
    cardVariant: 'editable',
    emptyState: 'Добавьте первую соцсеть',
    createButton: {
      text: '+ Добавить соцсеть',
      href: '/social/new'
    },
    actions: ['edit', 'delete']
  },
  client: {
    title: 'Мои заказы',
    description: 'Управляйте вашими заказами',
    query: 'orders',
    card: 'OrderCard',
    cardVariant: 'editable',
    emptyState: 'Создайте первый заказ',
    createButton: {
      text: '+ Создать заказ',
      href: '/order/new'
    },
    actions: ['edit', 'close']
  }
}

// Отклики (исходящие/входящие)
export const APPLICATIONS_CONFIG = {
  blogger: {
    title: 'Мои отклики',
    description: 'Отслеживайте статус откликов',
    query: 'applications',
    card: 'ApplicationCard',
    cardVariant: 'outgoing',
    emptyState: 'Вы еще не откликались на заказы',
    showStatus: true,
    actions: []
  },
  client: {
    title: 'Входящие отклики',
    description: 'Отклики на ваши заказы',
    query: 'applications',
    card: 'ApplicationCard',
    cardVariant: 'incoming',
    emptyState: 'Пока нет откликов',
    showStatus: true,
    actions: ['accept', 'reject']
  }
}

// Профиль (свой/чужой)
export const PROFILE_CONFIG = {
  myProfile: {
    blogger: {
      title: 'Мой профиль',
      fields: ['full_name', 'bio', 'telegram'],
      card: 'SocialCard',
      cardVariant: 'detailed',
      canEdit: true,
      showReviews: true
    },
    client: {
      title: 'Моя компания',
      fields: ['company_name', 'category', 'description'],
      card: 'OrderCard',
      cardVariant: 'detailed',
      canEdit: true,
      showReviews: true
    }
  },
  publicProfile: {
    blogger: {
      title: 'Профиль блогера',
      fields: ['full_name', 'bio'],
      card: 'SocialCard',
      cardVariant: 'detailed',
      canEdit: false,
      showReviews: true,
      actions: ['write_review']
    },
    client: {
      title: 'Профиль компании',
      fields: ['company_name', 'category'],
      card: 'OrderCard',
      cardVariant: 'detailed',
      canEdit: false,
      showReviews: true,
      actions: ['write_review']
    }
  }
}
```

---

## 7. ХУКИ (ОБЯЗАТЕЛЬНЫ К РЕАЛИЗАЦИИ)

### 7.1 `useRole.ts`
- Читает роль из localStorage
- Возвращает `role`, `isBlogger`, `isClient`, `setRole`
- Единственный источник правды о роли пользователя

### 7.2 `useTelegramAuth.ts`
- Получает `telegram_id` из `window.Telegram.WebApp.initDataUnsafe.user`
- Проверяет существование пользователя в Supabase
- Регистрирует нового пользователя при необходимости
- Сохраняет сессию в localStorage
- Возвращает `tgUser`, `dbUser`, `loading`, `register`, `logout`, `isAuthenticated`

### 7.3 `useSearch.ts`
- Принимает `filters` как параметр
- Выполняет запрос к таблице из конфига
- Возвращает `items`, `loading`, `filters`, `setFilters`, `handleAction`, `config`

### 7.4 `useItems.ts`
- Автоматически подставляет `telegram_id` текущего пользователя
- Выполняет запрос к `social_accounts` или `orders`
- Поддерживает операции удаления/редактирования
- Возвращает `items`, `loading`, `config`, `deleteItem`, `updateItem`

### 7.5 `useApplications.ts`
- Для блогера: загружает его отклики с `order_id` и данными заказа
- Для заказчика: загружает отклики на его заказы с данными блогера
- Поддерживает изменение статуса (accept/reject)
- Возвращает `applications`, `loading`, `config`, `updateStatus`

### 7.6 `useProfile.ts`
- Принимает `telegram_id` из параметров URL
- Определяет: свой профиль или чужой
- Загружает данные пользователя
- Загружает связанные данные (соцсети/заказы, отзывы)
- Возвращает `profile`, `items`, `reviews`, `loading`, `config`, `isOwnProfile`

### 7.7 `useCreateOrder.ts`
- Валидация формы
- POST запрос в таблицу `orders`
- Редирект на `/items` после успеха

### 7.8 `useCreateSocial.ts`
- Валидация формы
- POST запрос в таблицу `social_accounts`
- Редирект на `/items` после успеха

### 7.9 `useReview.ts`
- Проверка права на написание отзыва
- POST запрос в таблицу `reviews`
- Обновление списка отзывов

---

## 8. КОМПОНЕНТЫ (ОБЯЗАТЕЛЬНЫ К РЕАЛИЗАЦИИ)

### 8.1 Карточки (используют @telegram-apps/telegram-ui)

**SocialCard.tsx**
- Пропсы: `social`, `blogger`, `variant`, `onClick`, `onEdit`, `onDelete`
- Варианты: `compact` (для поиска), `detailed` (для профиля), `editable` (для моих соцсетей)
- Отображает: аватар, имя, username, платформу, подписчиков, нишу, аналитику

**OrderCard.tsx**
- Пропсы: `order`, `client`, `variant`, `onApply`, `onEdit`, `onClose`
- Варианты: `compact`, `detailed`, `editable`
- Отображает: заголовок, категорию, бюджет, описание, количество откликов

**ApplicationCard.tsx**
- Пропсы: `application`, `variant`, `showStatus`, `actions`, `onStatusChange`
- Варианты: `outgoing` (блогер видит свой отклик), `incoming` (заказчик видит отклик блогера)
- Отображает: кто откликнулся, на какой заказ, дату, статус, кнопки действий

### 8.2 Формы

**OrderForm.tsx**
- Поля: title, description, category, budget_type, budget_amount, social_link
- Валидация: обязательные поля, budget_amount > 0
- Отправка: POST /api/orders

**SocialForm.tsx**
- Поля: platform, profile_url, followers, niche, analytics
- Валидация: platform обязателен, followers >= 0
- Отправка: POST /api/social-accounts

**ReviewForm.tsx**
- Поля: rating (1-5 звезд), comment
- Валидация: rating обязателен
- Отправка: POST /api/reviews

### 8.3 Shared компоненты

**ProfileView.tsx**
- Универсальный компонент для отображения профиля
- Принимает конфиг полей из PROFILE_CONFIG
- Рендерит аватар, поля, карточки, отзывы

**ItemList.tsx**
- Универсальный компонент для отображения списка карточек
- Принимает items, renderItem, emptyState, loading
- Используется на страницах search, items, profile

**ReviewList.tsx**
- Отображает список отзывов
- Группирует по датам
- Показывает рейтинг звездами

---

## 9. СТРАНИЦЫ ДЛЯ РЕАЛИЗАЦИИ (5 шт)

### 9.1 `/profile/me/page.tsx` - Мой профиль

**Функционал:**
- Редактирование полей профиля в зависимости от роли
- Отображение связанных карточек (соцсети для блогера, заказы для заказчика)
- Отображение отзывов о пользователе
- Кнопка сохранения изменений

**Хуки:** useProfile, useRole, useTelegramAuth

**Конфиг:** PROFILE_CONFIG.myProfile[role]

---

### 9.2 `/profile/[id]/page.tsx` - Публичный профиль

**Функционал:**
- Определение роли пользователя по telegram_id из URL
- Отображение публичных полей профиля
- Отображение карточек (соцсети для блогера, заказы для заказчика)
- Отображение отзывов
- Кнопка "Написать отзыв" (если пользователь имеет право)

**Хуки:** useProfile, useRole, useReview

**Конфиг:** PROFILE_CONFIG.publicProfile[role]

---

### 9.3 `/order/new/page.tsx` - Создание заказа

**Функционал:**
- Проверка роли: доступно только для client
- Форма создания заказа
- Валидация полей
- POST запрос в Supabase
- Редирект на /items после успеха

**Хуки:** useRole, useCreateOrder

**Компоненты:** OrderForm

---

### 9.4 `/social/new/page.tsx` - Добавление соцсети

**Функционал:**
- Проверка роли: доступно только для blogger
- Форма добавления соцсети
- Валидация полей
- POST запрос в Supabase
- Редирект на /items после успеха

**Хуки:** useRole, useCreateSocial

**Компоненты:** SocialForm

---

### 9.5 `/order/[id]/page.tsx` - Детальная заказа

**Функционал:**
- Загрузка заказа по ID
- Отображение полной информации о заказе
- Для блогера: кнопка "Откликнуться" (если еще не откликался)
- Для заказчика: список откликов с возможностью принять/отклонить
- Информация о заказчике

**Хуки:** useRole, useApplications

**Компоненты:** OrderCard (detailed), ApplicationCard

---

## 10. ТРЕБОВАНИЯ К КОДУ

### 10.1 Обязательные требования

1. Все страницы используют конфиги из `config/pages.config.ts`
2. Никакой логики ролей внутри страниц (только через конфиги и хуки)
3. Все запросы к данным через хуки, а не через useEffect внутри страниц
4. Использование @telegram-apps/telegram-ui для всех интерфейсных компонентов
5. Mobile First: кнопки минимум 44px, отступы 16px
6. Строгая типизация TypeScript для всех пропсов и возвращаемых значений
7. Авторизация только через telegram_id, никакого Supabase Auth

### 10.2 Запрещенные практики

1. Использование Supabase Auth или JWT токенов
2. Дублирование кода между страницами
3. Условные операторы для ролей внутри страниц (вместо этого использовать конфиги)
4. Прямые запросы к Supabase внутри страниц (только через хуки)
5. Добавление лишних зависимостей

---

## 11. ЦВЕТА И ТЕМЫ

```css
:root {
  --tg-theme-bg-color: #ffffff;
  --tg-theme-text-color: #000000;
  --tg-theme-hint-color: #999999;
  --tg-theme-link-color: #2481cc;
  --tg-theme-button-color: #2481cc;
  --tg-theme-button-text-color: #ffffff;
  --tg-theme-secondary-bg-color: #f0f2f5;
}
```

Все компоненты должны использовать CSS-переменные Telegram, а не хардкодить цвета.

---

## 12. АВТОРИЗАЦИЯ (ВАЖНО)

```typescript
// НЕ ИСПОЛЬЗОВАТЬ:
import { supabase } from '@supabase/supabase-js'
supabase.auth.signIn() // ❌ ЗАПРЕЩЕНО

// ИСПОЛЬЗОВАТЬ:
const user = window.Telegram.WebApp.initDataUnsafe.user
const telegram_id = user.id

const { data } = await supabase
  .from('users')
  .select('*')
  .eq('telegram_id', telegram_id)
  .maybeSingle()

localStorage.setItem('session', JSON.stringify({ telegram_id }))
```

---

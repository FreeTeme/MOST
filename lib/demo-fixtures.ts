/**
 * Статические демо-данные (совпадают по смыслу с supabase/seed_demo.sql).
 * Включаются в dev через NEXT_PUBLIC_FORCE_DEMO_DATA=true.
 */
import type {
  Application,
  ApplicationWithBlogger,
  ApplicationWithOrder,
  Order,
  Review,
  SocialAccount,
  User,
  UserType,
} from "@/types";

const iso = (daysAgo: number) => new Date(Date.now() - daysAgo * 86400000).toISOString();

export const demoUsersByTelegramId: Record<number, User> = {
  999999999: {
    id: "d0000001-0000-4000-8000-000000000001",
    telegram_id: 999999999,
    telegram_username: "demo_blogger_alex",
    first_name: "Алексей",
    last_name: "Демо",
    photo_url: null,
    user_type: "blogger",
    full_name: "Алексей Демо",
    bio: "Снимаю обзоры и сторис. Красота и локальный бизнес.",
    company_name: null,
    company_category: null,
    company_description: null,
    created_at: iso(40),
    updated_at: iso(1),
  },
  888888888: {
    id: "d0000002-0000-4000-8000-000000000002",
    telegram_id: 888888888,
    telegram_username: "demo_client_anna",
    first_name: "Анна",
    last_name: "Демидова",
    photo_url: null,
    user_type: "client",
    full_name: "Анна Демидова",
    bio: null,
    company_name: "ООО «Сияние»",
    company_category: "FMCG / красота",
    company_description: "Производитель уходовой косметики, ищем блогеров на интеграции и сторис.",
    created_at: iso(120),
    updated_at: iso(2),
  },
  777777777: {
    id: "d0000003-0000-4000-8000-000000000003",
    telegram_id: 777777777,
    telegram_username: "marina_blog",
    first_name: "Марина",
    last_name: "Волкова",
    photo_url: null,
    user_type: "blogger",
    full_name: "Марина Волкова",
    bio: "YouTok / телеграм про путешествия и городской вайб.",
    company_name: null,
    company_category: null,
    company_description: null,
    created_at: iso(200),
    updated_at: iso(0.1),
  },
};

export const demoOrders: Order[] = [
  {
    id: "a1111111-1111-4111-8111-111111111101",
    title: "Съёмка Stories для кофейни",
    description:
      "Нужны 3–5 сторис в формате «день из жизни», показать интерьер и напитки без жёсткого сценария.",
    category: "Сторис",
    budget_type: "money",
    budget_amount: 12000,
    budget_currency: "RUB",
    social_link: "https://instagram.com/demo_coffee_spb",
    status: "active",
    client_telegram_id: 888888888,
    applications_count: 2,
    created_at: iso(5),
    updated_at: iso(0.2),
  },
  {
    id: "a1111111-1111-4111-8111-111111111102",
    title: "Обзор приложения доставки еды",
    description:
      "10–12 минут честного обзора: онбординг, плюсы/минусы, кому зайдёт. Промокод вышлем после согласования.",
    category: "Обзор",
    budget_type: "barter",
    budget_amount: null,
    budget_currency: "RUB",
    social_link: "https://apps.apple.com/app/demofood",
    status: "active",
    client_telegram_id: 888888888,
    applications_count: 1,
    created_at: iso(12),
    updated_at: iso(1),
  },
  {
    id: "a1111111-1111-4111-8111-111111111103",
    title: "Реклама косметического бренда",
    description: "Интеграция в пост или Reels: акцент на состав и текстуру. Референсы — в брифе.",
    category: "Реклама",
    budget_type: "money",
    budget_amount: 45000,
    budget_currency: "RUB",
    social_link: "https://t.me/demo_beauty_channel",
    status: "active",
    client_telegram_id: 888888888,
    applications_count: 0,
    created_at: iso(2),
    updated_at: iso(0.05),
  },
  {
    id: "a1111111-1111-4111-8111-111111111104",
    title: "Коллаборация с блогерами (сезон)",
    description:
      "Ищем 2–3 формата: обзор линейки + сторис с упоминанием промокода. Детали по запросу.",
    category: "Интеграция",
    budget_type: "money",
    budget_amount: 80000,
    budget_currency: "RUB",
    social_link: null,
    status: "active",
    client_telegram_id: 999999999,
    applications_count: 1,
    created_at: iso(8),
    updated_at: iso(2),
  },
];

export const demoSocials: SocialAccount[] = [
  {
    id: "c3333333-3333-4333-8333-333333333301",
    blogger_telegram_id: 999999999,
    platform: "Instagram",
    profile_url: "https://instagram.com/demo_alex_beauty",
    followers: 18400,
    niche: "Красота и уход",
    analytics: {},
    status: "active",
    created_at: iso(30),
    updated_at: iso(5),
  },
  {
    id: "c3333333-3333-4333-8333-333333333302",
    blogger_telegram_id: 999999999,
    platform: "TikTok",
    profile_url: "https://tiktok.com/@demo_alex",
    followers: 52000,
    niche: "Лайфстайл",
    analytics: {},
    status: "active",
    created_at: iso(20),
    updated_at: iso(2),
  },
  {
    id: "c3333333-3333-4333-8333-333333333303",
    blogger_telegram_id: 777777777,
    platform: "YouTube",
    profile_url: "https://youtube.com/@marina_travels",
    followers: 96000,
    niche: "Путешествия",
    analytics: {},
    status: "active",
    created_at: iso(90),
    updated_at: iso(1),
  },
];

export const demoApplications: Application[] = [
  {
    id: "b2222222-2222-4222-8222-222222222201",
    order_id: "a1111111-1111-4111-8111-111111111101",
    blogger_telegram_id: 999999999,
    message: "Готов снять в выходные, портфолио в шапке профиля. Могу показать раскадровку.",
    status: "pending",
    applied_at: iso(4),
    updated_at: iso(4),
  },
  {
    id: "b2222222-2222-4222-8222-222222222202",
    order_id: "a1111111-1111-4111-8111-111111111102",
    blogger_telegram_id: 999999999,
    message: "Делал похожие обзоры приложений, скину ссылки в личку.",
    status: "accepted",
    applied_at: iso(10),
    updated_at: iso(3),
  },
  {
    id: "b2222222-2222-4222-8222-222222222203",
    order_id: "a1111111-1111-4111-8111-111111111101",
    blogger_telegram_id: 777777777,
    message: "Сторис + упоминание в телеграм-канале, если подойду по охватам.",
    status: "pending",
    applied_at: iso(3),
    updated_at: iso(3),
  },
  {
    id: "b2222222-2222-4222-8222-222222222204",
    order_id: "a1111111-1111-4111-8111-111111111104",
    blogger_telegram_id: 777777777,
    message: "Интересен формат интеграции, готова обсудить сценарий под YouTube Shorts.",
    status: "pending",
    applied_at: iso(6),
    updated_at: iso(6),
  },
];

export const demoReviews: Review[] = [
  {
    id: "e4444444-4444-4444-8444-444444444401",
    rating: 5,
    comment: "Всё в срок, отличный контент и коммуникация. Повторим к следующему запуску.",
    author_telegram_id: 888888888,
    target_telegram_id: 777777777,
    order_id: "a1111111-1111-4111-8111-111111111102",
    created_at: iso(14),
  },
  {
    id: "e4444444-4444-4444-8444-444444444402",
    rating: 4,
    comment: "Хороший разбор продукта, договорились о небольших правках — ок.",
    author_telegram_id: 999999999,
    target_telegram_id: 777777777,
    order_id: null,
    created_at: iso(60),
  },
];

function sanitizeIlikeFragment(raw: string): string {
  return raw.trim().replace(/%/g, "").replace(/_/g, "").replace(/,/g, " ").slice(0, 120);
}

function parsePositiveInt(s: string): number | null {
  const n = parseInt(String(s).replace(/\s/g, ""), 10);
  if (Number.isNaN(n) || n < 0) return null;
  return n;
}

/** Поиск — те же фильтры, что в useSearch (упрощённо в памяти). */
export function getDemoSearchItems(
  role: UserType,
  filters: Record<string, string>,
  searchRaw: string
): Order[] | SocialAccount[] {
  const term = sanitizeIlikeFragment(searchRaw).toLowerCase();

  if (role === "blogger") {
    let list = demoOrders.filter((o) => o.status === "active");
    if (term) {
      list = list.filter(
        (o) =>
          o.title.toLowerCase().includes(term) ||
          (o.description ?? "").toLowerCase().includes(term)
      );
    }
    if (filters.category) {
      list = list.filter((o) => o.category === filters.category);
    }
    const bt = filters.budgetType ?? "all";
    if (bt === "money") list = list.filter((o) => o.budget_type === "money");
    if (bt === "barter") list = list.filter((o) => o.budget_type === "barter");
    const minB = parsePositiveInt(filters.budgetMin ?? "");
    if (minB !== null && minB > 0 && bt !== "barter") {
      list = list.filter(
        (o) =>
          o.budget_type === "money" && o.budget_amount != null && Number(o.budget_amount) >= minB
      );
    }
    return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  let list = demoSocials.filter((s) => s.status === "active");
  if (term) {
    list = list.filter(
      (s) =>
        s.platform.toLowerCase().includes(term) ||
        s.niche.toLowerCase().includes(term) ||
        s.profile_url.toLowerCase().includes(term)
    );
  }
  if (filters.niche?.trim()) {
    const n = sanitizeIlikeFragment(filters.niche).toLowerCase();
    list = list.filter((s) => s.niche.toLowerCase().includes(n));
  }
  if (filters.platform?.trim()) {
    list = list.filter((s) => s.platform === filters.platform);
  }
  const minF = parsePositiveInt(filters.followersMin ?? "");
  if (minF !== null && minF > 0) {
    list = list.filter((s) => s.followers >= minF);
  }
  return [...list].sort((a, b) => b.followers - a.followers);
}

export function getDemoUser(telegramId: number): User | undefined {
  return demoUsersByTelegramId[telegramId];
}

export function getDemoBloggerApplications(bloggerTid: number): ApplicationWithOrder[] {
  const apps = demoApplications.filter((a) => a.blogger_telegram_id === bloggerTid);
  const orderMap = new Map(demoOrders.map((o) => [o.id, o]));
  return apps.map((a) => ({ ...a, order: orderMap.get(a.order_id) }));
}

export function getDemoClientApplications(clientTid: number): ApplicationWithBlogger[] {
  const orderIds = new Set(
    demoOrders.filter((o) => o.client_telegram_id === clientTid).map((o) => o.id)
  );
  const apps = demoApplications.filter((a) => orderIds.has(a.order_id));
  return apps.map((a) => ({
    ...a,
    blogger: demoUsersByTelegramId[a.blogger_telegram_id],
    blogger_socials: demoSocials.filter((s) => s.blogger_telegram_id === a.blogger_telegram_id),
  }));
}

export function getDemoApplicationsForOrder(orderId: string): ApplicationWithBlogger[] {
  const apps = demoApplications.filter((a) => a.order_id === orderId);
  return apps.map((a) => ({
    ...a,
    blogger: demoUsersByTelegramId[a.blogger_telegram_id],
    blogger_socials: demoSocials.filter((s) => s.blogger_telegram_id === a.blogger_telegram_id),
  }));
}

export function getDemoProfileOrdersOrSocials(telegramId: number, userType: UserType): Order[] | SocialAccount[] {
  if (userType === "blogger") {
    return demoSocials.filter((s) => s.blogger_telegram_id === telegramId && s.status === "active");
  }
  return demoOrders.filter(
    (o) => o.client_telegram_id === telegramId && o.status === "active"
  );
}

export function getDemoReviewsForTarget(targetTid: number): Review[] {
  return demoReviews.filter((r) => r.target_telegram_id === targetTid);
}

import type { UserType } from "@/types";
import type { SocialCardVariant, OrderCardVariant, ApplicationCardVariant } from "@/types";

type SearchConfigItem = {
  title: string;
  description: string;
  query: "orders" | "social_accounts";
  card: "OrderCard" | "SocialCard";
  cardVariant: SocialCardVariant | OrderCardVariant;
  emptyState: string;
  filters: string[];
  actionButton: { text: string; handler: string };
};

type MyItemsConfigItem = {
  title: string;
  description: string;
  query: "orders" | "social_accounts";
  card: "OrderCard" | "SocialCard";
  cardVariant: SocialCardVariant | OrderCardVariant;
  emptyState: string;
  createButton: { text: string; href: string };
  actions: string[];
};

type ApplicationsConfigItem = {
  title: string;
  description: string;
  query: "applications";
  card: "ApplicationCard";
  cardVariant: ApplicationCardVariant;
  emptyState: string;
  showStatus: boolean;
  actions: string[];
};

type ProfileConfigItem = {
  title: string;
  fields: string[];
  card: "OrderCard" | "SocialCard";
  cardVariant: "detailed";
  canEdit: boolean;
  showReviews: boolean;
  actions?: string[];
};

export const SEARCH_CONFIG: Record<UserType, SearchConfigItem> = {
  blogger: {
    title: "Поиск заказов",
    description: "Найдите заказы под ваш блог",
    query: "orders",
    card: "OrderCard",
    cardVariant: "compact",
    emptyState: "Нет подходящих заказов",
    filters: ["category", "budget"],
    actionButton: {
      text: "Откликнуться",
      handler: "applyToOrder",
    },
  },
  client: {
    title: "Поиск блогеров",
    description: "Найдите блогеров для рекламы",
    query: "social_accounts",
    card: "SocialCard",
    cardVariant: "compact",
    emptyState: "Нет блогеров",
    filters: ["niche", "followers"],
    actionButton: {
      text: "Смотреть профиль",
      handler: "viewBloggerProfile",
    },
  },
};

export const MY_ITEMS_CONFIG: Record<UserType, MyItemsConfigItem> = {
  blogger: {
    title: "Мои соцсети",
    description: "Управляйте вашими соцсетями",
    query: "social_accounts",
    card: "SocialCard",
    cardVariant: "editable",
    emptyState: "Добавьте первую соцсеть",
    createButton: {
      text: "+ Добавить соцсеть",
      href: "/social/new",
    },
    actions: ["edit", "delete"],
  },
  client: {
    title: "Мои заказы",
    description: "Управляйте вашими заказами",
    query: "orders",
    card: "OrderCard",
    cardVariant: "editable",
    emptyState: "Создайте первый заказ",
    createButton: {
      text: "+ Создать заказ",
      href: "/order/new",
    },
    actions: ["edit", "close"],
  },
};

export const APPLICATIONS_CONFIG: Record<UserType, ApplicationsConfigItem> = {
  blogger: {
    title: "Мои отклики",
    description: "Отслеживайте статус откликов",
    query: "applications",
    card: "ApplicationCard",
    cardVariant: "outgoing",
    emptyState: "Вы еще не откликались на заказы",
    showStatus: true,
    actions: [],
  },
  client: {
    title: "Входящие отклики",
    description: "Отклики на ваши заказы",
    query: "applications",
    card: "ApplicationCard",
    cardVariant: "incoming",
    emptyState: "Пока нет откликов",
    showStatus: true,
    actions: ["accept", "reject"],
  },
};

export const PROFILE_CONFIG = {
  myProfile: {
    blogger: {
      title: "Мой профиль",
      fields: ["full_name", "bio", "telegram"],
      card: "SocialCard",
      cardVariant: "detailed" as const,
      canEdit: true,
      showReviews: true,
    },
    client: {
      title: "Моя компания",
      fields: ["company_name", "category", "description"],
      card: "OrderCard",
      cardVariant: "detailed" as const,
      canEdit: true,
      showReviews: true,
    },
  } as Record<UserType, ProfileConfigItem>,
  publicProfile: {
    blogger: {
      title: "Профиль блогера",
      fields: ["full_name", "bio"],
      card: "SocialCard",
      cardVariant: "detailed" as const,
      canEdit: false,
      showReviews: true,
      actions: ["write_review"],
    },
    client: {
      title: "Профиль компании",
      fields: ["company_name", "category"],
      card: "OrderCard",
      cardVariant: "detailed" as const,
      canEdit: false,
      showReviews: true,
      actions: ["write_review"],
    },
  } as Record<UserType, ProfileConfigItem>,
};

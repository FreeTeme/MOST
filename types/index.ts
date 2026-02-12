export type UserType = "blogger" | "client";

export interface User {
  id: string;
  telegram_id: number;
  telegram_username: string | null;
  first_name: string | null;
  last_name: string | null;
  photo_url: string | null;
  user_type: UserType;
  full_name: string | null;
  bio: string | null;
  company_name: string | null;
  company_category: string | null;
  company_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SocialAccount {
  id: string;
  blogger_telegram_id: number;
  platform: string;
  profile_url: string;
  followers: number;
  niche: string;
  analytics: Record<string, unknown>;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  title: string;
  description: string | null;
  category: string;
  budget_type: "money" | "barter" | null;
  budget_amount: number | null;
  budget_currency: string;
  social_link: string | null;
  status: string;
  client_telegram_id: number;
  applications_count: number;
  created_at: string;
  updated_at: string;
}

export interface Application {
  id: string;
  order_id: string;
  blogger_telegram_id: number;
  message: string | null;
  status: string;
  applied_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  author_telegram_id: number;
  target_telegram_id: number;
  order_id: string | null;
  created_at: string;
}

export interface ApplicationWithOrder extends Application {
  order?: Order;
}

export interface ApplicationWithBlogger extends Application {
  blogger?: User;
  blogger_socials?: SocialAccount[];
}

export type SocialCardVariant = "compact" | "detailed" | "editable";
export type OrderCardVariant = "compact" | "detailed" | "editable";
export type ApplicationCardVariant = "outgoing" | "incoming";

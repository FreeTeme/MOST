export const TABLES = {
  users: "users",
  social_accounts: "social_accounts",
  orders: "orders",
  applications: "applications",
  reviews: "reviews",
} as const;

export const USER_FIELDS = [
  "id",
  "telegram_id",
  "telegram_username",
  "first_name",
  "last_name",
  "photo_url",
  "user_type",
  "full_name",
  "bio",
  "company_name",
  "company_category",
  "company_description",
  "created_at",
  "updated_at",
] as const;

export const SOCIAL_ACCOUNT_FIELDS = [
  "id",
  "blogger_telegram_id",
  "platform",
  "profile_url",
  "followers",
  "niche",
  "analytics",
  "status",
  "created_at",
  "updated_at",
] as const;

export const ORDER_FIELDS = [
  "id",
  "title",
  "description",
  "category",
  "budget_type",
  "budget_amount",
  "budget_currency",
  "social_link",
  "status",
  "client_telegram_id",
  "applications_count",
  "created_at",
  "updated_at",
] as const;

export const APPLICATION_FIELDS = [
  "id",
  "order_id",
  "blogger_telegram_id",
  "message",
  "status",
  "applied_at",
  "updated_at",
] as const;

export const REVIEW_FIELDS = [
  "id",
  "rating",
  "comment",
  "author_telegram_id",
  "target_telegram_id",
  "order_id",
  "created_at",
] as const;

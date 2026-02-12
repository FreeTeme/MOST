import type { UserType } from "@/types";

export const TAB_ROUTES = [
  "/search",
  "/items",
  "/applications",
  "/profile/me",
] as const;

export type TabRoute = (typeof TAB_ROUTES)[number];

export function isTabRoute(pathname: string): boolean {
  return (TAB_ROUTES as readonly string[]).includes(pathname);
}

export type TabId = TabRoute;

export interface TabConfig {
  id: TabId;
  path: string;
  label: string;
  /** Route visible only for this role; if absent, tab is shown for both */
  role?: UserType;
}

/** All tabs: order defines appearance in tab bar. Role-specific tabs still share the same position. */
export const TABS: TabConfig[] = [
  { id: "/search", path: "/search", label: "Поиск" },
  { id: "/items", path: "/items", label: "Мои" },
  { id: "/applications", path: "/applications", label: "Отклики" },
  { id: "/profile/me", path: "/profile/me", label: "Профиль" },
];

export function getTabsForRole(role: UserType | null): TabConfig[] {
  if (!role) return [];
  return TABS.filter((tab) => tab.role === undefined || tab.role === role);
}

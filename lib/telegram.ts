const SESSION_KEY = "influencer_user";

export interface SessionData {
  telegram_id: number;
  user_type: "blogger" | "client";
}

export function getTelegramUser(): { id: number; first_name: string; last_name?: string; username?: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const user = (window as unknown as { Telegram?: { WebApp?: { initDataUnsafe?: { user?: unknown } } } }).Telegram?.WebApp?.initDataUnsafe?.user;
    return (user as { id: number; first_name: string; last_name?: string; username?: string } | null) ?? null;
  } catch {
    return null;
  }
}

export function getTelegramId(): number | null {
  const user = getTelegramUser();
  return user ? (user as { id: number }).id : null;
}

export function getSession(): SessionData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SessionData;
  } catch {
    return null;
  }
}

export function setSession(data: SessionData) {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
}

export function openTelegramLink(url: string) {
  if (typeof window === "undefined") return;
  import("@twa-dev/sdk").then((m) => m.default.openTelegramLink(url));
}

export function showAlert(message: string) {
  if (typeof window === "undefined") return;
  import("@twa-dev/sdk").then((m) => m.default.showAlert(message));
}

export function showConfirm(message: string): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  return import("@twa-dev/sdk").then(
    (m) => new Promise<boolean>((resolve) => m.default.showConfirm(message, resolve))
  );
}

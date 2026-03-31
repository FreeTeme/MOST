import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type MobileScreenWidth = "column" | "full";

interface MobileScreenProps {
  children: React.ReactNode;
  className?: string;
  /**
   * - **column** (по умолчанию): `max-w-[var(--app-content-max)]` + `mx-auto` + горизонтальные поля
   *   `--app-page-gutter` — удобная ширина строки и отступ от краёв.
   * - **full**: на всю ширину `main` (без искусственного сужения). Вертикальные/горизонтальные
   *   safe-area уже заданы на `.app-root` в `layout.tsx`.
   */
  width?: MobileScreenWidth;
}

export function MobileScreen({ children, className, width = "column" }: MobileScreenProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-1 flex-col",
        width === "full"
          ? "mx-0 w-full max-w-none px-0"
          : "mx-auto w-full max-w-[var(--app-content-max)] px-[var(--app-page-gutter)]",
        className
      )}
    >
      {children}
    </div>
  );
}

interface ScreenHeaderProps {
  title: string;
  description?: string;
  className?: string;
  /** Large title (tab roots); medium for stack / forms */
  size?: "large" | "medium";
  /** Элемент справа в строке заголовка (например, ссылка на профиль) */
  endAccessory?: ReactNode;
}

export function ScreenHeader({
  title,
  description,
  className,
  size = "large",
  endAccessory,
}: ScreenHeaderProps) {
  const hasRow = Boolean(endAccessory);

  return (
    <header
      className={cn(
        "shrink-0",
        hasRow && "flex items-center justify-between gap-[var(--space-3)]",
        size === "large" ? "mb-[var(--app-section-gap)] pt-[var(--space-1)]" : "mb-[var(--space-5)] pt-px",
        className
      )}
    >
      <div className={cn(hasRow && "min-w-0 flex-1")}>
        <h1 className={size === "large" ? "app-title-display" : "app-title-screen"}>{title}</h1>
        {description ? <p className="app-subtitle">{description}</p> : null}
      </div>
      {endAccessory ? <div className="shrink-0">{endAccessory}</div> : null}
    </header>
  );
}

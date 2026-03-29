import { cn } from "@/lib/utils";

interface MobileScreenProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Основная колонка приложения: **mobile-first**, на `md`/`lg` шире за счёт
 * `var(--app-content-max)` и `var(--app-page-gutter)` в `globals.css`.
 * Для нескольких колонок на широких экранах используйте `grid` / `.app-grid-responsive-cols`.
 */
export function MobileScreen({ children, className }: MobileScreenProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full min-w-0 max-w-[var(--app-content-max)] flex-1 flex-col px-[var(--app-page-gutter)]",
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
}

export function ScreenHeader({
  title,
  description,
  className,
  size = "large",
}: ScreenHeaderProps) {
  return (
    <header
      className={cn(
        "shrink-0",
        size === "large" ? "mb-[var(--app-section-gap)] pt-[var(--space-1)]" : "mb-[var(--space-5)] pt-px",
        className
      )}
    >
      <h1 className={size === "large" ? "app-title-display" : "app-title-screen"}>{title}</h1>
      {description ? <p className="app-subtitle">{description}</p> : null}
    </header>
  );
}

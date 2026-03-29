"use client";

import Link from "next/link";
import { Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface ItemListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyState: string;
  loading?: boolean;
  createButton?: { text: string; href: string };
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-[var(--app-list-gap)]" aria-busy aria-label="Загрузка">
      {[0, 1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-[5.75rem] w-full rounded-[var(--radius-app-md)]" />
      ))}
    </div>
  );
}

export function ItemList<T>({
  items,
  renderItem,
  emptyState,
  loading,
  createButton,
}: ItemListProps<T>) {
  if (loading) {
    return <ListSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-[var(--radius-app-lg)] border border-dashed border-[var(--app-border-strong)]",
          "bg-[var(--app-surface-muted)] px-[var(--space-6)] py-[var(--space-10)] text-center"
        )}
      >
        <div
          className="mb-[var(--space-4)] flex size-14 items-center justify-center rounded-[var(--radius-app-md)] bg-[var(--app-surface-elevated)] shadow-[var(--app-shadow-xs)]"
          aria-hidden
        >
          <Inbox className="size-7 text-[var(--tg-theme-hint-color)]" strokeWidth={1.75} />
        </div>
        <p className="max-w-[17rem] text-[length:var(--text-body-sm)] leading-[var(--text-body-sm--line)] text-[var(--tg-theme-hint-color)]">
          {emptyState}
        </p>
        {createButton && (
          <Link
            href={createButton.href}
            className="tap-compact mt-[var(--space-6)] inline-flex h-12 w-full max-w-xs items-center justify-center rounded-[var(--radius-app-sm)] px-[var(--space-6)] text-[length:var(--text-body-sm)] font-semibold leading-none shadow-[var(--app-shadow-sm)]"
            style={{
              background: "var(--tg-theme-button-color)",
              color: "var(--tg-theme-button-text-color)",
            }}
          >
            {createButton.text}
          </Link>
        )}
      </div>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-[var(--app-list-gap)] p-0">
      {items.map((item, index) => (
        <li key={index}>{renderItem(item)}</li>
      ))}
    </ul>
  );
}

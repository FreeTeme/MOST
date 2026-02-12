"use client";

import Link from "next/link";
import { Spinner } from "@telegram-apps/telegram-ui";

interface ItemListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  emptyState: string;
  loading?: boolean;
  createButton?: { text: string; href: string };
}

export function ItemList<T>({
  items,
  renderItem,
  emptyState,
  loading,
  createButton,
}: ItemListProps<T>) {
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="l" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <p className="text-base" style={{ color: "var(--tg-theme-hint-color)" }}>
          {emptyState}
        </p>
        {createButton && (
          <Link
            href={createButton.href}
            className="inline-flex items-center justify-center min-h-[48px] mt-4 px-6 rounded-xl font-medium w-full max-w-[280px] mx-auto"
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
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index}>{renderItem(item)}</div>
      ))}
    </div>
  );
}

"use client";

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
        <p style={{ color: "var(--tg-theme-hint-color)" }}>{emptyState}</p>
        {createButton && (
          <a
            href={createButton.href}
            className="inline-block mt-4 px-6 py-3 rounded-xl font-medium"
            style={{
              background: "var(--tg-theme-button-color)",
              color: "var(--tg-theme-button-text-color)",
            }}
          >
            {createButton.text}
          </a>
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

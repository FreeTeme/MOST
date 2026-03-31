"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserRound } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useSearch } from "@/hooks/useSearch";
import { ItemList } from "@/components/shared/ItemList";
import { SocialCard } from "@/components/cards/SocialCard";
import { OrderCard } from "@/components/cards/OrderCard";
import { ScreenHeader } from "@/components/mobile/mobile-screen";
import { SearchFiltersToolbar } from "@/components/search/search-filters-toolbar";
import type { Order, SocialAccount } from "@/types";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function SearchPage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const {
    items,
    loading,
    config,
    handleAction,
    filters,
    setFilters,
    searchQuery,
    setSearchQuery,
    resetFiltersAndSearch,
    hasActiveQuery,
    hasActiveUi,
  } = useSearch();

  const patchFilters = useCallback(
    (patch: Record<string, string>) => {
      setFilters((f) => {
        const next = { ...f, ...patch };
        if (patch.budgetType === "barter") {
          next.budgetMin = "";
        }
        return next;
      });
    },
    [setFilters]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(false);

  if (!role || !config) {
    return null;
  }

  const renderItem = (item: Order | SocialAccount) => {
    if (config.card === "OrderCard") {
      const order = item as Order;
      const actionResult = handleAction(item, config.actionButton.handler);
      return (
        <OrderCard
          key={order.id}
          order={order}
          variant="compact"
          onApply={
            actionResult?.type === "applyToOrder"
              ? () => router.push(`/order/${order.id}`)
              : undefined
          }
          onClick={() => router.push(`/order/${order.id}`)}
        />
      );
    }
    const social = item as SocialAccount;
    const actionResult = handleAction(item, config.actionButton.handler);
    return (
      <SocialCard
        key={social.id}
        social={social}
        variant="compact"
        onClick={
          actionResult?.type === "viewBloggerProfile"
            ? () => router.push(`/profile/${social.blogger_telegram_id}`)
            : undefined
        }
      />
    );
  };

  const emptyState = hasActiveQuery
    ? "Ничего не найдено. Измените запрос или фильтры."
    : config.emptyState;

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col px-[var(--app-page-gutter)] pb-[var(--space-4)] pt-[var(--space-2)]">
      <ScreenHeader
        title={config.title}
        size="medium"
        className="mb-[var(--space-3)]"
        endAccessory={
          <Link
            href="/profile/me"
            className="tap-compact app-motion flex size-11 items-center justify-center rounded-[var(--radius-app-md)] border border-[var(--app-border)] bg-[var(--app-surface-elevated)] text-[var(--tg-theme-text-color)] transition-[transform,box-shadow] duration-[var(--app-duration)] active:scale-[0.97]"
            aria-label="Мой профиль"
          >
            <UserRound className="size-[1.375rem]" strokeWidth={2} aria-hidden />
          </Link>
        }
      />
      <SearchFiltersToolbar
        role={role}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={patchFilters}
        onResetAll={resetFiltersAndSearch}
        hasActiveUi={hasActiveUi}
      />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <ItemList
          items={items}
          renderItem={renderItem}
          emptyState={emptyState}
          loading={loading}
        />
      </div>
    </div>
  );
}

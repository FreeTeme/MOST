"use client";

import { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useSearch } from "@/hooks/useSearch";
import { ItemList } from "@/components/shared/ItemList";
import { SocialCard } from "@/components/cards/SocialCard";
import { OrderCard } from "@/components/cards/OrderCard";
import { MobileScreen, ScreenHeader } from "@/components/mobile/mobile-screen";
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
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileScreen className="pb-[var(--app-fab-clearance)] pt-[var(--space-2)]">
        <ScreenHeader title={config.title} description={config.description} />
        <SearchFiltersToolbar
          role={role}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={patchFilters}
          onResetAll={resetFiltersAndSearch}
          hasActiveUi={hasActiveUi}
        />
        <ItemList
          items={items}
          renderItem={renderItem}
          emptyState={emptyState}
          loading={loading}
        />
      </MobileScreen>
    </div>
  );
}

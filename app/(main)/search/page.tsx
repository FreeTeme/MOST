"use client";

import { useCallback, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Inbox, UserRound } from "lucide-react";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useSearch } from "@/hooks/useSearch";
import { SearchFiltersToolbar } from "@/components/search/search-filters-toolbar";
import {
  SearchBloggerGridCard,
  SearchOrderGridCard,
} from "@/components/search/search-grid-cards";
import { Skeleton } from "@/components/ui/skeleton";
import type { Order, SocialAccount } from "@/types";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { cn } from "@/lib/utils";

function SearchGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3" aria-busy aria-label="Загрузка">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[1.25rem] bg-white shadow-[0_6px_24px_-8px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04]"
        >
          <Skeleton className="aspect-[4/5] w-full animate-pulse rounded-none bg-gradient-to-br from-[#ebebef] via-[#e8e8ed] to-[#f0f0f2] motion-reduce:animate-none" />
          <div className="space-y-2 p-3 pt-2">
            <Skeleton className="h-3 w-full rounded-md bg-[#e8e8ed] motion-reduce:animate-none" />
            <Skeleton className="h-2.5 w-2/3 rounded-md bg-[#ececec] motion-reduce:animate-none" />
            <div className="flex gap-1.5 pt-1">
              {[0, 1, 2, 3].map((j) => (
                <Skeleton
                  key={j}
                  className="size-[1.625rem] shrink-0 rounded-full bg-[#e8e8ed] motion-reduce:animate-none"
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading, dbUser } = useTelegramAuth();
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
    searchSort,
    selectSortTab,
    priceHighFirst,
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

  const emptyState = hasActiveQuery
    ? "Ничего не найдено. Измените запрос или фильтры."
    : config.emptyState;

  const isOrders = config.card === "OrderCard";

  return (
    <div className="flex min-h-0 min-w-0 w-full flex-1 flex-col px-[var(--app-page-gutter)] pb-[var(--space-4)] pt-2">
      <header className="relative mb-3 flex min-h-10 shrink-0 items-center justify-center px-1">
        <div className="mx-auto max-w-[min(100%,14rem)] rounded-full bg-white px-4 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]">
          <h1 className="truncate text-center text-[0.625rem] font-bold uppercase tracking-[0.14em] text-[#8e8e93]">
            {config.title}
          </h1>
        </div>
        <Link
          href="/profile/me"
          className={cn(
            "tap-compact app-motion absolute right-0 top-1/2 flex size-11 -translate-y-1/2 touch-manipulation items-center justify-center overflow-hidden rounded-full",
            "border border-white/80 bg-gradient-to-br from-white to-[#fafafa]",
            "shadow-[0_10px_28px_-10px_rgba(0,0,0,0.2),0_2px_8px_-4px_rgba(231,83,160,0.12)]",
            "transition-[transform,box-shadow] duration-200 ease-out active:scale-[0.92]"
          )}
          aria-label="Мой профиль"
        >
          {dbUser?.photo_url ? (
            <Image
              src={dbUser.photo_url}
              alt=""
              width={44}
              height={44}
              className="size-full object-cover"
              unoptimized
            />
          ) : (
            <UserRound className="size-[1.35rem] text-[#8e8e93]" strokeWidth={2} aria-hidden />
          )}
        </Link>
      </header>

      <SearchFiltersToolbar
        role={role}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        onFiltersChange={patchFilters}
        onResetAll={resetFiltersAndSearch}
        hasActiveUi={hasActiveUi}
        searchSort={searchSort}
        onSelectSortTab={selectSortTab}
        priceHighFirst={priceHighFirst}
      />

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto [-webkit-overflow-scrolling:touch]">
        {loading ? (
          <SearchGridSkeleton />
        ) : items.length === 0 ? (
          <div
            className={cn(
              "flex flex-col items-center justify-center rounded-[1.375rem] border border-white/70",
              "bg-white/75 px-[var(--space-6)] py-[var(--space-10)] text-center shadow-[0_12px_40px_-20px_rgba(0,0,0,0.12)] backdrop-blur-md"
            )}
          >
            <div
              className="mb-5 flex size-16 items-center justify-center rounded-[1.25rem] bg-gradient-to-br from-[#fff0eb] to-[#ffe0f0] shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_8px_24px_-12px_rgba(231,83,160,0.25)]"
              aria-hidden
            >
              <Inbox className="size-8 text-[#e753a0]/80" strokeWidth={1.75} />
            </div>
            <p className="max-w-[17rem] text-[0.9375rem] font-medium leading-relaxed text-[#636366]">
              {emptyState}
            </p>
          </div>
        ) : (
          <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0">
            {items.map((item) => {
              if (isOrders) {
                const order = item as Order;
                return (
                  <li key={order.id} className="min-w-0">
                    <SearchOrderGridCard
                      order={order}
                      onClick={() => router.push(`/order/${order.id}`)}
                    />
                  </li>
                );
              }
              const social = item as SocialAccount;
              const actionResult = handleAction(item, config.actionButton.handler);
              const onClick =
                actionResult?.type === "viewBloggerProfile"
                  ? () => router.push(`/profile/${social.blogger_telegram_id}`)
                  : undefined;
              return (
                <li key={social.id} className="min-w-0">
                  <SearchBloggerGridCard social={social} onClick={onClick} />
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

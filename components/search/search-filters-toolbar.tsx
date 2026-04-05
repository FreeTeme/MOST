"use client";

import { useId, useState } from "react";
import { ArrowDownUp, SlidersHorizontal, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ORDER_CATEGORIES, BLOGGER_PLATFORMS } from "@/config/search-ui.config";
import type { SearchSortTab } from "@/config/search-sort.config";
import { cn } from "@/lib/utils";
import type { UserType } from "@/types";

interface SearchFiltersToolbarProps {
  role: UserType;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string>;
  onFiltersChange: (patch: Record<string, string>) => void;
  onResetAll: () => void;
  hasActiveUi: boolean;
  searchSort: SearchSortTab;
  onSelectSortTab: (tab: SearchSortTab) => void;
  priceHighFirst: boolean;
}

const SORT_TABS: { id: SearchSortTab; label: string }[] = [
  { id: "recommended", label: "Рекомендуемые" },
  { id: "new", label: "Новые" },
];

function SheetPillButton({
  selected,
  children,
  onClick,
  className,
}: {
  selected: boolean;
  children: React.ReactNode;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "tap-compact min-h-11 min-w-0 flex-1 rounded-full px-4 text-sm font-semibold tracking-tight",
        "touch-manipulation transition-[transform,box-shadow,background,color] duration-200 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
        "active:scale-[0.96]",
        selected
          ? "bg-gradient-to-r from-[#ff9b71] to-[#e753a0] text-white shadow-[0_6px_20px_-4px_color-mix(in_oklab,#e753a0_55%,transparent)]"
          : "bg-[#f2f2f7] text-[#3c3c43] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] ring-1 ring-black/[0.05] active:bg-[#e8e8ed]",
        className
      )}
    >
      {children}
    </button>
  );
}

export function SearchFiltersToolbar({
  role,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onResetAll,
  hasActiveUi,
  searchSort,
  onSelectSortTab,
  priceHighFirst,
}: SearchFiltersToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const titleId = useId();
  const isOrders = role === "blogger";
  const priceTabLabel = isOrders ? "Цена" : "Охват";

  const patch = (p: Record<string, string>) => onFiltersChange(p);

  const sortIdx = searchSort === "recommended" ? 0 : searchSort === "new" ? 1 : 2;

  return (
    <>
      <div className="mb-3 flex w-full min-w-0 items-stretch gap-2.5">
        <div
          className={cn(
            "flex h-[3rem] min-w-0 flex-1 items-center gap-2.5 rounded-full bg-white pl-3.5 pr-1",
            "shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-black/[0.04]",
            "transition-shadow duration-300 ease-out focus-within:shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
          )}
          role="search"
        >
          <Search className="size-[1.125rem] shrink-0 text-[#aeaeb2]" strokeWidth={2.25} aria-hidden />
          <Input
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder="Поиск"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "h-11 min-h-0 flex-1 border-0 bg-transparent px-0 py-0 text-[0.9375rem] shadow-none",
              "text-[#1a1a1a] placeholder:text-[#aeaeb2]",
              "focus-visible:border-transparent focus-visible:ring-0",
              "touch-manipulation"
            )}
            aria-label="Поиск"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className={cn(
                "flex size-9 shrink-0 items-center justify-center rounded-full text-[#8e8e93]",
                "transition-[transform,background-color] duration-200 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
                "active:scale-90 active:bg-black/[0.06]"
              )}
              aria-label="Очистить поиск"
            >
              <X className="size-4" strokeWidth={2.25} />
            </button>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => setSheetOpen((o) => !o)}
          aria-expanded={sheetOpen}
          aria-controls={sheetOpen ? titleId : undefined}
          className={cn(
            "tap-compact relative flex size-12 shrink-0 touch-manipulation items-center justify-center rounded-full bg-white",
            "shadow-[0_2px_12px_rgba(0,0,0,0.08)] ring-1 ring-black/[0.05]",
            "transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
            "active:scale-[0.93] motion-reduce:transition-none",
            sheetOpen && "shadow-[0_4px_18px_rgba(231,83,160,0.25)] ring-[#e753a0]/30"
          )}
          aria-label={sheetOpen ? "Закрыть фильтры" : "Фильтры"}
        >
          {hasActiveUi ? (
            <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-gradient-to-br from-[#ff9b71] to-[#e753a0] ring-2 ring-white" />
          ) : null}
          <SlidersHorizontal className="size-[1.35rem] text-[#1a1a1a]" strokeWidth={2.1} aria-hidden />
        </button>
      </div>

      <div
        className="relative mb-4 rounded-[14px] bg-[#e5e5ea] p-[3px] shadow-[inset_0_1px_2px_rgba(0,0,0,0.06)]"
        role="tablist"
        aria-label="Сортировка"
      >
        <div className="relative grid grid-cols-3">
          <div className="pointer-events-none absolute inset-[3px]" aria-hidden>
            <div
              className={cn(
                "absolute top-0 bottom-0 w-1/3 rounded-[11px] bg-white",
                "shadow-[0_2px_10px_rgba(0,0,0,0.1)]",
                "transition-transform duration-[380ms] ease-[cubic-bezier(0.34,1.45,0.64,1)]",
                "motion-reduce:transition-none"
              )}
              style={{ transform: `translateX(calc(${sortIdx} * 100%))` }}
            />
          </div>
          {SORT_TABS.map(({ id, label }) => {
            const active = searchSort === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={active}
                className={cn(
                  "relative z-10 flex min-h-[2.75rem] items-center justify-center px-1 py-2",
                  "touch-manipulation transition-[color,transform] duration-300 ease-out",
                  "active:scale-[0.97] motion-reduce:active:scale-100",
                  active ? "font-bold text-[#1a1a1a]" : "font-medium text-[#8e8e93]"
                )}
                onClick={() => onSelectSortTab(id)}
              >
                <span className="max-w-full text-center text-[0.68rem] leading-tight tracking-tight sm:text-[0.72rem]">
                  {label}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            role="tab"
            aria-selected={searchSort === "price"}
            className={cn(
              "relative z-10 flex min-h-[2.75rem] items-center justify-center gap-0.5 px-1 py-2",
              "touch-manipulation transition-[color,transform] duration-300 ease-out",
              "active:scale-[0.97] motion-reduce:active:scale-100",
              searchSort === "price" ? "font-bold text-[#1a1a1a]" : "font-medium text-[#8e8e93]"
            )}
            onClick={() => onSelectSortTab("price")}
          >
            <span className="text-[0.68rem] leading-tight tracking-tight sm:text-[0.72rem]">{priceTabLabel}</span>
            <ArrowDownUp
              className={cn(
                "size-3 shrink-0 opacity-80 transition-transform duration-300 ease-[cubic-bezier(0.34,1.45,0.64,1)]",
                searchSort === "price" && !priceHighFirst && "rotate-180"
              )}
              strokeWidth={2.5}
              aria-hidden
            />
          </button>
        </div>
      </div>

      {sheetOpen ? (
        <>
          <button
            type="button"
            className="app-motion fixed inset-x-0 top-0 z-[950] animate-in fade-in-0 duration-200 bg-[color-mix(in_oklab,#1c1c1e_42%,transparent)] backdrop-blur-[3px]"
            style={{ bottom: "var(--app-tabbar-total)" }}
            aria-label="Закрыть"
            onClick={() => setSheetOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "app-sheet-panel fixed inset-x-0 z-[960] max-h-[min(82vh,36rem)] overflow-y-auto rounded-t-[1.75rem]",
              "border-x border-t border-white/40 bg-[color-mix(in_oklab,var(--tg-theme-bg-color)_92%,#ffffff)]",
              "shadow-[0_-12px_48px_-16px_rgba(0,0,0,0.18)] backdrop-blur-2xl",
              "animate-in slide-in-from-bottom-6 duration-300 ease-out"
            )}
            style={{
              bottom: "var(--app-tabbar-total)",
              paddingBottom: "max(var(--space-4), env(safe-area-inset-bottom))",
            }}
          >
            <div className="mx-auto w-full max-w-[var(--app-content-max)] px-[var(--app-page-gutter)] pb-[var(--space-5)] pt-3">
              <div
                className="mx-auto mb-5 h-1 w-11 rounded-full bg-[#c7c7cc]/90"
                aria-hidden
              />
              <h2 id={titleId} className="mb-6 text-center text-xl font-bold tracking-tight text-[#1c1c1e]">
                Фильтры
              </h2>

              {isOrders ? (
                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-3">
                    <Label className="text-[0.8125rem] font-semibold text-[#636366]">Тип бюджета</Label>
                    <div className="flex flex-wrap gap-2">
                      {(
                        [
                          { id: "all", label: "Все" },
                          { id: "money", label: "Деньги" },
                          { id: "barter", label: "Бартер" },
                        ] as const
                      ).map(({ id, label }) => (
                        <SheetPillButton
                          key={id}
                          selected={(filters.budgetType ?? "all") === id}
                          onClick={() =>
                            patch({
                              budgetType: id,
                              ...(id === "barter" ? { budgetMin: "" } : {}),
                            })
                          }
                        >
                          {label}
                        </SheetPillButton>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label className="text-[0.8125rem] font-semibold text-[#636366]">Категория</Label>
                    <Select
                      value={filters.category ? filters.category : "_all"}
                      onValueChange={(v) => patch({ category: v === "_all" ? "" : v })}
                    >
                      <SelectTrigger variant="pill" size="default" className="h-12 rounded-2xl border-0 bg-[#f2f2f7] shadow-inner">
                        <SelectValue placeholder="Все категории" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_all">Все категории</SelectItem>
                        {ORDER_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="filter-budget-min" className="text-[0.8125rem] font-semibold text-[#636366]">
                      Минимальный бюджет, ₽
                    </Label>
                    <Input
                      id="filter-budget-min"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="Без ограничения"
                      disabled={(filters.budgetType ?? "all") === "barter"}
                      value={filters.budgetMin ?? ""}
                      onChange={(e) => patch({ budgetMin: e.target.value })}
                      className="h-12 rounded-2xl border-0 bg-[#f2f2f7] text-base shadow-inner placeholder:text-[#aeaeb2] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,#ff9b71_40%,transparent)]"
                    />
                    {(filters.budgetType ?? "all") === "barter" ? (
                      <p className="text-[0.8125rem] leading-snug text-[#8e8e93]">
                        Для бартера сумма не учитывается
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-7">
                  <div className="flex flex-col gap-3">
                    <Label className="text-[0.8125rem] font-semibold text-[#636366]">Платформа</Label>
                    <Select
                      value={filters.platform ? filters.platform : "_all"}
                      onValueChange={(v) => patch({ platform: v === "_all" ? "" : v })}
                    >
                      <SelectTrigger variant="pill" size="default" className="h-12 rounded-2xl border-0 bg-[#f2f2f7] shadow-inner">
                        <SelectValue placeholder="Все платформы" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="_all">Все платформы</SelectItem>
                        {BLOGGER_PLATFORMS.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="filter-niche" className="text-[0.8125rem] font-semibold text-[#636366]">
                      Ниша
                    </Label>
                    <Input
                      id="filter-niche"
                      placeholder="Например: красота"
                      value={filters.niche ?? ""}
                      onChange={(e) => patch({ niche: e.target.value })}
                      className="h-12 rounded-2xl border-0 bg-[#f2f2f7] text-base shadow-inner placeholder:text-[#aeaeb2] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,#ff9b71_40%,transparent)]"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Label htmlFor="filter-followers" className="text-[0.8125rem] font-semibold text-[#636366]">
                      Минимум подписчиков
                    </Label>
                    <Input
                      id="filter-followers"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="Без ограничения"
                      value={filters.followersMin ?? ""}
                      onChange={(e) => patch({ followersMin: e.target.value })}
                      className="h-12 rounded-2xl border-0 bg-[#f2f2f7] text-base shadow-inner placeholder:text-[#aeaeb2] focus-visible:ring-2 focus-visible:ring-[color-mix(in_oklab,#ff9b71_40%,transparent)]"
                    />
                  </div>
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  className={cn(
                    "tap-compact h-[3.25rem] min-h-[3.25rem] flex-1 rounded-2xl text-base font-semibold",
                    "touch-manipulation border-2 border-[#e5e5ea] bg-white text-[#1c1c1e] shadow-sm",
                    "transition-[transform,background-color] duration-150 active:scale-[0.98] active:bg-[#f9f9f9]"
                  )}
                  onClick={() => onResetAll()}
                >
                  Сбросить всё
                </button>
                <button
                  type="button"
                  className={cn(
                    "app-btn-primary-gradient tap-compact h-[3.25rem] min-h-[3.25rem] flex-1 rounded-2xl border-0 text-base font-semibold",
                    "touch-manipulation transition-transform duration-150 active:scale-[0.98]"
                  )}
                  onClick={() => setSheetOpen(false)}
                >
                  Готово
                </button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

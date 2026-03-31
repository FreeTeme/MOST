"use client";

import { useId, useState } from "react";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import type { UserType } from "@/types";

interface SearchFiltersToolbarProps {
  role: UserType;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: Record<string, string>;
  onFiltersChange: (patch: Record<string, string>) => void;
  onResetAll: () => void;
  /** Показать точку на FAB (есть текст поиска или выбраны фильтры) */
  hasActiveUi: boolean;
}

export function SearchFiltersToolbar({
  role,
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  onResetAll,
  hasActiveUi,
}: SearchFiltersToolbarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const titleId = useId();
  const isOrders = role === "blogger";

  const patch = (p: Record<string, string>) => onFiltersChange(p);

  return (
    <>
      <div className="mb-[var(--space-4)]">
        <div
          className={cn(
            "flex min-h-[3rem] w-full min-w-0 items-center gap-1 rounded-[var(--radius-app-md)] border border-[var(--app-border)]",
            "bg-[var(--app-surface-elevated)] pl-[var(--space-2)] pr-[var(--space-1)] shadow-[var(--app-shadow-xs)]"
          )}
          role="search"
        >
          <Search
            className="pointer-events-none size-[1.125rem] shrink-0 text-[var(--tg-theme-hint-color)]"
            strokeWidth={2}
            aria-hidden
          />
          <Input
            type="search"
            enterKeyHint="search"
            autoComplete="off"
            placeholder={isOrders ? "Название или описание…" : "Платформа, ниша, ссылка…"}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(
              "app-field border-0 bg-transparent shadow-none",
              "min-h-0 flex-1 rounded-none py-[var(--space-2)] pl-[var(--space-2)] pr-[var(--space-1)]",
              "text-[length:var(--text-body)] leading-[var(--text-body--line)]",
              "focus-visible:border-transparent focus-visible:shadow-none focus-visible:ring-0"
            )}
            aria-label="Поиск"
          />
          {searchQuery ? (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="tap-compact app-motion flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-app-sm)] text-[var(--tg-theme-hint-color)] transition-colors hover:bg-[color-mix(in_oklab,var(--tg-theme-hint-color)_10%,transparent)]"
              aria-label="Очистить поиск"
            >
              <X className="size-4" strokeWidth={2} />
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setSheetOpen((o) => !o)}
            aria-expanded={sheetOpen}
            aria-controls={sheetOpen ? titleId : undefined}
            className={cn(
              "tap-compact app-motion relative flex size-10 shrink-0 items-center justify-center rounded-[var(--radius-app-sm)]",
              "border border-[color-mix(in_oklab,var(--tg-theme-text-color)_10%,transparent)]",
              "text-[var(--tg-theme-button-text-color)] transition-[transform,box-shadow] duration-[var(--app-duration)] active:scale-95"
            )}
            style={{ backgroundColor: "var(--tg-theme-button-color)" }}
            aria-label={sheetOpen ? "Закрыть фильтры" : "Фильтры"}
          >
            {hasActiveUi ? (
              <span
                className="absolute right-1.5 top-1.5 size-2 rounded-full bg-[var(--tg-theme-button-text-color)] ring-2 ring-[var(--tg-theme-button-color)]"
                aria-hidden
              />
            ) : null}
            <SlidersHorizontal className={cn("size-[1.25rem]", sheetOpen && "rotate-90")} strokeWidth={2} aria-hidden />
          </button>
        </div>
      </div>

      {sheetOpen ? (
        <>
          <button
            type="button"
            className="app-motion fixed inset-x-0 top-0 z-[950] bg-[color-mix(in_oklab,var(--tg-theme-text-color)_45%,transparent)] backdrop-blur-sm transition-opacity duration-[var(--app-duration)]"
            style={{ bottom: "var(--app-tabbar-total)" }}
            aria-label="Закрыть"
            onClick={() => setSheetOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className={cn(
              "app-sheet-panel fixed inset-x-0 z-[960] max-h-[min(78vh,34rem)] overflow-y-auto rounded-t-[var(--radius-app-xl)] border-x border-t border-[var(--app-border)]",
              "bg-[var(--tg-theme-bg-color)] shadow-[var(--app-shadow-sheet)]"
            )}
            style={{
              bottom: "var(--app-tabbar-total)",
              paddingBottom: "max(var(--space-4), env(safe-area-inset-bottom))",
            }}
          >
            <div className="mx-auto w-full max-w-[var(--app-content-max)] px-[var(--app-page-gutter)] pb-[var(--space-4)] pt-[var(--space-2)]">
              <div
                className="mx-auto mb-[var(--space-4)] h-1 w-10 rounded-[var(--radius-app-pill)] bg-[var(--app-border-strong)]"
                aria-hidden
              />
              <h2 id={titleId} className="app-title-screen mb-[var(--space-5)]">
                Фильтры
              </h2>

              {isOrders ? (
                <div className="flex flex-col gap-[var(--space-6)]">
                  <div className="flex flex-col gap-[var(--space-2)]">
                    <Label>Категория</Label>
                    <Select
                      value={filters.category ? filters.category : "_all"}
                      onValueChange={(v) => patch({ category: v === "_all" ? "" : v })}
                    >
                      <SelectTrigger>
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

                  <div className="flex flex-col gap-[var(--space-2)]">
                    <Label>Тип бюджета</Label>
                    <div className="flex flex-wrap gap-[var(--space-2)]">
                      {(
                        [
                          { id: "all", label: "Все" },
                          { id: "money", label: "Деньги" },
                          { id: "barter", label: "Бартер" },
                        ] as const
                      ).map(({ id, label }) => (
                        <Button
                          key={id}
                          type="button"
                          variant={(filters.budgetType ?? "all") === id ? "default" : "outline"}
                          className="tap-compact min-h-10 flex-1 rounded-[var(--radius-app-pill)] sm:flex-none"
                          style={
                            (filters.budgetType ?? "all") === id
                              ? {
                                  backgroundColor: "var(--tg-theme-button-color)",
                                  color: "var(--tg-theme-button-text-color)",
                                }
                              : undefined
                          }
                          onClick={() =>
                            patch({
                              budgetType: id,
                              ...(id === "barter" ? { budgetMin: "" } : {}),
                            })
                          }
                        >
                          {label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-[var(--space-2)]">
                    <Label htmlFor="filter-budget-min">Минимальный бюджет, ₽</Label>
                    <Input
                      id="filter-budget-min"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="Без ограничения"
                      disabled={(filters.budgetType ?? "all") === "barter"}
                      value={filters.budgetMin ?? ""}
                      onChange={(e) => patch({ budgetMin: e.target.value })}
                    />
                    {(filters.budgetType ?? "all") === "barter" ? (
                      <p className="text-[length:var(--text-caption)] leading-[var(--text-caption--line)] text-[var(--tg-theme-hint-color)]">
                        Для бартера сумма не учитывается
                      </p>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[var(--space-6)]">
                  <div className="flex flex-col gap-[var(--space-2)]">
                    <Label>Платформа</Label>
                    <Select
                      value={filters.platform ? filters.platform : "_all"}
                      onValueChange={(v) => patch({ platform: v === "_all" ? "" : v })}
                    >
                      <SelectTrigger>
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

                  <div className="flex flex-col gap-[var(--space-2)]">
                    <Label htmlFor="filter-niche">Ниша</Label>
                    <Input
                      id="filter-niche"
                      placeholder="Например: красота"
                      value={filters.niche ?? ""}
                      onChange={(e) => patch({ niche: e.target.value })}
                    />
                  </div>

                  <div className="flex flex-col gap-[var(--space-2)]">
                    <Label htmlFor="filter-followers">Минимум подписчиков</Label>
                    <Input
                      id="filter-followers"
                      type="number"
                      inputMode="numeric"
                      min={0}
                      placeholder="Без ограничения"
                      value={filters.followersMin ?? ""}
                      onChange={(e) => patch({ followersMin: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="mt-[var(--space-6)] flex flex-col gap-[var(--space-2)] sm:flex-row sm:gap-[var(--space-3)]">
                <Button
                  type="button"
                  variant="outline"
                  className="h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)]"
                  onClick={() => {
                    onResetAll();
                  }}
                >
                  Сбросить всё
                </Button>
                <Button
                  type="button"
                  className="h-12 min-h-12 flex-1 rounded-[var(--radius-app-sm)]"
                  style={{
                    backgroundColor: "var(--tg-theme-button-color)",
                    color: "var(--tg-theme-button-text-color)",
                  }}
                  onClick={() => setSheetOpen(false)}
                >
                  Готово
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </>
  );
}

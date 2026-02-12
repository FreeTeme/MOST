"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@telegram-apps/telegram-ui";
import type { OrderFormData } from "@/hooks/useCreateOrder";

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

const CATEGORIES = [
  "Реклама",
  "Обзор",
  "Интеграция",
  "Сторис",
  "Пост",
  "Другое",
];

export function OrderForm({ onSubmit, loading, error }: OrderFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [budgetType, setBudgetType] = useState<"money" | "barter">("money");
  const [budgetAmount, setBudgetAmount] = useState("");
  const [socialLink, setSocialLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      title,
      description,
      category: category || "Другое",
      budget_type: budgetType,
      budget_amount: budgetType === "money" && budgetAmount ? Number(budgetAmount) : null,
      budget_currency: "RUB",
      social_link: socialLink,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        header="Заголовок заказа"
        placeholder="Например: Реклама косметики"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <Textarea
        header="Описание"
        placeholder="Опишите задачу для блогера"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <div>
        <label
          className="block text-sm mb-1"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          Категория
        </label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-xl border p-3 min-h-[44px]"
          style={{
            background: "var(--tg-theme-bg-color)",
            color: "var(--tg-theme-text-color)",
            borderColor: "var(--tg-theme-hint-color)",
          }}
        >
          <option value="">Выберите</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          className="block text-sm mb-1"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          Бюджет
        </label>
        <div className="flex gap-2">
          <Button
            mode={budgetType === "money" ? "filled" : "bezeled"}
            size="s"
            onClick={() => setBudgetType("money")}
          >
            Деньги
          </Button>
          <Button
            mode={budgetType === "barter" ? "filled" : "bezeled"}
            size="s"
            onClick={() => setBudgetType("barter")}
          >
            Бартер
          </Button>
        </div>
        {budgetType === "money" && (
          <Input
            type="number"
            placeholder="Сумма в рублях"
            value={budgetAmount}
            onChange={(e) => setBudgetAmount(e.target.value)}
            className="mt-2"
          />
        )}
      </div>
      <Input
        header="Ссылка на соцсеть / продукт"
        placeholder="https://..."
        value={socialLink}
        onChange={(e) => setSocialLink(e.target.value)}
      />
      {error && (
        <p className="text-sm" style={{ color: "#e53935" }}>
          {error}
        </p>
      )}
      <Button
        type="submit"
        mode="filled"
        size="l"
        stretched
        disabled={loading}
        loading={loading}
      >
        Создать заказ
      </Button>
    </form>
  );
}

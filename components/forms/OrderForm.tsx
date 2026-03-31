"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type FormValues = {
  title: string;
  description: string;
  category: string;
  budget_amount: string;
  social_link: string;
};

export function OrderForm({ onSubmit, loading, error }: OrderFormProps) {
  const [budgetType, setBudgetType] = useState<"money" | "barter">("money");
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: { title: "", description: "", category: "", budget_amount: "", social_link: "" },
  });
  const category = watch("category");

  const onFormSubmit = async (values: FormValues) => {
    await onSubmit({
      title: values.title,
      description: values.description,
      category: values.category || "Другое",
      budget_type: budgetType,
      budget_amount: budgetType === "money" && values.budget_amount ? Number(values.budget_amount) : null,
      budget_currency: "RUB",
      social_link: values.social_link ?? "",
    });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="order-title">Заголовок заказа</Label>
        <Input
          id="order-title"
          variant="pill"
          placeholder="Например: Реклама косметики"
          {...register("title", { required: "Введите заголовок" })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="order-description">Описание</Label>
        <Textarea
          id="order-description"
          variant="pill"
          placeholder="Опишите задачу для блогера"
          rows={4}
          {...register("description")}
        />
      </div>
      <div className="space-y-2">
        <Label>Категория</Label>
        <Select value={category || undefined} onValueChange={(v) => setValue("category", v)}>
          <SelectTrigger variant="pill" className="w-full">
            <SelectValue placeholder="Выберите" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label>Бюджет</Label>
        <div className="mb-2 flex flex-wrap gap-2">
          <button
            type="button"
            className="app-chip tap-compact min-h-10 flex-1 sm:flex-none"
            aria-pressed={budgetType === "money"}
            onClick={() => setBudgetType("money")}
          >
            Деньги
          </button>
          <button
            type="button"
            className="app-chip tap-compact min-h-10 flex-1 sm:flex-none"
            aria-pressed={budgetType === "barter"}
            onClick={() => setBudgetType("barter")}
          >
            Бартер
          </button>
        </div>
        {budgetType === "money" && (
          <Input
            type="number"
            variant="pill"
            placeholder="Сумма в рублях"
            {...register("budget_amount")}
          />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="order-social">Ссылка на соцсеть / продукт</Label>
        <Input
          id="order-social"
          variant="pill"
          placeholder="https://..."
          {...register("social_link")}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        className="app-btn-primary-gradient tap-compact mt-2 w-full"
        disabled={loading}
      >
        {loading ? "Создание…" : "Создать заказ"}
      </button>
    </form>
  );
}

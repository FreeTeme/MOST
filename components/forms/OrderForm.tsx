"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
          placeholder="Например: Реклама косметики"
          className="min-h-11"
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
          placeholder="Опишите задачу для блогера"
          rows={4}
          {...register("description")}
        />
      </div>
      <div className="space-y-2">
        <Label>Категория</Label>
        <Select value={category || undefined} onValueChange={(v) => setValue("category", v)}>
          <SelectTrigger className="min-h-11 w-full">
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
        <div className="flex gap-2 mb-2">
          <Button
            type="button"
            variant={budgetType === "money" ? "default" : "outline"}
            onClick={() => setBudgetType("money")}
          >
            Деньги
          </Button>
          <Button
            type="button"
            variant={budgetType === "barter" ? "default" : "outline"}
            onClick={() => setBudgetType("barter")}
          >
            Бартер
          </Button>
        </div>
        {budgetType === "money" && (
          <Input
            type="number"
            placeholder="Сумма в рублях"
            className="min-h-11"
            {...register("budget_amount")}
          />
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="order-social">Ссылка на соцсеть / продукт</Label>
        <Input
          id="order-social"
          placeholder="https://..."
          className="min-h-11"
          {...register("social_link")}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" size="lg" className="w-full min-h-11" disabled={loading}>
        {loading ? "Создание…" : "Создать заказ"}
      </Button>
    </form>
  );
}

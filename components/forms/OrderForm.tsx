"use client";

import { useState } from "react";
import { Button, Input, Select, Form } from "antd";
import type { OrderFormData } from "@/hooks/useCreateOrder";

const { TextArea } = Input;

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
  const [form] = Form.useForm();
  const [budgetType, setBudgetType] = useState<"money" | "barter">("money");

  const handleSubmit = async (values: {
    title: string;
    description: string;
    category: string;
    budget_amount?: string;
    social_link: string;
  }) => {
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
    <Form form={form} layout="vertical" onFinish={handleSubmit} className="space-y-4">
      <Form.Item
        name="title"
        label="Заголовок заказа"
        rules={[{ required: true, message: "Введите заголовок" }]}
      >
        <Input placeholder="Например: Реклама косметики" size="large" />
      </Form.Item>
      <Form.Item name="description" label="Описание">
        <TextArea placeholder="Опишите задачу для блогера" rows={4} size="large" />
      </Form.Item>
      <Form.Item name="category" label="Категория">
        <Select placeholder="Выберите" size="large" allowClear>
          {CATEGORIES.map((c) => (
            <Select.Option key={c} value={c}>
              {c}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item label="Бюджет">
        <div className="flex gap-2 mb-2">
          <Button
            type={budgetType === "money" ? "primary" : "default"}
            onClick={() => setBudgetType("money")}
          >
            Деньги
          </Button>
          <Button
            type={budgetType === "barter" ? "primary" : "default"}
            onClick={() => setBudgetType("barter")}
          >
            Бартер
          </Button>
        </div>
        {budgetType === "money" && (
          <Form.Item name="budget_amount" noStyle>
            <Input type="number" placeholder="Сумма в рублях" size="large" />
          </Form.Item>
        )}
      </Form.Item>
      <Form.Item name="social_link" label="Ссылка на соцсеть / продукт">
        <Input placeholder="https://..." size="large" />
      </Form.Item>
      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
          disabled={loading}
        >
          Создать заказ
        </Button>
      </Form.Item>
    </Form>
  );
}

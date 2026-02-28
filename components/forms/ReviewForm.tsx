"use client";

import { useState } from "react";
import { Button, Input, Form } from "antd";
import type { ReviewFormData } from "@/hooks/useReview";

const { TextArea } = Input;

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export function ReviewForm({ onSubmit, loading, error, onCancel }: ReviewFormProps) {
  const [form] = Form.useForm();
  const [rating, setRating] = useState(0);

  const handleSubmit = async (values: { comment?: string }) => {
    if (rating < 1 || rating > 5) return;
    await onSubmit({ rating, comment: values.comment ?? "" });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Form.Item label="Оценка" required>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="w-10 h-10 rounded-full text-lg border-0 cursor-pointer"
              style={{
                background:
                  rating >= n
                    ? "var(--tg-theme-button-color, #2481cc)"
                    : "var(--tg-theme-secondary-bg-color, #f0f2f5)",
                color: rating >= n ? "var(--tg-theme-button-text-color, #fff)" : "var(--tg-theme-hint-color, #999)",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </Form.Item>
      <Form.Item name="comment" label="Комментарий (необязательно)">
        <TextArea placeholder="Напишите отзыв" rows={4} size="large" />
      </Form.Item>
      {error && (
        <p className="text-sm text-red-500 mb-2">{error}</p>
      )}
      <div className="flex gap-2">
        {onCancel && (
          <Button size="large" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          loading={loading}
          disabled={loading || rating < 1}
        >
          Отправить отзыв
        </Button>
      </div>
    </Form>
  );
}

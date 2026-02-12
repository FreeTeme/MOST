"use client";

import { useState } from "react";
import { Button, Textarea } from "@telegram-apps/telegram-ui";
import type { ReviewFormData } from "@/hooks/useReview";

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

export function ReviewForm({ onSubmit, loading, error, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) return;
    await onSubmit({ rating, comment });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          className="block text-sm mb-2"
          style={{ color: "var(--tg-theme-hint-color)" }}
        >
          Оценка
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="w-10 h-10 rounded-full text-lg"
              style={{
                background:
                  rating >= n
                    ? "var(--tg-theme-button-color)"
                    : "var(--tg-theme-secondary-bg-color)",
                color: rating >= n ? "var(--tg-theme-button-text-color)" : "var(--tg-theme-hint-color)",
              }}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <Textarea
        header="Комментарий (необязательно)"
        placeholder="Напишите отзыв"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      {error && (
        <p className="text-sm" style={{ color: "#e53935" }}>
          {error}
        </p>
      )}
      <div className="flex gap-2">
        {onCancel && (
          <Button mode="bezeled" size="l" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button
          type="submit"
          mode="filled"
          size="l"
          stretched
          disabled={loading || rating < 1}
          loading={loading}
        >
          Отправить отзыв
        </Button>
      </div>
    </form>
  );
}

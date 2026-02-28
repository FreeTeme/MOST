"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { ReviewFormData } from "@/hooks/useReview";

interface ReviewFormProps {
  onSubmit: (data: ReviewFormData) => Promise<void>;
  loading?: boolean;
  error?: string | null;
  onCancel?: () => void;
}

type FormValues = {
  comment: string;
};

export function ReviewForm({ onSubmit, loading, error, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const { register, handleSubmit } = useForm<FormValues>({
    defaultValues: { comment: "" },
  });

  const onFormSubmit = async (values: FormValues) => {
    if (rating < 1 || rating > 5) return;
    await onSubmit({ rating, comment: values.comment ?? "" });
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Оценка</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              className="w-10 h-10 rounded-full text-lg border-0 cursor-pointer min-w-10 min-h-10"
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
      </div>
      <div className="space-y-2">
        <Label htmlFor="review-comment">Комментарий (необязательно)</Label>
        <Textarea
          id="review-comment"
          placeholder="Напишите отзыв"
          rows={4}
          {...register("comment")}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" size="lg" variant="outline" onClick={onCancel}>
            Отмена
          </Button>
        )}
        <Button
          type="submit"
          size="lg"
          disabled={loading || rating < 1}
        >
          {loading ? "Отправка…" : "Отправить отзыв"}
        </Button>
      </div>
    </form>
  );
}

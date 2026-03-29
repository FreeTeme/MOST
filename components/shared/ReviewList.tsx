"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types";

interface ReviewListProps {
  reviews: Review[];
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`Оценка ${rating} из 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <Star
            key={i}
            className="size-4 shrink-0"
            strokeWidth={1.5}
            fill={filled ? "var(--tg-theme-button-color)" : "none"}
            style={{ color: filled ? "var(--tg-theme-button-color)" : "var(--tg-theme-hint-color)", opacity: filled ? 1 : 0.45 }}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="py-[var(--space-6)] text-center text-[length:var(--text-body-sm)] leading-[var(--text-body-sm--line)] text-[var(--tg-theme-hint-color)]">
        Пока нет отзывов
      </p>
    );
  }

  const byDate = reviews.reduce<Record<string, Review[]>>((acc, r) => {
    const date = new Date(r.created_at).toLocaleDateString("ru");
    if (!acc[date]) acc[date] = [];
    acc[date].push(r);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {Object.entries(byDate).map(([date, list]) => (
        <div key={date}>
          <p className="app-overline mb-[var(--space-2)]">{date}</p>
          <ul className="list-none space-y-2 p-0">
            {list.map((review) => (
              <li key={review.id}>
                <Card className="overflow-hidden">
                  <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                    <StarRow rating={review.rating} />
                    {review.comment ? (
                      <p className="text-sm leading-relaxed text-[var(--tg-theme-text-color)]">{review.comment}</p>
                    ) : null}
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

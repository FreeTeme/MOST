"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { Review } from "@/types";

interface ReviewListProps {
  reviews: Review[];
}

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ color: "var(--tg-theme-button-color, #2481cc)" }}>
      {"★".repeat(rating)}
      <span style={{ color: "var(--tg-theme-hint-color, #999)" }}>
        {"☆".repeat(5 - rating)}
      </span>
    </span>
  );
}

export function ReviewList({ reviews }: ReviewListProps) {
  if (reviews.length === 0) {
    return (
      <p className="text-center py-4 text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
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
    <div className="space-y-4">
      {Object.entries(byDate).map(([date, list]) => (
        <div key={date}>
          <p className="text-sm mb-2 block" style={{ color: "var(--tg-theme-hint-color)" }}>
            {date}
          </p>
          <div className="space-y-2">
            {list.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="text-lg">
                      <StarRating rating={review.rating} />
                    </div>
                    {review.comment && (
                      <p className="text-sm" style={{ color: "var(--tg-theme-text-color)" }}>
                        {review.comment}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

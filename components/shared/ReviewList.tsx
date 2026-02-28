"use client";

import { Card, Flex, Typography } from "antd";
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
      <Typography.Text type="secondary" className="block text-center py-4">
        Пока нет отзывов
      </Typography.Text>
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
          <Typography.Text type="secondary" className="text-sm mb-2 block">
            {date}
          </Typography.Text>
          <div className="space-y-2">
            {list.map((review) => (
              <Card key={review.id} size="small" className="rounded-2xl">
                <Flex align="flex-start" gap={12}>
                  <div className="text-lg">
                    <StarRating rating={review.rating} />
                  </div>
                  {review.comment && (
                    <Typography.Text>{review.comment}</Typography.Text>
                  )}
                </Flex>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

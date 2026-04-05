"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useProfile } from "@/hooks/useProfile";
import { useReview } from "@/hooks/useReview";
import { ProfileView } from "@/components/shared/ProfileView";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileScreen } from "@/components/mobile/mobile-screen";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const telegramId = id ? Number(id) : undefined;
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { profile, items, reviews, loading, config, isOwnProfile, refetch } = useProfile(telegramId);
  const { submitReview, loading: reviewLoading, error: reviewError } = useReview(telegramId, () => {
    setShowReviewForm(false);
    refetch();
  });
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(!!(authLoading === false && isAuthenticated), () => router.back());

  if (!role) {
    return null;
  }

  if (loading && !profile) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center py-16">
        <Skeleton className="size-14 rounded-full" />
      </div>
    );
  }

  if (!profile) {
    return (
      <MobileScreen className="pt-4">
        <p className="text-sm text-[var(--tg-theme-hint-color)]">Профиль не найден</p>
      </MobileScreen>
    );
  }

  const profileConfig =
    config ??
    (profile.user_type === "blogger"
      ? {
          title: "Профиль блогера",
          fields: ["full_name", "bio"],
          card: "SocialCard",
          cardVariant: "detailed",
          canEdit: false,
          showReviews: true,
          actions: ["write_review"],
        }
      : {
          title: "Профиль компании",
          fields: ["company_name", "category"],
          card: "OrderCard",
          cardVariant: "detailed",
          canEdit: false,
          showReviews: true,
          actions: ["write_review"],
        });

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileScreen className="pt-2">
        {showReviewForm ? (
          <Card className="overflow-hidden rounded-[1.5rem] border-black/[0.04] bg-white shadow-[0_8px_32px_-16px_rgba(0,0,0,0.12)]">
            <CardContent className="p-4 sm:p-5">
              <ReviewForm
                onSubmit={submitReview}
                loading={reviewLoading}
                error={reviewError}
                onCancel={() => setShowReviewForm(false)}
              />
            </CardContent>
          </Card>
        ) : (
          <ProfileView
            profile={profile}
            items={items}
            reviews={reviews}
            config={profileConfig}
            isOwnProfile={isOwnProfile}
            onWriteReview={
              !isOwnProfile && profileConfig.actions?.includes("write_review")
                ? () => setShowReviewForm(true)
                : undefined
            }
          />
        )}
      </MobileScreen>
    </div>
  );
}

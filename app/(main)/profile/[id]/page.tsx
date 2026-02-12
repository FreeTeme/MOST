"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useProfile } from "@/hooks/useProfile";
import { useReview } from "@/hooks/useReview";
import { ProfileView } from "@/components/shared/ProfileView";
import { ReviewForm } from "@/components/forms/ReviewForm";
import { Card } from "@telegram-apps/telegram-ui";
import { Spinner } from "@telegram-apps/telegram-ui";
import { useWebAppBackButton } from "@/hooks/useWebApp";
import { useState } from "react";

export default function PublicProfilePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const telegramId = id ? Number(id) : undefined;
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { profile, items, reviews, loading, config, isOwnProfile, refetch } =
    useProfile(telegramId);
  const { submitReview, loading: reviewLoading, error: reviewError } = useReview(
    telegramId,
    () => {
      setShowReviewForm(false);
      refetch();
    }
  );
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
      <div className="flex justify-center py-12">
        <Spinner size="l" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4">
        <p style={{ color: "var(--tg-theme-hint-color)" }}>Профиль не найден</p>
      </div>
    );
  }

  const profileConfig = config ?? (profile.user_type === "blogger"
    ? { title: "Профиль блогера", fields: ["full_name", "bio"], card: "SocialCard", cardVariant: "detailed", canEdit: false, showReviews: true, actions: ["write_review"] }
    : { title: "Профиль компании", fields: ["company_name", "category"], card: "OrderCard", cardVariant: "detailed", canEdit: false, showReviews: true, actions: ["write_review"] });

  return (
    <div className="min-h-screen p-4 pb-24">
      <h1 className="text-xl font-bold mb-4" style={{ color: "var(--tg-theme-text-color)" }}>
        {profileConfig.title}
      </h1>
      {showReviewForm ? (
        <Card className="p-4">
          <ReviewForm
            onSubmit={submitReview}
            loading={reviewLoading}
            error={reviewError}
            onCancel={() => setShowReviewForm(false)}
          />
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
    </div>
  );
}

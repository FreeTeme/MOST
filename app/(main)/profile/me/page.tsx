"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfileView } from "@/components/shared/ProfileView";
import { Spinner } from "@telegram-apps/telegram-ui";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function MyProfilePage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { profile, items, reviews, loading, config, isOwnProfile, updateProfile } =
    useProfile();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(false);

  if (!role || !config) {
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

  return (
    <div className="min-h-screen p-4 pb-24">
      <h1 className="text-xl font-bold mb-4" style={{ color: "var(--tg-theme-text-color)" }}>
        {config.title}
      </h1>
      <ProfileView
        profile={profile}
        items={items}
        reviews={reviews}
        config={config}
        isOwnProfile={isOwnProfile}
        onUpdateProfile={config.canEdit ? updateProfile : undefined}
      />
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useProfile } from "@/hooks/useProfile";
import { ProfileView } from "@/components/shared/ProfileView";
import { Skeleton } from "@/components/ui/skeleton";
import { MobileScreen, ScreenHeader } from "@/components/mobile/mobile-screen";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function MyProfilePage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { profile, items, reviews, loading, config, isOwnProfile, updateProfile } = useProfile();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(false);

  if (!role || !config) {
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

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileScreen className="pt-2">
        <ScreenHeader title={config.title} size="medium" />
        <ProfileView
          profile={profile}
          items={items}
          reviews={reviews}
          config={config}
          isOwnProfile={isOwnProfile}
          onUpdateProfile={config.canEdit ? updateProfile : undefined}
        />
      </MobileScreen>
    </div>
  );
}

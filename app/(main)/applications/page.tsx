"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useApplications } from "@/hooks/useApplications";
import { ItemList } from "@/components/shared/ItemList";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { MobileScreen, ScreenHeader } from "@/components/mobile/mobile-screen";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function ApplicationsPage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { applications, loading, config, updateStatus } = useApplications();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(false);

  if (!role || !config) {
    return null;
  }

  const renderItem = (app: (typeof applications)[0]) => (
    <ApplicationCard
      key={app.id}
      application={app}
      variant={config.cardVariant}
      showStatus={config.showStatus}
      actions={config.actions as ("accept" | "reject")[]}
      onStatusChange={updateStatus}
      onOrderClick={(id) => router.push(`/order/${id}`)}
      onBloggerClick={(tid) => router.push(`/profile/${tid}`)}
    />
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <MobileScreen className="pt-2">
        <ScreenHeader title={config.title} description={config.description} />
        <ItemList
          items={applications}
          renderItem={renderItem}
          emptyState={config.emptyState}
          loading={loading}
        />
      </MobileScreen>
    </div>
  );
}

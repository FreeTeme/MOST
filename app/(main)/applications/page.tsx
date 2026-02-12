"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/hooks/useRole";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useApplications } from "@/hooks/useApplications";
import { ItemList } from "@/components/shared/ItemList";
import { ApplicationCard } from "@/components/cards/ApplicationCard";
import { useWebAppBackButton } from "@/hooks/useWebApp";

export default function ApplicationsPage() {
  const router = useRouter();
  const { role } = useRole();
  const { isAuthenticated, loading: authLoading } = useTelegramAuth();
  const { applications, loading, config, updateStatus } = useApplications();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.push("/role-select");
  }, [authLoading, isAuthenticated, router]);

  useWebAppBackButton(!!(authLoading === false && isAuthenticated), () => router.push("/"));

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
    <div className="min-h-screen p-4 pb-24">
      <h1 className="text-xl font-bold mb-1" style={{ color: "var(--tg-theme-text-color)" }}>
        {config.title}
      </h1>
      <p className="mb-4 text-sm" style={{ color: "var(--tg-theme-hint-color)" }}>
        {config.description}
      </p>
      <ItemList
        items={applications}
        renderItem={renderItem}
        emptyState={config.emptyState}
        loading={loading}
      />
    </div>
  );
}

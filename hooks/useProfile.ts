"use client";

import { useState, useEffect, useCallback } from "react";
import { useTelegramAuth } from "@/hooks/useTelegramAuth";
import { useRole } from "@/hooks/useRole";
import { supabase } from "@/lib/supabase";
import { PROFILE_CONFIG } from "@/config/pages.config";
import { TABLES } from "@/config/database.config";
import type { User, SocialAccount, Order, Review } from "@/types";

type ProfileItems = SocialAccount[] | Order[];

export function useProfile(profileTelegramId?: string | number) {
  const { dbUser } = useTelegramAuth();
  const { role: currentUserRole } = useRole();
  const [profile, setProfile] = useState<User | null>(null);
  const [items, setItems] = useState<ProfileItems>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const telegramId =
    profileTelegramId != null
      ? typeof profileTelegramId === "string"
        ? Number(profileTelegramId)
        : profileTelegramId
      : dbUser?.telegram_id ?? null;
  const isOwnProfile =
    telegramId != null && dbUser != null && dbUser.telegram_id === telegramId;

  const profileRole = profile?.user_type ?? null;
  const config = isOwnProfile
    ? currentUserRole
      ? PROFILE_CONFIG.myProfile[currentUserRole]
      : null
    : profileRole
      ? PROFILE_CONFIG.publicProfile[profileRole]
      : null;

  const fetchProfile = useCallback(async () => {
    if (telegramId == null) {
      setProfile(null);
      setItems([]);
      setReviews([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from(TABLES.users)
        .select("*")
        .eq("telegram_id", telegramId)
        .maybeSingle();
      if (userError) throw userError;
      setProfile((userData as User) ?? null);

      if (!userData) {
        setLoading(false);
        return;
      }

      const userType = (userData as User).user_type;
      if (userType === "blogger") {
        const { data: socials } = await supabase
          .from(TABLES.social_accounts)
          .select("*")
          .eq("blogger_telegram_id", telegramId)
          .eq("status", "active");
        setItems((socials as SocialAccount[]) ?? []);
      } else {
        const { data: orders } = await supabase
          .from(TABLES.orders)
          .select("*")
          .eq("client_telegram_id", telegramId)
          .eq("status", "active");
        setItems((orders as Order[]) ?? []);
      }

      const { data: reviewsData } = await supabase
        .from(TABLES.reviews)
        .select("*")
        .eq("target_telegram_id", telegramId)
        .order("created_at", { ascending: false });
      setReviews((reviewsData as Review[]) ?? []);
    } catch (err) {
      console.error("useProfile error:", err);
      setProfile(null);
      setItems([]);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [telegramId]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      if (!dbUser || dbUser.telegram_id !== telegramId) return;
      const { error } = await supabase
        .from(TABLES.users)
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("telegram_id", telegramId!);
      if (error) throw error;
      setProfile((prev) => (prev ? { ...prev, ...updates } : null));
    },
    [dbUser, telegramId]
  );

  return {
    profile,
    items,
    reviews,
    loading,
    config,
    isOwnProfile,
    updateProfile,
    refetch: fetchProfile,
  };
}

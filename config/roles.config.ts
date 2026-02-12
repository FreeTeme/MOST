import type { UserType } from "@/types";

export const ROLES: Record<
  UserType,
  {
    canSearchOrders: boolean;
    canApplyToOrders: boolean;
    canCreateOrders: boolean;
    canManageApplications: boolean;
    canAddSocials: boolean;
    canWriteReview: boolean;
  }
> = {
  blogger: {
    canSearchOrders: true,
    canApplyToOrders: true,
    canCreateOrders: false,
    canManageApplications: false,
    canAddSocials: true,
    canWriteReview: true,
  },
  client: {
    canSearchOrders: false,
    canCreateOrders: true,
    canApplyToOrders: false,
    canManageApplications: true,
    canAddSocials: false,
    canWriteReview: true,
  },
};

export const STORAGE_KEYS = {
  session: "influencer_user",
} as const;

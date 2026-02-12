"use client";

import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/config/roles.config";
import type { UserType } from "@/types";

export function useRole() {
  const [role, setRoleState] = useState<UserType | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.session);
      if (!raw) return null;
      const data = JSON.parse(raw) as { user_type?: UserType };
      return data.user_type ?? null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.session);
      if (!raw) {
        setRoleState(null);
        return;
      }
      const data = JSON.parse(raw) as { user_type?: UserType };
      setRoleState(data.user_type ?? null);
    } catch {
      setRoleState(null);
    }
  }, []);

  const setRole = useCallback((newRole: UserType | null) => {
    setRoleState(newRole);
    if (newRole === null) {
      localStorage.removeItem(STORAGE_KEYS.session);
      return;
    }
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.session);
      const data = raw ? JSON.parse(raw) : {};
      localStorage.setItem(
        STORAGE_KEYS.session,
        JSON.stringify({ ...data, user_type: newRole })
      );
    } catch {
      // ignore
    }
  }, []);

  return {
    role,
    isBlogger: role === "blogger",
    isClient: role === "client",
    setRole,
  };
}

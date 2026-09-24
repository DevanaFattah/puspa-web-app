"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getParentProfile,
  ParentProfile,
  ProfileResponse,
} from "@/lib/api/profile";

interface ProfileContextValue {
  profile: ParentProfile | null;
  setProfile: React.Dispatch<React.SetStateAction<ParentProfile | null>>;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<ParentProfile | null>(null);

  // 🔄 Memuat ulang profil
  const refreshProfile = async () => {
    try {
      // Ambil token dari localStorage (pastikan sudah login)
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token tidak ditemukan, redirect ke halaman login");
        setProfile(null);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
        return;
      }

      const res: ProfileResponse | null = await getParentProfile(token);

      if (res?.success && res.data) {
        setProfile(res.data);
      } else {
        console.warn("Gagal memuat profil:", res?.message);
        setProfile(null);
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
      }
    } catch (err) {
      console.error("Error refreshProfile:", err);
      setProfile(null);
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }
  };

  // Load pertama kali
  useEffect(() => {
    refreshProfile();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }
  return context;
}

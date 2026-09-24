"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { User, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { baseMenu } from "@/components/layout/sidebar_terapis";
import { useTherapistProfile } from "@/context/ProfileTerapisContext";
import NotificationPopover from "@/components/layout/NotificationPopover";

interface HeaderTerapisProps {
  pageTitle?: string;
  onOpenSidebar?: () => void;
}

export default function HeaderTerapis({
  pageTitle,
  onOpenSidebar,
}: HeaderTerapisProps) {
  const pathname = usePathname();
  const { profile } = useTherapistProfile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ===============================
  // Cari menu aktif dari sidebar
  // ===============================
  const allItems = baseMenu.flatMap((group) => group.items);

  const activeItem =
    allItems.find(
      (item) =>
        pathname === item.href ||
        pathname.startsWith(item.href + "/") ||
        (item.dropdown &&
          item.dropdown.some((sub) => pathname.startsWith(sub.href))),
    ) || null;

  // ===============================
  // Fallback title berdasarkan path
  // (untuk page detail / riwayat)
  // ===============================
  const getTitleFromPath = (pathname: string): string | null => {
    if (pathname === "/terapis/asessment") return "Assessment - Asesor";
    if (pathname.startsWith("/terapis/asessmentOrtu")) return "Assessment - Orang Tua";
    if (pathname === "/terapis/observasi") return "Jadwal Observasi";
    if (pathname === "/terapis/observasi/riwayat") return "Riwayat Observasi";
    if (pathname.startsWith("/terapis/riwayat/umumRiwayat")) return "Riwayat Asesmen - Umum";
    if (pathname.startsWith("/terapis/riwayat/fisioterapiRiwayat")) return "Riwayat Asesmen - Fisioterapi";
    if (pathname.startsWith("/terapis/riwayat/okupasiRiwayat")) return "Riwayat Asesmen - Okupasi";
    if (pathname.startsWith("/terapis/riwayat/wicaraRiwayat")) return "Riwayat Asesmen - Wicara";
    if (pathname.startsWith("/terapis/riwayat/paedagogRiwayat")) return "Riwayat Asesmen - Paedagog";
    if (pathname.startsWith("/terapis/riwayat-hasil")) return "Observasi";
    if (pathname.startsWith("/terapis/hasil-observasi")) return "Observasi";
    if (pathname.startsWith("/terapis/asessment/wicaraRiwayat")) return "Assessment Wicara";
    if (pathname.startsWith("/terapis/asessment/wicaraAsesment")) return "Assessment Wicara";
    if (pathname.startsWith("/terapis/asessment/paedagogRiwayat")) return "Assessment Paedagog";
    if (pathname.startsWith("/terapis/asessment/paedagogAsesment")) return "Assessment Paedagog";
    if (pathname.startsWith("/terapis/asessment/okupasiRiwayat")) return "Assessment Okupasi";
    if (pathname.startsWith("/terapis/asessment/okupasiAsesment")) return "Assessment Okupasi";
    if (pathname.startsWith("/terapis/asessment/fisioRiwayat")) return "Assessment Fisioterapi";
    if (pathname.startsWith("/terapis/asessment/fisioAsesment")) return "Assessment Fisioterapi";
    if (pathname.startsWith("/terapis/asessment/detailAsesment")) return "Detail Assessment";
    return null;
  };

  const title =
    pageTitle || getTitleFromPath(pathname) || activeItem?.name || "Dashboard";

  // Foto profil
  const profileImage: string | null =
    profile?.profile_picture && profile.profile_picture !== ""
      ? profile.profile_picture
      : null;

  return (
    <header className="w-full flex justify-between items-center px-4 md:px-10 py-4 bg-white/70 backdrop-blur-xl border-b border-teal-50 text-[#1E5C58]">
      {/* Judul halaman */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        {onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 -ml-2 rounded-lg hover:bg-teal-50 text-[#2B7A75] md:hidden transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight truncate max-w-[150px] sm:max-w-none">
              {title}
            </h2>
            <p className="hidden md:block text-xs font-semibold text-gray-400 capitalize">
              Sistem Informasi Holistic Care - Terapis
            </p>
          </div>
        </div>
      </div>

      {/* Area kanan */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Fitur Search Cepat (Styling Only) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-teal-50 shadow-[0_2px_10px_rgba(43,122,117,0.05)] text-gray-400 focus-within:border-[#2B7A75] focus-within:ring-2 focus-within:ring-[#2B7A75]/10 transition-all duration-300">
          <Search className="w-4 h-4 ml-1" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-32 xl:w-48 bg-transparent border-none outline-none text-sm text-gray-600 focus:w-48 xl:focus:w-56 transition-all duration-300"
          />
        </div>

        {/* Notifikasi */}
        <NotificationPopover />

        {/* User Greet & Info */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-100/80">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-[#1E5C58]">
              {mounted ? profile?.therapist_name || "Terapis" : "Terapis"}
            </span>
            <span className="text-xs font-bold text-gray-400 capitalize">
              {mounted ? profile?.role || "Terapis" : "Terapis"}
            </span>
          </div>

          {/* Foto / icon user */}
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#A2E4D3] shadow-md flex items-center justify-center bg-[#F4F9F8]">
            {mounted && profileImage ? (
              <Image
                key={profileImage}
                src={profileImage}
                alt="Foto Profil"
                width={44}
                height={44}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <User className="w-6 h-6 text-[#2B7A75]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
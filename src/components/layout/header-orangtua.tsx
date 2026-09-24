"use client";

import React from "react";
import Image from "next/image";
import { User, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useProfile } from "@/context/ProfileContext";
import NotificationPopover from "@/components/layout/NotificationPopover";

interface HeaderOrangtuaProps {
  onOpenSidebar: () => void;
}

const HeaderOrangtua: React.FC<HeaderOrangtuaProps> = ({ onOpenSidebar }) => {
  const pathname = usePathname();
  const { profile } = useProfile();

  const guardianName = profile?.guardian_name || "Orang Tua";

  const pageTitles: Record<string, string> = {
    "/orangtua/dashboard": "Dashboard",
    "/orangtua/anak": "Data Anak",
    "/orangtua/assessment": "Assessment",
    "/orangtua/assessment/kategori": "Formulir Assessment Orangtua",
    "/orangtua/assessment/kategori/data-umum": "Data Umum",
    "/orangtua/assessment/kategori/data-umumRiwayat": "Riwayat Data Umum",
    "/orangtua/assessment/kategori/fisioterapi": "Data Fisioterapi",
    "/orangtua/assessment/kategori/fisioterapiRiwayat":
      "Riwayat Data Fisioterapi",
    "/orangtua/assessment/kategori/okupasi": "Data Terapi Okupasi",
    "/orangtua/assessment/kategori/okupasiRiwayat":
      "Riwayat Data Terapi Okupasi",
    "/orangtua/assessment/kategori/wicara": "Data Terapi Wicara",
    "/orangtua/assessment/kategori/wicaraRiwayat": "Riwayat Data Terapi Wicara",
    "/orangtua/assessment/kategori/paedagog": "Data Paedagog",
    "/orangtua/assessment/kategori/paedagogRiwayat": "Riwayat Data Paedagog",
    "/orangtua/assessment/riwayat-jawaban": "Riwayat Jawaban",
    "/orangtua/help": "Bantuan",
    "/orangtua/profil": "Profil",
    "/orangtua/ubahPassword": "Ubah Password",
    "/auth/login": "Log Out",
  };

  const title = pageTitles[pathname] || "Dashboard";

  return (
    <header className="w-full flex justify-between items-center px-4 md:px-10 py-4 bg-white/70 backdrop-blur-xl border-b border-teal-50 text-[#1E5C58]">
      {/* Page Title & Mobile Toggle */}
      <div className="flex items-center gap-3">
        {/* Mobile menu toggle */}
        <button
          onClick={onOpenSidebar}
          className="p-2 -ml-2 rounded-lg hover:bg-teal-50 text-[#2B7A75] md:hidden transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight truncate max-w-[150px] sm:max-w-none">
              {title}
            </h2>
            <p className="hidden md:block text-xs font-semibold text-gray-400 capitalize">
              Orang Tua • Sistem Informasi Holistic Care
            </p>
          </div>
        </div>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Search Bar (Styling Only) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-teal-50 shadow-[0_2px_10px_rgba(43,122,117,0.05)] text-gray-400 focus-within:border-[#2B7A75] focus-within:ring-2 focus-within:ring-[#2B7A75]/10 transition-all duration-300">
          <Search className="w-4 h-4 ml-1" />
          <input
            type="text"
            placeholder="Cari..."
            className="w-32 xl:w-48 bg-transparent border-none outline-none text-sm text-gray-600 focus:w-48 xl:focus:w-56 transition-all duration-300"
          />
        </div>

        {/* Notifications */}
        <NotificationPopover />

        {/* User Greet & Info */}
        <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-gray-100/80">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-[#1E5C58]">
              {guardianName}
            </span>
            <span className="text-xs font-bold text-gray-400">Orang Tua</span>
          </div>

          {/* Profile Avatar */}
          <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#A2E4D3] shadow-md flex items-center justify-center bg-[#F4F9F8] shrink-0">
            {profile?.profile_picture ? (
              <Image
                src={profile.profile_picture}
                alt="Avatar"
                width={44}
                height={44}
                className="object-cover w-full h-full"
              />
            ) : (
              <User className="w-6 h-6 text-[#2B7A75]" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderOrangtua;

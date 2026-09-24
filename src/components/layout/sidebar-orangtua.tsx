"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutGrid,
  Baby,
  UserSquare2,
  HelpCircle,
  ChevronRight,
  ChevronDown,
  User,
  Lock,
  LogOut,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebar } from "@/context/SidebarContext";
import { useProfile } from "@/context/ProfileContext";

export const menuOrangtua = [
  {
    name: "Dashboard",
    icon: LayoutGrid,
    path: "/orangtua/dashboard",
  },
  {
    name: "Anak",
    icon: Baby,
    path: "/orangtua/anak",
  },
  {
    name: "Assessment",
    icon: UserSquare2,
    path: "/orangtua/assessment",
  },
  {
    name: "Help",
    icon: HelpCircle,
    path: "/orangtua/help",
  },
];

interface SidebarOrangtuaProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function SidebarOrangtua({ isOpen = false, onClose = () => {} }: SidebarOrangtuaProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [openProfileMenu, setOpenProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { profile } = useProfile();
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1024);
  const { isCollapsed, toggleSidebar } = useSidebar();

  const guardianName = profile?.guardian_name || "User";
  const email = profile?.email || "-";
  const avatar = profile?.profile_picture;

  const handleLogout = () => {
    localStorage.clear();
    router.push("/auth/login");
    setShowLogoutModal(false);
  };

  useEffect(() => {
    setMounted(true);
    setWindowWidth(window.innerWidth);

    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar on path change (mobile)
  useEffect(() => {
    if (windowWidth < 768) {
      onClose();
    }
  }, [pathname, windowWidth]);

  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#1E5C58]/30 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{
          x: mounted && windowWidth < 768 ? (isOpen ? 0 : -300) : 0,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed md:sticky top-0 left-0 h-screen w-64 shrink-0 bg-white/95 backdrop-blur-xl flex flex-col font-medium border-r border-teal-50 shadow-[2px_0_24px_rgba(0,0,0,0.02)] z-50 md:z-40 overflow-y-auto"
      >
        {/* Scrollable Handle Customization */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .sidebar-scroll::-webkit-scrollbar { width: 4px; }
              .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
              .sidebar-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
              .sidebar-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `,
          }}
        />

        {/* Header / Logo */}
        <div className="flex justify-between items-center h-24 shrink-0 px-6 border-b border-gray-100 relative">
          <div className="sidebar-logo-wide">
            <Link
              href="/orangtua/dashboard"
              className="hover:scale-105 transition-transform duration-300"
            >
              <Image
                src="/logo.png"
                alt="Logo Puspa"
                width={120}
                height={32}
                priority
                className="object-contain"
              />
            </Link>
          </div>
          <div className="sidebar-logo-mini hidden w-full justify-center">
            <Image
              src="/favicon.ico"
              alt="Logo"
              width={28}
              height={28}
              priority
              className="object-contain"
            />
          </div>
          <button
            onClick={toggleSidebar}
            className={`text-[#2B7A75] hover:bg-[#2B7A75]/10 p-1.5 rounded-lg transition-colors cursor-pointer ${
              isCollapsed ? "mx-auto" : ""
            }`}
            title={isCollapsed ? "Tampilkan Menu" : "Sembunyikan Menu"}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronRight size={18} className="rotate-180" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2 sidebar-scroll overflow-y-auto px-4 py-8">
          {menuOrangtua.map((item, i) => {
            const active = pathname === item.path || pathname.startsWith(item.path + "/");
            const Icon = item.icon;
            return (
              <Link
                key={i}
                href={item.path}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group
                ${
                  active
                    ? "bg-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                    : "text-gray-600 hover:bg-[#F4F9F8] hover:text-[#2B7A75]"
                }`}
              >
                <div
                  className={`p-1.5 rounded-lg transition-colors duration-300 
                  ${
                    active
                      ? (isCollapsed ? "text-white bg-transparent" : "bg-white/20 text-white")
                      : `text-gray-400 ${isCollapsed ? "group-hover:text-[#2B7A75]" : "group-hover:bg-[#2B7A75]/10 group-hover:text-[#2B7A75]"}`
                  }`}
                >
                  <Icon size={18} strokeWidth={2.5} />
                </div>
                <span className="sidebar-text text-sm font-semibold">
                  {item.name}
                </span>
              </Link>
            );
          })}

          {/* Mobile Only Account Section */}
          <div className="md:hidden pt-4 mt-4 border-t border-gray-100 space-y-1">
            <p className="text-[10px] font-bold tracking-wider uppercase mb-2 px-3 text-[#2B7A75]/60">
              Kelola Akun
            </p>
            <Link
              href="/orangtua/profil"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group
              ${
                pathname === "/orangtua/profil"
                  ? "bg-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                  : "text-gray-600 hover:bg-[#F4F9F8] hover:text-[#2B7A75]"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors duration-300 
                ${
                  pathname === "/orangtua/profil"
                    ? "bg-white/20 text-white"
                    : "text-gray-400 group-hover:bg-[#2B7A75]/10 group-hover:text-[#2B7A75]"
                }`}
              >
                <User size={18} strokeWidth={2.5} />
              </div>
              <span className="sidebar-text text-sm font-semibold">Profil</span>
            </Link>

            <Link
              href="/orangtua/ubahPassword"
              className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group
              ${
                pathname === "/orangtua/ubahPassword"
                  ? "bg-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                  : "text-gray-600 hover:bg-[#F4F9F8] hover:text-[#2B7A75]"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors duration-300 
                ${
                  pathname === "/orangtua/ubahPassword"
                    ? "bg-white/20 text-white"
                    : "text-gray-400 group-hover:bg-[#2B7A75]/10 group-hover:text-[#2B7A75]"
                }`}
              >
                <Lock size={18} strokeWidth={2.5} />
              </div>
              <span className="sidebar-text text-sm font-semibold">Ubah Password</span>
            </Link>

            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 group text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
            >
              <div className="p-1.5 rounded-lg text-gray-400 group-hover:bg-red-100/50 group-hover:text-red-500 transition-colors duration-300">
                <LogOut size={18} strokeWidth={2.5} />
              </div>
              <span className="sidebar-text text-sm font-semibold">Logout</span>
            </button>
          </div>
        </nav>

        {/* Profile Dropdown Section at bottom */}
        <div className="hidden md:block p-4 border-t border-gray-150 mt-auto bg-white/50 backdrop-blur-md relative">
          <div
            className="flex items-center justify-between cursor-pointer p-2 rounded-2xl hover:bg-gray-50 transition-colors"
            onClick={() => setOpenProfileMenu(!openProfileMenu)}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#A2E4D3] shadow-sm flex items-center justify-center bg-[#F4F9F8] shrink-0">
                {avatar ? (
                  <Image
                    src={avatar}
                    alt="Avatar"
                    width={36}
                    height={36}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <User className="w-5 h-5 text-[#2B7A75]" />
                )}
              </div>

              <div className="sidebar-text flex flex-col min-w-0">
                <span className="text-xs font-bold text-[#1E5C58] truncate">
                  {guardianName}
                </span>
                <br />
                <span className="text-[10px] font-semibold text-gray-400 truncate">
                  {email}
                </span>
              </div>
            </div>

            <div className="sidebar-chevron">
              {openProfileMenu ? (
                <ChevronDown size={16} className="text-gray-400 shrink-0" />
              ) : (
                <ChevronRight size={16} className="text-gray-400 shrink-0" />
              )}
            </div>
          </div>

          <AnimatePresence>
            {openProfileMenu && (
              <motion.div
                initial={isCollapsed ? { opacity: 0, scale: 0.95, x: -10 } : { opacity: 0, y: 10 }}
                animate={isCollapsed ? { opacity: 1, scale: 1, x: 0 } : { opacity: 1, y: 0 }}
                exit={isCollapsed ? { opacity: 0, scale: 0.95, x: -10 } : { opacity: 0, y: 10 }}
                className={`space-y-1 p-2 rounded-2xl border border-teal-50 bg-white shadow-xl ${
                  isCollapsed
                    ? "absolute left-full bottom-4 ml-3 min-w-[180px] z-50 shadow-teal-900/5"
                    : "mt-3 bg-gray-50/50"
                }`}
              >
                <Link href="/orangtua/profil">
                  <div className={`flex items-center gap-2.5 text-xs font-bold px-3 py-2.5 rounded-xl transition cursor-pointer ${pathname === "/orangtua/profil" ? "text-white bg-[#2B7A75]" : "text-gray-650 hover:bg-gray-100"}`}>
                    <User size={15} /> Profil
                  </div>
                </Link>
                <Link href="/orangtua/ubahPassword">
                  <div className={`flex items-center gap-2.5 text-xs font-bold px-3 py-2.5 rounded-xl transition cursor-pointer ${pathname === "/orangtua/ubahPassword" ? "text-white bg-[#2B7A75]" : "text-gray-655 hover:bg-gray-100"}`}>
                    <Lock size={15} /> Ubah Password
                  </div>
                </Link>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="w-full flex items-center gap-2.5 text-xs font-bold px-3 py-2.5 rounded-xl cursor-pointer text-red-655 hover:bg-red-50 hover:text-red-700 transition-colors duration-300"
                >
                  <LogOut size={15} /> Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showLogoutModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/20 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl shadow-2xl shadow-teal-900/10 w-full max-w-sm overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-red-100/50 rounded-full scale-125 opacity-20"
                  />
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>

                <h3 className="text-xl font-extrabold text-[#1E5C58] mb-2 tracking-tight">
                  Konfirmasi Logout
                </h3>
                <p className="text-sm text-gray-505 font-medium leading-relaxed mb-8 px-4">
                  Apakah Anda yakin ingin keluar dari sistem? Anda harus login
                  kembali untuk mengakses data.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={handleLogout}
                    className="cursor-pointer w-full py-3.5 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-bold text-sm transition-all shadow-md shadow-red-500/20 active:scale-95"
                  >
                    Ya, Keluar Sekarang
                  </button>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="cursor-pointer w-full py-3.5 bg-gray-50 hover:bg-gray-100 text-gray-750 rounded-2xl font-bold text-sm transition-all border border-gray-100 active:scale-95"
                  >
                    Batal
                  </button>
                </div>
              </div>

              {/* Decorative line */}
              <div className="h-1.5 w-full bg-linear-to-r from-red-500/10 via-red-500 to-red-500/10" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
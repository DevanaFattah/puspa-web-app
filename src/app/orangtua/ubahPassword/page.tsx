"use client";

import { useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { Eye, EyeOff, Lock, ChevronLeft, Save } from "lucide-react";
import { updatePassword } from "@/lib/api/profile";
import Link from "next/link";

export default function PasswordOrangtuaPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      alert("Semua field harus diisi.");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Konfirmasi password tidak cocok.");
      return;
    }

    try {
      setLoading(true);
      const res = await updatePassword({
        current_password: oldPass,
        password: newPass,
        password_confirmation: confirmPass,
      });

      if (res?.success) {
        alert("Password berhasil diubah!");
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        alert(res?.message || "Gagal mengubah password");
      }
    } catch (err) {
      alert("Terjadi kesalahan saat mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-md">
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 mt-4 md:mt-8 text-[#1E5C58]">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-teal-55/10 p-4 rounded-full mb-3 text-[#2B7A75]">
            <Lock className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-[#1E5C58] text-center tracking-tight">
            Ubah Password
          </h2>
          <p className="text-gray-400 text-xs font-semibold text-center mt-1">
            Pastikan password baru Anda kuat dan aman
          </p>
        </div>

        <div className="space-y-5">
          {/* PASSWORD SAAT INI */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
              Password Saat Ini
            </label>
            <div className="relative">
              <input
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                type={showOld ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] outline-none transition-all text-sm font-semibold text-gray-700 bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B7A75] transition-colors p-1 cursor-pointer"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* PASSWORD BARU */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
              Password Baru
            </label>
            <div className="relative">
              <input
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                type={showNew ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] outline-none transition-all text-sm font-semibold text-gray-700 bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B7A75] transition-colors p-1 cursor-pointer"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500 uppercase ml-1 tracking-wider">
              Konfirmasi Password Baru
            </label>
            <div className="relative">
              <input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                type={showConfirm ? "text" : "password"}
                className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] outline-none transition-all text-sm font-semibold text-gray-700 bg-white"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B7A75] transition-colors p-1 cursor-pointer"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* BUTTON GROUP */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-3 pt-5 border-t border-gray-100">
            <Link
              href="/orangtua/profil"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold transition-all w-full sm:w-auto text-xs order-2 sm:order-1 active:scale-95"
            >
              <ChevronLeft size={16} />
              <span>Kembali</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-[#2B7A75] hover:bg-[#1E5C58] text-white font-bold shadow-md shadow-teal-500/10 disabled:opacity-50 transition-all w-full sm:w-auto text-xs order-1 sm:order-2 active:scale-95 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : (
                <>
                  <Save size={16} />
                  <span>Simpan</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
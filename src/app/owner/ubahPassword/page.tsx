/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, KeyRound, ArrowLeft } from "lucide-react";
import { updatePassword } from "@/lib/api/profile";
import { motion } from "framer-motion";

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
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full items-center justify-center p-4">
      <div className="absolute top-0 left-[-10%] w-[40%] h-[40%] bg-[#b8e8db20] rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-[#68b2a010] rounded-full blur-[90px] pointer-events-none z-0" />

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-teal-50 shadow-[0_15px_50px_-15px_rgba(0,0,0,0.05)] relative z-10"
      >
        {/* Top Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-teal-50 border border-teal-100/60 text-[#2B7A75] rounded-2xl flex items-center justify-center mb-3.5 shadow-xs">
            <KeyRound size={26} />
          </div>
          <h2 className="text-xl font-extrabold text-[#1E5C58]">
            Ubah Password Akun
          </h2>
          <p className="text-xs text-gray-400 font-semibold mt-1 max-w-[280px]">
            Perbarui kata sandi Anda secara berkala untuk menjaga keamanan data akses owner.
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-5">
          {/* PASSWORD SAAT INI */}
          <div>
            <label className="text-xs font-bold text-[#1E5C58] uppercase tracking-wider block mb-1.5 px-1">
              Password Saat Ini
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                type={showOld ? "text" : "password"}
                placeholder="Masukkan kata sandi saat ini"
                className="w-full pl-11 pr-11 py-3 bg-gray-50/50 border border-teal-50/80 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none transition-all text-gray-700 font-semibold shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 cursor-pointer p-0.5"
              >
                {showOld ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* PASSWORD BARU */}
          <div>
            <label className="text-xs font-bold text-[#1E5C58] uppercase tracking-wider block mb-1.5 px-1">
              Password Baru
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                type={showNew ? "text" : "password"}
                placeholder="Masukkan kata sandi baru"
                className="w-full pl-11 pr-11 py-3 bg-gray-50/50 border border-teal-50/80 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none transition-all text-gray-700 font-semibold shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 cursor-pointer p-0.5"
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div>
            <label className="text-xs font-bold text-[#1E5C58] uppercase tracking-wider block mb-1.5 px-1">
              Konfirmasi Password
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={18} />
              </span>
              <input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                type={showConfirm ? "text" : "password"}
                placeholder="Ulangi kata sandi baru"
                className="w-full pl-11 pr-11 py-3 bg-gray-50/50 border border-teal-50/80 rounded-2xl text-sm focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none transition-all text-gray-700 font-semibold shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-650 cursor-pointer p-0.5"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Buttons Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-4 border-t border-gray-100/80">
          <a
            href="/owner/dashboard-Owner"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-505 hover:bg-gray-55 text-xs font-bold transition-all shadow-3xs"
          >
            <ArrowLeft size={14} />
            Kembali
          </a>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center px-6 py-2.5 rounded-xl bg-[#1E5C58] hover:bg-[#2B7A75] text-white font-bold text-xs shadow-md shadow-teal-900/10 hover:shadow-teal-900/20 active:translate-y-0.5 transition-all disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

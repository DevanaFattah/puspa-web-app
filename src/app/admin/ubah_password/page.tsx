"use client";

import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  KeyRound,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import api from "@/lib/axios";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function UbahPasswordAdmin() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Custom states for in-page alerts instead of just toasts
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMsg("Harap periksa kembali. Semua kolom wajib diisi.");
      toast.error("Semua field harus diisi.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg("Kata sandi baru dan konfirmasi tidak selaras.");
      toast.error("Konfirmasi password tidak cocok.");
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg("Kata sandi baru terlalu pendek (minimal 6 karakter).");
      toast.error("Password minimal 6 karakter.");
      return;
    }

    try {
      setLoading(true);
      await api.put("/profile/update-password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });

      setSuccessMsg("Keamanan akun Anda berhasil diperbarui!");
      toast.success("Password berhasil diubah!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Gagal mengubah password. Silakan coba lagi.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 bg-transparent transition-all duration-500">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "12px", background: "#333", color: "#fff" },
        }}
      />

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-[#2B7A75]" />
              Pengaturan Keamanan
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-lg">
              Perbarui kata sandi Anda secara berkala untuk menjaga kerahasiaan
              dan keamanan rekam medis pasien.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 overflow-hidden relative"
        >
          {/* Subtle top gradient bar */}
          <div className="h-2 w-full bg-linear-to-r from-[#1E5C58] via-[#2B7A75] to-[#81B7A9]"></div>

          <div className="p-6 sm:p-10 flex flex-col md:flex-row gap-10">
            {/* Left side: Illustration / Info Context */}
            <div className="w-full md:w-1/3 flex flex-col items-center justify-center text-center p-6 bg-[#F4F9F8] rounded-2xl border border-teal-100/50">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6 shadow-xs relative">
                <div className="absolute inset-0 bg-teal-200 rounded-full animate-ping opacity-20"></div>
                <KeyRound className="w-10 h-10 text-[#2B7A75]" />
              </div>
              <h3 className="text-[#1E5C58] font-bold text-lg mb-2">
                Kunci Akses
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Pilih kata sandi yang kuat setidaknya 6 karakter. Kombinasikan
                huruf dan angka.
              </p>
              <div className="w-full h-px bg-teal-200/50 my-2"></div>
              <div className="flex items-center gap-2 text-xs text-teal-700/80 font-medium mt-2">
                <Lock className="w-3.5 h-3.5" /> Enkripsi data terjamin
              </div>
            </div>

            {/* Right side: Form */}
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {errorMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{errorMsg}</span>
                    </div>
                  </motion.div>
                )}
                {successMsg && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6 overflow-hidden"
                  >
                    <div className="bg-teal-50 border border-teal-200 text-[#1E5C58] px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                      <span>{successMsg}</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-6">
                {/* Password Saat Ini */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                    <Lock className="w-4 h-4 text-[#2B7A75]" /> Password Saat
                    Ini
                  </label>
                  <div className="relative group">
                    <input
                      type={showCurrent ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => {
                        setCurrentPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      className="w-full pl-4 pr-12 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/40 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-800 shadow-sm"
                      placeholder="Masukkan sandi lama Anda"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B7A75] p-1 rounded-md hover:bg-teal-50 transition-colors"
                    >
                      {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Password Baru */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                    <KeyRound className="w-4 h-4 text-[#2B7A75]" /> Password
                    Baru
                  </label>
                  <div className="relative group">
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/40 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-800 shadow-sm focus:bg-white"
                      placeholder="Sandi baru (Min. 6 karakter)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B7A75] p-1 rounded-md hover:bg-teal-50 transition-colors"
                    >
                      {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Konfirmasi Password */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-bold text-gray-700 mb-2">
                    <ShieldCheck className="w-4 h-4 text-[#2B7A75]" />{" "}
                    Konfirmasi Password Baru
                  </label>
                  <div className="relative group">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setErrorMsg(null);
                      }}
                      className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/40 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-800 shadow-sm focus:bg-white"
                      placeholder="Ulangi sandi baru di atas"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#2B7A75] p-1 rounded-md hover:bg-teal-50 transition-colors"
                    >
                      {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={
                      loading ||
                      !currentPassword ||
                      !newPassword ||
                      !confirmPassword
                    }
                    className="w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2 min-w-[160px] px-6 py-3 bg-linear-to-r from-[#1E5C58] to-[#2B7A75] text-white font-bold rounded-xl hover:from-[#174845] hover:to-[#22635f] text-sm transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" /> Simpan Kata Sandi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

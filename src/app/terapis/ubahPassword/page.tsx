"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, ArrowLeft, Save } from "lucide-react";
import { updatePassword } from "@/lib/api/profile";
import { handleApiError, showSuccessToast } from "@/lib/api-error";
import Link from "next/link";

export default function PasswordOrangtuaPage() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  const [loading, setLoading] = useState(false);

  // ============================
  //   HANDLE SUBMIT PASSWORD
  // ============================
  const handleSave = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      handleApiError(null, "Semua field harus diisi.");
      return;
    }

    if (newPass !== confirmPass) {
      handleApiError(null, "Konfirmasi password tidak cocok.");
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
        showSuccessToast("Password berhasil diubah!");

        // reset form
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      } else {
        handleApiError(res, "Gagal mengubah password");
      }
    } catch (err) {
      handleApiError(err, "Terjadi kesalahan saat mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-6 text-[#1E5C58] bg-[#F8FBFB] min-h-screen flex justify-center items-start">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.02)] overflow-hidden">
        {/* Accent Banner */}
        <div className="bg-[#EAF4F2]/30 px-6 py-5 border-b border-teal-50 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white border border-teal-50 text-[#81B7A9]">
            <Lock size={18} />
          </div>
          <div>
            <h2 className="text-sm font-extrabold tracking-tight">Keamanan Akun</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mt-0.5">Ubah Password Anda</p>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* PASSWORD SAAT INI */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Password Saat Ini</label>
            <div className="relative">
              <input
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                type={showOld ? "text" : "password"}
                className="w-full pl-3 pr-10 py-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] bg-gray-50/50 transition-all duration-300"
                placeholder="Masukkan password saat ini"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[#2B7A75] transition-colors"
              >
                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* PASSWORD BARU */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Password Baru</label>
            <div className="relative">
              <input
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                type={showNew ? "text" : "password"}
                className="w-full pl-3 pr-10 py-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] bg-gray-50/50 transition-all duration-300"
                placeholder="Masukkan password baru"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[#2B7A75] transition-colors"
              >
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* KONFIRMASI PASSWORD */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-500">Konfirmasi Password Baru</label>
            <div className="relative">
              <input
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                type={showConfirm ? "text" : "password"}
                className="w-full pl-3 pr-10 py-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] bg-gray-50/50 transition-all duration-300"
                placeholder="Konfirmasi password baru"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-[#2B7A75] transition-colors"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-6">
            <Link
              href="/terapis/profileTerapis"
              className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all duration-300 flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Kembali</span>
            </Link>

            <button
              onClick={handleSave}
              disabled={loading}
              className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-bold text-xs transition-all duration-300 flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>Simpan Password</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

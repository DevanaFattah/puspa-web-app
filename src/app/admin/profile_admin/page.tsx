"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import {
  User,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Camera,
  Edit3,
  X,
  Check,
  Activity,
  Award,
} from "lucide-react";
import { updateProfileWithPhoto } from "@/lib/api/ProfileAdmin";
import { useAdminProfile } from "@/context/ProfileAdminContext";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const { profile, refreshProfile } = useAdminProfile();

  const [form, setForm] = useState({
    admin_name: "",
    admin_phone: "",
    email: "",
    admin_birth_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // =====================================
  // LOAD PROFILE
  // =====================================
  useEffect(() => {
    if (!profile) {
      setLoading(true);
      return;
    }

    setForm({
      admin_name: profile.admin_name ?? "",
      admin_phone: profile.admin_phone ?? "",
      email: profile.email ?? "",
      admin_birth_date: profile.admin_birth_date ?? "",
    });

    setPreviewUrl(
      profile.profile_picture && profile.profile_picture !== ""
        ? `${profile.profile_picture}?t=${Date.now()}`
        : null,
    );

    setLoading(false);
  }, [profile, isEditing]);

  // =====================================
  // FORM INPUT
  // =====================================
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setUpdateSuccess(false);
    setUpdateError(null);
  };

  // =====================================
  // FOTO
  // =====================================
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  // =====================================
  // SUBMIT
  // =====================================
  const handleSubmit = async () => {
    if (!profile?.admin_id) {
      setUpdateError("ID admin tidak ditemukan.");
      return;
    }

    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const formData = new FormData();

      formData.append("admin_name", form.admin_name);
      formData.append("admin_phone", form.admin_phone);
      formData.append("email", form.email);
      formData.append("admin_birth_date", form.admin_birth_date);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await updateProfileWithPhoto(profile.admin_id, formData);
      await refreshProfile();

      setSelectedFile(null);
      setUpdateSuccess(true);
      setIsEditing(false);
    } catch (err: any) {
      setUpdateError(err?.message || "Gagal memperbarui profil.");
    } finally {
      setUpdating(false);
    }
  };

  // =====================================
  // LOADING
  // =====================================
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="w-12 h-12 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
        <p className="text-[#2B7A75] font-medium animate-pulse">
          Menyiapkan profil Anda...
        </p>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================
  return (
    <div className="min-h-[calc(100vh-80px)] py-8 px-4 sm:px-6 lg:px-8 bg-transparent transition-all duration-500">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-[#2B7A75]" />
              Profil Administrator
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola informasi pribadi dan data kredensial akun Anda.
            </p>
          </div>
        </div>

        <motion.div layout className="relative">
          {/* BACKGROUND COVER */}
          <div className="h-48 md:h-64 w-full rounded-t-3xl bg-linear-to-r from-[#1E5C58] via-[#2B7A75] to-[#4A8B73] overflow-hidden relative shadow-md">
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 150%, white 0%, transparent 50%), radial-gradient(circle at 80% -50%, white 0%, transparent 50%)",
              }}
            />
            {/* Decorative Elements */}
            <Activity
              className="absolute bottom-4 right-10 w-32 h-32 text-white opacity-5"
              strokeWidth={1}
            />
            <Award className="absolute top-10 right-40 w-16 h-16 text-white opacity-10" />
          </div>

          <div className="bg-white rounded-b-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-t-0 border-teal-50 px-6 sm:px-10 pb-10">
            {/* PROFILE HEAD */}
            <div className="relative flex flex-col sm:flex-row gap-6 sm:gap-8 mb-8">
              {/* Avatar Box */}
              <div className="-mt-16 sm:-mt-20 relative group shrink-0 self-start sm:self-auto ml-2 sm:ml-0">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-4xl bg-white p-2 shadow-xl shrink-0 z-10 relative">
                  <div className="w-full h-full rounded-2xl overflow-hidden bg-teal-50 border border-teal-100 flex items-center justify-center relative">
                    {previewUrl ? (
                      <Image
                        src={previewUrl}
                        alt="Foto Profil"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <User className="w-16 h-16 text-teal-200" />
                    )}

                    {/* Hover Overlay for Edit Mode */}
                    <AnimatePresence>
                      {isEditing && (
                        <motion.label
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          htmlFor="fileInputTrigger"
                          className="cursor-pointer absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-white backdrop-blur-sm transition-all z-20"
                        >
                          <Camera className="w-8 h-8 mb-2 drop-shadow-md" />
                          <span className="text-xs font-bold drop-shadow-md">
                            Ganti Foto
                          </span>
                        </motion.label>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="absolute -bottom-3 -right-3 z-30">
                  <div className="bg-[#1E5C58] text-white text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-lg border-2 border-white flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> STAFF
                  </div>
                </div>

                <input
                  type="file"
                  id="fileInputTrigger"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="flex-1 pb-2 sm:pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 pt-2 sm:pt-6">
                <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tight">
                    {profile?.admin_name || "Nama Admin"}
                  </h2>
                  <p className="text-[#2B7A75] font-semibold mt-1 flex items-center gap-1.5 text-sm">
                    Administrator Sistem
                  </p>
                </div>

                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="cursor-pointer flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-teal-100 text-[#1E5C58] font-bold text-sm rounded-xl hover:bg-[#F4F9F8] hover:border-teal-200 shadow-sm transition-all active:scale-95"
                  >
                    <Edit3 className="w-4 h-4" /> Edit Profil
                  </button>
                )}
              </div>
            </div>

            {/* ALERT BOXES */}
            <AnimatePresence>
              {updateError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 border border-red-100">
                      <X className="w-4 h-4" />
                    </div>
                    {updateError}
                  </div>
                </motion.div>
              )}
              {updateSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="bg-teal-50 border border-teal-200 text-[#1E5C58] px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shrink-0 border border-teal-100">
                      <Check className="w-4 h-4" />
                    </div>
                    Profil Anda berhasil diperbarui dengan rincian terbaru!
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {!isEditing ? (
                /* ================= VIEW MODE ================= */
                <motion.div
                  key="view-mode"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4"
                >
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:border-teal-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                      <User className="w-5 h-5 text-[#2B7A75]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Nama Lengkap
                      </p>
                      <p className="text-gray-800 font-semibold text-base">
                        {profile?.admin_name || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:border-teal-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                      <Mail className="w-5 h-5 text-[#2B7A75]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Email / Kontak
                      </p>
                      <p className="text-gray-800 font-semibold text-base">
                        {profile?.email || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:border-teal-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                      <Phone className="w-5 h-5 text-[#2B7A75]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Nomor Telepon
                      </p>
                      <p className="text-gray-800 font-semibold text-base">
                        {profile?.admin_phone || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-50 border border-gray-100 rounded-2xl p-5 flex items-start gap-4 transition-colors hover:border-teal-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-200 shrink-0 text-gray-400">
                      <Calendar className="w-5 h-5 text-[#2B7A75]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Tanggal Lahir
                      </p>
                      <p className="text-gray-800 font-semibold text-base">
                        {profile?.admin_birth_date || "-"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ================= EDIT MODE ================= */
                <motion.div
                  key="edit-mode"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#F4F9F8] border border-teal-100 rounded-3xl p-6 sm:p-8 mt-4"
                >
                  <div className="mb-6 flex items-center gap-3 border-b border-teal-100 pb-4">
                    <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                      <Edit3 className="w-4 h-4 text-[#1E5C58]" />
                    </div>
                    <h3 className="text-xl font-bold text-[#1E5C58]">
                      Perbarui Data Pribadi
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mb-2">
                        <User className="w-4 h-4 text-gray-400" /> Nama Lengkap
                      </label>
                      <input
                        name="admin_name"
                        value={form.admin_name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/40 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-700 shadow-sm"
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mb-2">
                        <Mail className="w-4 h-4 text-gray-400" /> Alamat Email
                      </label>
                      <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/40 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-700 shadow-sm"
                        placeholder="contoh@puspa.com"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mb-2">
                        <Phone className="w-4 h-4 text-gray-400" /> Nomor
                        Telepon
                      </label>
                      <input
                        name="admin_phone"
                        value={form.admin_phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/40 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-700 shadow-sm"
                        placeholder="0812xxxxxx"
                      />
                    </div>

                    <div>
                      <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" /> Tanggal
                        Lahir
                      </label>
                      <input
                        type="date"
                        name="admin_birth_date"
                        value={form.admin_birth_date}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#81B7A9]/40 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-700 shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-teal-100">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedFile(null);
                        setPreviewUrl(
                          profile?.profile_picture
                            ? `${profile.profile_picture}?t=${Date.now()}`
                            : null,
                        );
                        setUpdateError(null);
                      }}
                      className="cursor-pointer px-6 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 text-sm transition-colors shadow-sm"
                    >
                      Batalkan
                    </button>

                    <button
                      disabled={updating}
                      onClick={handleSubmit}
                      className="cursor-pointer flex items-center justify-center gap-2 min-w-[140px] px-6 py-2.5 bg-[#2B7A75] text-white font-bold rounded-xl hover:bg-[#1E5C58] text-sm transition-all shadow-md shadow-teal-500/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {updating ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Check className="w-4 h-4" /> Simpan Data
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

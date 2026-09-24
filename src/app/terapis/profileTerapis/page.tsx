/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import Image from "next/image";
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  Shield, 
  Briefcase, 
  Camera, 
  Edit3, 
  Save, 
  X,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { updateProfileWithPhoto } from "@/lib/api/ProfileTerapis";
import { useTherapistProfile } from "@/context/ProfileTerapisContext";

export default function ProfilePage() {
  const { profile, refreshProfile } = useTherapistProfile();

  const [form, setForm] = useState({
    therapist_name: "",
    therapist_phone: "",
    email: "",
    therapist_birth_date: "",
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
      therapist_name: profile.therapist_name ?? "",
      therapist_phone: profile.therapist_phone ?? "",
      email: profile.email ?? "",
      therapist_birth_date: profile.therapist_birth_date ?? "",
    });

    setPreviewUrl(
      profile.profile_picture && profile.profile_picture !== ""
        ? `${profile.profile_picture}?t=${Date.now()}`
        : null
    );

    setLoading(false);
  }, [profile]);

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
    if (!profile?.therapist_id) {
      setUpdateError("ID terapis tidak ditemukan.");
      return;
    }

    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(false);

    try {
      const formData = new FormData();

      formData.append("therapist_name", form.therapist_name);
      formData.append("therapist_phone", form.therapist_phone);
      formData.append("email", form.email);
      formData.append("therapist_birth_date", form.therapist_birth_date);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      await updateProfileWithPhoto(profile.therapist_id, formData);
      await refreshProfile();

      setSelectedFile(null);
      setUpdateSuccess(true);
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
      <div className="flex min-h-[60vh] items-center justify-center text-[#1E5C58]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#81B7A9] border-t-transparent"></div>
          <span className="text-sm font-semibold">Memuat Profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 text-[#1E5C58] bg-[#F8FBFB] min-h-screen flex justify-center items-start">
      <div className="w-full max-w-4xl bg-white rounded-3xl border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.02)] overflow-hidden">
        {/* Cover Accent Banner */}
        <div className="h-32 bg-gradient-to-r from-[#1E5C58]/10 via-[#2B7A75]/15 to-[#81B7A9]/10 relative border-b border-teal-50" />

        <div className="p-6 md:p-8 -mt-16 relative">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* COLUMN 1: PHOTO & PROFILE OVERVIEW */}
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative group w-36 h-36 rounded-full overflow-hidden border-4 border-white shadow-md flex items-center justify-center bg-gray-100/80 transition-all duration-300">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Foto Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
                
                {isEditing && (
                  <>
                    <input
                      type="file"
                      id="profileFileInput"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <label
                      htmlFor="profileFileInput"
                      className="absolute inset-0 bg-black/45 backdrop-blur-xs flex flex-col items-center justify-center text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <Camera size={24} className="mb-1" />
                      <span className="text-[10px] font-bold">Ubah Foto</span>
                    </label>
                  </>
                )}
              </div>

              <div>
                <h2 className="text-lg font-extrabold text-[#1E5C58] tracking-tight">
                  {profile?.therapist_name}
                </h2>
                <div className="mt-1.5 flex items-center justify-center gap-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EAF4F2] text-[#2B7A75]">
                    {profile?.role === "asesor" ? "Asesor" : "Terapis"}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-50 text-[#1E5C58] capitalize">
                    {profile?.therapist_section}
                  </span>
                </div>
              </div>
            </div>

            {/* COLUMN 2 & 3: DETAILS / FORM EDIT */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Alert Feedback Messages */}
              {updateSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-bold animate-fadeIn">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Profil berhasil diperbarui!</span>
                </div>
              )}

              {updateError && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-800 text-xs font-bold animate-fadeIn">
                  <AlertCircle size={16} className="text-rose-500 shrink-0" />
                  <span>{updateError}</span>
                </div>
              )}

              {!isEditing ? (
                /* ================= VIEW MODE ================= */
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold tracking-wider uppercase text-gray-400">
                      Detail Profil
                    </h3>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer inline-flex items-center gap-2 bg-[#EAF4F2] hover:bg-[#D5EAE6] text-[#1E5C58] font-bold px-4 py-2 rounded-xl text-xs transition-all duration-300"
                    >
                      <Edit3 size={14} />
                      <span>Ubah Profil</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Item 1 */}
                    <div className="p-4 rounded-2xl border border-teal-50/50 bg-[#F8FBFB]/50 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-teal-50 text-[#81B7A9]">
                        <User size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</p>
                        <p className="text-sm font-bold mt-0.5">{profile?.therapist_name || "-"}</p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="p-4 rounded-2xl border border-teal-50/50 bg-[#F8FBFB]/50 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-teal-50 text-[#81B7A9]">
                        <Calendar size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal Lahir</p>
                        <p className="text-sm font-bold mt-0.5">{profile?.therapist_birth_date || "-"}</p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="p-4 rounded-2xl border border-teal-50/50 bg-[#F8FBFB]/50 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-teal-50 text-[#81B7A9]">
                        <Phone size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nomor Telepon</p>
                        <p className="text-sm font-bold mt-0.5">{profile?.therapist_phone || "-"}</p>
                      </div>
                    </div>

                    {/* Item 4 */}
                    <div className="p-4 rounded-2xl border border-teal-50/50 bg-[#F8FBFB]/50 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-teal-50 text-[#81B7A9]">
                        <Mail size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email</p>
                        <p className="text-sm font-bold mt-0.5 truncate max-w-[200px]">{profile?.email || "-"}</p>
                      </div>
                    </div>

                    {/* Item 5 */}
                    <div className="p-4 rounded-2xl border border-teal-50/50 bg-[#F8FBFB]/50 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-teal-50 text-[#81B7A9]">
                        <Shield size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Role</p>
                        <p className="text-sm font-bold mt-0.5 capitalize">{profile?.role || "-"}</p>
                      </div>
                    </div>

                    {/* Item 6 */}
                    <div className="p-4 rounded-2xl border border-teal-50/50 bg-[#F8FBFB]/50 flex items-start gap-3">
                      <div className="p-2 rounded-xl bg-white border border-teal-50 text-[#81B7A9]">
                        <Briefcase size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bidang Layanan</p>
                        <p className="text-sm font-bold mt-0.5 capitalize">{profile?.therapist_section || "-"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* ================= EDIT MODE ================= */
                <div className="space-y-6">
                  <h3 className="text-sm font-extrabold tracking-wider uppercase text-gray-400">
                    Edit Informasi Pribadi
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nama */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nama Lengkap</label>
                      <input
                        name="therapist_name"
                        value={form.therapist_name}
                        onChange={handleChange}
                        className="w-full p-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] bg-gray-50/50 transition-all duration-300"
                        placeholder="Nama"
                      />
                    </div>

                    {/* Tanggal Lahir */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Tanggal Lahir</label>
                      <input
                        type="date"
                        name="therapist_birth_date"
                        value={form.therapist_birth_date}
                        onChange={handleChange}
                        className="w-full p-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] bg-gray-50/50 transition-all duration-300"
                      />
                    </div>

                    {/* Telepon */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Nomor Telepon</label>
                      <input
                        name="therapist_phone"
                        value={form.therapist_phone}
                        onChange={handleChange}
                        className="w-full p-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] bg-gray-50/50 transition-all duration-300"
                        placeholder="Telepon"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500">Email</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 text-sm font-bold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] bg-gray-50/50 transition-all duration-300"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedFile(null);
                        setPreviewUrl(
                          profile?.profile_picture
                            ? `${profile.profile_picture}?t=${Date.now()}`
                            : null
                        );
                        setUpdateError(null);
                      }}
                      className="cursor-pointer px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all duration-300 flex items-center gap-1.5"
                    >
                      <X size={14} />
                      <span>Batal</span>
                    </button>

                    <button
                      disabled={updating}
                      onClick={async () => {
                        await handleSubmit();
                        setIsEditing(false);
                      }}
                      className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-bold text-xs transition-all duration-300 flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {updating ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Memperbarui...</span>
                        </>
                      ) : (
                        <>
                          <Save size={14} />
                          <span>Simpan Perubahan</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
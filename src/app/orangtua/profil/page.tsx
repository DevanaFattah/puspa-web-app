"use client";

import React, { useEffect, useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentProfile, updateParentProfile } from "@/lib/api/profile";
import { useProfile } from "@/context/ProfileContext";
import { User, Edit3, Camera, Heart, Calendar, Phone, Mail, Briefcase, Shield } from "lucide-react";

export default function ProfileOrangtuaPage() {
  const [isEditing, setIsEditing] = useState(false);
  const [guardianId, setGuardianId] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { refreshProfile } = useProfile();

  interface FormData {
    guardian_name: string;
    guardian_type: string;
    relationship_with_child: string;
    relationship_with_child_detail?: string;
    guardian_birth_date: string;
    guardian_phone: string;
    email: string;
    guardian_occupation: string;
    role: string;
    profile_picture: string | null;
  }

  const [formData, setFormData] = useState<FormData>({
    guardian_name: "",
    guardian_type: "",
    relationship_with_child: "",
    guardian_birth_date: "",
    guardian_phone: "",
    email: "",
    guardian_occupation: "",
    role: "",
    profile_picture: null,
  });

  useEffect(() => {
    async function loadProfile() {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await getParentProfile(token);
      if (res?.success && res.data) {
        const d = res.data;
        setGuardianId(d.guardian_id);

        setFormData({
          guardian_name: d.guardian_name || "",
          guardian_type: d.guardian_type || "",
          relationship_with_child: d.relationship_with_child || "",
          guardian_birth_date: d.guardian_birth_date
            ? d.guardian_birth_date.split("-").reverse().join("-")
            : "",

          guardian_phone: d.guardian_phone || "",
          email: d.email || "",
          guardian_occupation: d.guardian_occupation || "",
          role: d.role || "",
          profile_picture: d.profile_picture || null,
        });
      }
    }
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const formatDateToBE = (date: string) => {
      if (!date) return "";
      const [y, m, d] = date.split("-");
      return `${d}-${m}-${y}`;
    };

    const fd = new FormData();
    if (selectedFile) fd.append("file", selectedFile);

    fd.append("guardian_name", formData.guardian_name);
    fd.append("guardian_type", formData.guardian_type);
    fd.append("relationship_with_child", formData.relationship_with_child);
    fd.append(
      "relationship_with_child_detail",
      formData.relationship_with_child_detail || ""
    );
    fd.append(
      "guardian_birth_date",
      formatDateToBE(formData.guardian_birth_date)
    );

    fd.append("guardian_phone", formData.guardian_phone);
    fd.append("email", formData.email);
    fd.append("guardian_occupation", formData.guardian_occupation);

    const res = await updateParentProfile(guardianId, fd);

    if (res?.success) {
      alert("Profil berhasil diperbarui!");
      setIsEditing(false);

      if (res.data?.profile_picture) {
        setFormData((prev) => ({
          ...prev,
          profile_picture: res.data.profile_picture,
        }));
      }

      refreshProfile();
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-4xl">
      <div className="text-[#1E5C58] space-y-6">
        {!isEditing ? (
          <div className="flex flex-col gap-6">
            
            {/* PROFILE HEADER CARD */}
            <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              {/* Banner */}
              <div className="h-28 sm:h-36 bg-gradient-to-r from-[#1E5C58] via-[#2B7A75] to-[#81B7A9]" />
              
              {/* Avatar & Title Info */}
              <div className="px-6 pb-6 relative flex flex-col items-center text-center sm:text-left sm:items-end sm:flex-row sm:gap-6 -mt-14 sm:-mt-16">
                <div className="relative shrink-0">
                  {formData.profile_picture ? (
                    <img
                      src={formData.profile_picture}
                      className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                      alt="Foto Profil"
                    />
                  ) : (
                    <div className="w-28 h-28 sm:w-32 sm:h-32 bg-teal-50/70 rounded-full flex items-center justify-center border-4 border-white shadow-lg bg-white">
                      <User className="w-12 h-12 sm:w-16 sm:h-16 text-[#2B7A75]" />
                    </div>
                  )}
                </div>
                
                <div className="mt-4 sm:mb-2 flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-extrabold text-[#1E5C58] truncate">
                    {formData.guardian_name}
                  </h2>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1.5">
                    <span className="px-2.5 py-0.5 bg-teal-50 text-[#1E5C58] text-[10px] font-bold rounded-md uppercase tracking-wide border border-teal-100/30">
                      {formData.role || "Orang Tua"}
                    </span>
                    <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-md uppercase tracking-wide border border-gray-100">
                      Wali
                    </span>
                  </div>
                </div>

                <div className="mt-5 sm:mt-0 sm:mb-2 shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-1.5 text-white bg-[#2B7A75] hover:bg-[#1E5C58] transition-all px-5 py-2.5 rounded-xl text-xs font-bold shadow-md shadow-teal-500/10 active:scale-95 cursor-pointer w-full sm:w-auto"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Edit Profil</span>
                  </button>
                </div>
              </div>
            </div>

            {/* PERSONAL DETAILS CARD */}
            <div className="bg-white border border-teal-50 rounded-3xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
              <h3 className="font-extrabold text-[#1E5C58] text-base mb-6 flex items-center gap-2">
                <span className="w-1.5 h-4 bg-[#2B7A75] rounded-full inline-block" />
                Informasi Pribadi
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Detail Item: Nama Lengkap */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FBFB] border border-teal-50/30">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-[#2B7A75]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nama Lengkap</p>
                    <p className="text-sm font-bold text-gray-700 truncate mt-0.5">{formData.guardian_name || "-"}</p>
                  </div>
                </div>

                {/* Detail Item: Hubungan */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FBFB] border border-teal-50/30">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-[#2B7A75]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hubungan</p>
                    <p className="text-sm font-bold text-gray-700 truncate mt-0.5">{formData.relationship_with_child || "-"}</p>
                  </div>
                </div>

                {/* Detail Item: Tanggal Lahir */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FBFB] border border-teal-50/30">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#2B7A75]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tanggal Lahir</p>
                    <p className="text-sm font-bold text-gray-700 truncate mt-0.5">{formData.guardian_birth_date || "-"}</p>
                  </div>
                </div>

                {/* Detail Item: Telepon */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FBFB] border border-teal-50/30">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#2B7A75]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nomor Telepon</p>
                    <p className="text-sm font-bold text-gray-700 truncate mt-0.5">{formData.guardian_phone || "-"}</p>
                  </div>
                </div>

                {/* Detail Item: Email */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FBFB] border border-teal-50/30 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#2B7A75]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Alamat Email</p>
                    <p className="text-sm font-bold text-[#2B7A75] truncate mt-0.5">{formData.email || "-"}</p>
                  </div>
                </div>

                {/* Detail Item: Pekerjaan */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FBFB] border border-teal-50/30">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5 text-[#2B7A75]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pekerjaan</p>
                    <p className="text-sm font-bold text-gray-700 truncate mt-0.5">{formData.guardian_occupation || "-"}</p>
                  </div>
                </div>

                {/* Detail Item: Role */}
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#F8FBFB] border border-teal-50/30">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-[#2B7A75]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">User Role</p>
                    <p className="text-sm font-bold text-gray-700 capitalize truncate mt-0.5">{formData.role || "-"}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : (
          <div className="border border-teal-50 rounded-3xl p-6 sm:p-8 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <h2 className="text-xl font-extrabold text-[#1E5C58] mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-[#2B7A75] rounded-full inline-block" />
              Edit Informasi Pribadi
            </h2>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Foto dan upload */}
              <div className="flex flex-col items-center shrink-0 lg:border-r lg:border-gray-100 lg:pr-8">
                <div className="relative group">
                  {selectedFile ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#2B7A75] shadow-md bg-white"
                      alt="Preview"
                    />
                  ) : formData.profile_picture ? (
                    <img
                      src={formData.profile_picture}
                      className="w-32 h-32 rounded-full object-cover border-4 border-[#2B7A75] shadow-md bg-white"
                      alt="Foto Profil"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-teal-50/50 rounded-full flex items-center justify-center border-4 border-dashed border-teal-200">
                      <User className="w-12 h-12 text-[#2B7A75]" />
                    </div>
                  )}
                  <label className="absolute bottom-1 right-1 bg-[#2B7A75] hover:bg-[#1E5C58] p-2.5 rounded-full text-white cursor-pointer shadow-lg transition-all active:scale-90 border-2 border-white">
                    <Camera className="w-4 h-4" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    />
                  </label>
                </div>
                <p className="mt-4 text-[10px] font-bold text-gray-400 text-center max-w-[150px] uppercase tracking-wide">
                  Ubah Foto Profil
                </p>
              </div>

              {/* Form input */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Lengkap</label>
                  <input
                    name="guardian_name"
                    value={formData.guardian_name}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                    placeholder="Masukkan nama lengkap"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nomor Telepon</label>
                  <input
                    name="guardian_phone"
                    value={formData.guardian_phone}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                    placeholder="Contoh: 0812..."
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Hubungan</label>
                  <input
                    name="relationship_with_child"
                    value={formData.relationship_with_child}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Pekerjaan</label>
                  <input
                    name="guardian_occupation"
                    value={formData.guardian_occupation}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    name="guardian_birth_date"
                    value={formData.guardian_birth_date}
                    onChange={handleChange}
                    className="border border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Button aksi */}
            <div className="flex flex-col sm:flex-row justify-end mt-10 gap-3 border-t border-gray-100 pt-6">
              <button
                onClick={() => setIsEditing(false)}
                className="px-6 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-500 font-bold transition-all w-full sm:w-auto text-xs cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleUpdate}
                className="px-6 py-3 rounded-xl bg-[#2B7A75] hover:bg-[#1E5C58] text-white font-bold shadow-md shadow-teal-500/10 transition-all w-full sm:w-auto text-xs active:scale-95 cursor-pointer"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        )}
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
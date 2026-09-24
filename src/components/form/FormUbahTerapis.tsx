"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  UserCog,
  Edit3,
  X,
  CheckCircle2,
  Stethoscope,
} from "lucide-react";

import { handleApiError } from "@/lib/api-error";

interface FormUbahTerapisProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  }) => void;
  initialData?: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  };
}

const bidangOptions = [
  "Fisioterapi",
  "Okupasi Terapi",
  "Terapi Wicara",
  "Paedagog",
];

export default function FormUbahTerapis({
  open,
  onClose,
  onUpdate,
  initialData,
}: FormUbahTerapisProps) {
  const [formData, setFormData] = useState({
    nama: "",
    bidang: "",
    username: "",
    email: "",
    telepon: "",
  });

  useEffect(() => {
    if (initialData && open) {
      setFormData({
        nama: initialData.nama || "",
        bidang: initialData.bidang || "",
        username: initialData.username || "",
        email: initialData.email || "",
        telepon: initialData.telepon || "",
      });
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.nama ||
      !formData.bidang ||
      !formData.username ||
      !formData.email ||
      !formData.telepon
    ) {
      handleApiError(null, "Semua field wajib diisi!");
      return;
    }

    onUpdate(formData);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-linear-to-br from-amber-500 to-amber-600 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <button
              onClick={onClose}
              className="cursor-pointer absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white shrink-0">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Ubah Data Terapis</h2>
                <div className="text-xs font-semibold text-white/80 mt-1 flex items-center gap-1">
                  <UserCog className="w-3.5 h-3.5" /> @{initialData?.username}
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Input Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  name="nama"
                  value={formData.nama}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm text-gray-700 font-medium focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  required
                />
              </div>
            </div>

            {/* Input Bidang */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Bidang / Spesialisasi
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Stethoscope className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <select
                  name="bidang"
                  value={formData.bidang}
                  onChange={handleChange}
                  className="appearance-none w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm text-gray-700 font-medium focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10 cursor-pointer"
                  required
                >
                  <option value="" disabled>
                    Pilih Bidang Terapis
                  </option>
                  {bidangOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Input Username */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Nama Pengguna
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <UserCog className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm text-gray-700 font-medium focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  required
                />
              </div>
            </div>

            {/* Input Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm text-gray-700 font-medium focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  required
                />
              </div>
            </div>

            {/* Input Telepon */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Telepon
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  type="text"
                  name="telepon"
                  value={formData.telepon}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-sm text-gray-700 font-medium focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10"
                  required
                />
              </div>
            </div>

            {/* Action */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-2">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Simpan Perubahan
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

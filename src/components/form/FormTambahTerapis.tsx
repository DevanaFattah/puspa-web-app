"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  UserCog,
  Stethoscope,
  ShieldPlus,
  X,
  CheckCircle2,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

const bidangOptions = [
  "Fisioterapi",
  "Okupasi Terapi",
  "Terapi Wicara",
  "Paedagog",
];

type FormState = {
  nama: string;
  bidang: string;
  username: string;
  email: string;
  telepon: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function FormTambahTerapis({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (data: FormState) => void;
}) {
  const [formData, setFormData] = useState<FormState>({
    nama: "",
    bidang: "",
    username: "",
    email: "",
    telepon: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ================= VALIDASI =================
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) {
      newErrors.nama = "Nama wajib diisi";
    }

    if (!formData.bidang) {
      newErrors.bidang = "Bidang wajib dipilih";
    }

    if (!formData.username.trim()) {
      newErrors.username = "Nama pengguna wajib diisi";
    } else if (/\s/.test(formData.username)) {
      newErrors.username = "Nama pengguna tidak boleh mengandung spasi";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.telepon.trim()) {
      newErrors.telepon = "Nomor telepon wajib diisi";
    } else if (!/^[0-9]+$/.test(formData.telepon)) {
      newErrors.telepon = "Nomor telepon hanya boleh angka";
    } else if (formData.telepon.length < 8) {
      newErrors.telepon = "Nomor telepon minimal 8 digit";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = "Password harus mengandung 1 huruf kapital";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password = "Password harus mengandung 1 simbol";
    }

    return newErrors;
  };

  // ================= SUBMIT =================
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) return;

    onSave(formData);

    setFormData({
      nama: "",
      bidang: "",
      username: "",
      email: "",
      telepon: "",
      password: "",
    });
    setErrors({});
    setShowPassword(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          {/* Custom Scrollbar for inner content */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .scrollable-body::-webkit-scrollbar { width: 5px; }
            .scrollable-body::-webkit-scrollbar-track { background: transparent; }
            .scrollable-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .scrollable-body::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          `,
            }}
          />

          {/* Header */}
          <div className="bg-linear-to-br from-[#1E5C58] to-[#2B7A75] p-6 text-white relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <button
              onClick={onClose}
              className="cursor-pointer absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white shrink-0">
                <ShieldPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Tambah Data Terapis</h2>
                <div className="text-xs font-semibold text-white/80 mt-1">
                  Registrasi akun terapis atau asesor baru
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto scrollable-body">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User
                      className={`h-5 w-5 transition-colors ${errors.nama ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                    />
                  </div>
                  <input
                    type="text"
                    name="nama"
                    placeholder="Budi Santoso"
                    value={formData.nama}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.nama ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                  />
                </div>
                {errors.nama && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.nama}
                  </p>
                )}
              </div>

              {/* Bidang */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Bidang / Spesialisasi
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Stethoscope
                      className={`h-5 w-5 transition-colors ${errors.bidang ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                    />
                  </div>
                  <select
                    name="bidang"
                    value={formData.bidang}
                    onChange={handleChange}
                    className={`appearance-none cursor-pointer w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.bidang ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                  >
                    <option value="" disabled>
                      Pilih Bidang
                    </option>
                    {bidangOptions.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.bidang && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.bidang}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Nama Pengguna
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <UserCog
                      className={`h-5 w-5 transition-colors ${errors.username ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                    />
                  </div>
                  <input
                    type="text"
                    name="username"
                    placeholder="fisioBudi"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.username ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                  />
                </div>
                {errors.username && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail
                      className={`h-5 w-5 transition-colors ${errors.email ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                    />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="budi@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.email ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Telepon */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Telepon
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone
                      className={`h-5 w-5 transition-colors ${errors.telepon ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                    />
                  </div>
                  <input
                    type="text"
                    name="telepon"
                    placeholder="628956567878980"
                    value={formData.telepon}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.telepon ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                  />
                </div>
                {errors.telepon && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.telepon}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-gray-700 ml-1">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <LockKeyhole
                      className={`h-5 w-5 transition-colors ${errors.password ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                    />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-12 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.password ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 mt-1 font-medium">
                    {errors.password}
                  </p>
                )}
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
                  className="cursor-pointer px-5 py-2.5 rounded-xl bg-[#2B7A75] text-white font-bold hover:bg-[#1E5C58] shadow-md shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Terapis
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

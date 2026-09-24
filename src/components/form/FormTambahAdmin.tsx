"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  UserCog,
  ShieldPlus,
  X,
  CheckCircle2,
  LockKeyhole,
  Eye,
  EyeOff,
} from "lucide-react";

interface FormTambahAdminProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    admin_name: string;
    email: string;
    admin_phone: string;
    username: string;
    password: string;
  }) => void;
}

type FormState = {
  admin_name: string;
  email: string;
  admin_phone: string;
  username: string;
  password: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

export default function FormTambahAdmin({
  open,
  onClose,
  onSave,
}: FormTambahAdminProps) {
  const [form, setForm] = useState<FormState>({
    admin_name: "",
    email: "",
    admin_phone: "",
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  if (!open) return null;

  // ================= VALIDASI =================
  const validate = (): FormErrors => {
    const newErrors: FormErrors = {};

    if (!form.admin_name.trim()) {
      newErrors.admin_name = "Nama lengkap wajib diisi";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!form.admin_phone.trim()) {
      newErrors.admin_phone = "Nomor telepon wajib diisi";
    } else if (!/^[0-9]+$/.test(form.admin_phone)) {
      newErrors.admin_phone = "Nomor telepon hanya boleh angka";
    } else if (form.admin_phone.length < 8) {
      newErrors.admin_phone = "Nomor telepon minimal 8 digit";
    }

    if (!form.username.trim()) {
      newErrors.username = "Nama pengguna wajib diisi";
    } else if (/\s/.test(form.username)) {
      newErrors.username = "Nama pengguna tidak boleh mengandung spasi";
    }

    if (!form.password.trim()) {
      newErrors.password = "Password wajib diisi";
    } else if (form.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    } else if (!/[A-Z]/.test(form.password)) {
      newErrors.password = "Password harus mengandung 1 huruf kapital";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(form.password)) {
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

    onSave(form);

    setForm({
      admin_name: "",
      email: "",
      admin_phone: "",
      username: "",
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
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative max-h-[90vh] overflow-y-auto"
        >
          {/* Custom Scrollbar for inner content */}
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .overflow-y-auto::-webkit-scrollbar { width: 5px; }
            .overflow-y-auto::-webkit-scrollbar-track { background: transparent; }
            .overflow-y-auto::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .overflow-y-auto::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
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
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white">
                <ShieldPlus className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Tambah Data Admin</h2>
                <div className="text-xs font-semibold text-white/80 mt-1">
                  Registrasi akun administrator baru
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Nama Lengkap */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User
                    className={`h-5 w-5 transition-colors ${errors.admin_name ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Budi Santoso"
                  value={form.admin_name}
                  onChange={(e) =>
                    setForm({ ...form, admin_name: e.target.value })
                  }
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.admin_name ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                />
              </div>
              {errors.admin_name && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.admin_name}
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
                  placeholder="budi@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                    className={`h-5 w-5 transition-colors ${errors.admin_phone ? "text-red-400" : "text-gray-400 group-focus-within:text-[#2B7A75]"}`}
                  />
                </div>
                <input
                  type="text"
                  placeholder="08123456789"
                  value={form.admin_phone}
                  onChange={(e) =>
                    setForm({ ...form, admin_phone: e.target.value })
                  }
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.admin_phone ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                />
              </div>
              {errors.admin_phone && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.admin_phone}
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
                  placeholder="adminBudi"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-xl outline-none transition-all text-sm text-gray-700 font-medium ${errors.username ? "border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10"}`}
                />
              </div>
              {errors.username && (
                <p className="text-xs text-red-500 mt-1 font-medium">
                  {errors.username}
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
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
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
                Simpan Admin
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

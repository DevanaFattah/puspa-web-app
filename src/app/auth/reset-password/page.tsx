/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, LockKeyhole, ArrowLeft, Home, CheckCircle2 } from "lucide-react";
import { resetPassword } from "@/lib/api/resetpassword";

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-teal-800 bg-teal-50/20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-[#2B7A75] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-semibold">Memuat halaman...</span>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    const t = searchParams.get("token") || "";
    const e = searchParams.get("email") || "";
    setToken(t);
    setEmail(e);
  }, [searchParams]);

  if (!mounted) {
    return null;
  }

  const validations = [
    { text: "Minimal 8 karakter", valid: password.length >= 8 },
    { text: "Terdapat huruf kapital", valid: /[A-Z]/.test(password) },
    { text: "Terdapat angka", valid: /\d/.test(password) },
    { text: "Terdapat simbol (!@#%&)", valid: /[!@#%&]/.test(password) },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!password || !confirm) {
      setError("Password dan konfirmasi wajib diisi.");
      return;
    }
    if (password !== confirm) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        token,
        email,
        password,
        password_confirmation: confirm,
      });

      if (res.success) {
        setSuccessMsg(res.message || "Password berhasil diubah.");
        setTimeout(() => {
          router.push("/auth/berhasil_ubah_password");
        }, 1500);
      }
    } catch (err: any) {
      setError(err.message || "Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row overflow-hidden selection:bg-[#2B7A75] selection:text-white">
      {/* Left Side - Visual & Branding */}
      <div className="w-full md:w-5/12 bg-linear-to-br from-[#1E5C58] to-[#2B7A75] p-8 md:p-12 text-white relative hidden md:flex flex-col justify-between overflow-hidden min-h-screen">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0d3633]/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10">
          <Link
            href="/"
            className="bg-white p-2.5 rounded-xl inline-block mb-10 shadow-lg hover:scale-105 transition-transform"
          >
            <Image
              src="/logo.png"
              alt="Logo Puspa"
              width={120}
              height={35}
              className="w-auto h-6 lg:h-8 object-contain"
            />
          </Link>
        </div>

        <div className="relative z-10 my-auto">
          <div className="w-14 h-14 bg-[#A2E4D3]/20 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/10">
            <LockKeyhole className="w-8 h-8 text-[#A2E4D3]" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Reset Sandi
          </h1>
          <p className="text-teal-50 text-sm lg:text-base leading-relaxed opacity-90 max-w-sm">
            Buatlah kata sandi baru yang aman dan mudah Anda ingat agar dapat mengakses akun Anda kembali.
          </p>
        </div>

        <div className="relative z-10 text-xs text-teal-100/50 mt-auto">
          &copy; {new Date().getFullYear()} Puspa. Semua Hak Dilindungi.
        </div>
      </div>

      {/* Right Side - Reset Password Form */}
      <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 xl:p-24 bg-white relative flex flex-col justify-center min-h-screen overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          {/* Back links section */}
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#2B7A75] transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-[#2B7A75] transition-colors" />
              <span>Kembali ke Halaman Masuk</span>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#2B7A75] transition-colors group"
            >
              <Home className="w-4 h-4 text-gray-400 group-hover:text-[#2B7A75] transition-colors" />
              <span>Beranda</span>
            </Link>
          </div>

          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-8">
            <Link
              href="/"
              className="bg-gray-50 p-3 rounded-2xl border border-gray-100 shadow-sm"
            >
              <Image
                src="/logo.png"
                alt="Logo Puspa"
                width={140}
                height={40}
                className="w-auto h-8 object-contain"
              />
            </Link>
          </div>

          <div className="mb-10 text-center md:text-left">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1E5C58] mb-2">
              Atur Kata Sandi Baru
            </h2>
            <p className="text-gray-500 text-sm">
              Silakan ketikkan kata sandi baru Anda di bawah ini.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Kata Sandi Baru
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Masukkan kata sandi baru"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-gray-700 font-medium focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center text-gray-400 hover:text-gray-650 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>

              {/* Password strength checker panel */}
              <div className="bg-[#F4F9F8] p-4 rounded-xl border border-teal-100/60 mt-2">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {validations.map((rule, index) => (
                    <li key={index} className="flex items-center gap-2 text-xs">
                      <CheckCircle2
                        className={`w-4 h-4 transition-colors ${
                          rule.valid ? "text-[#2B7A75]" : "text-gray-300"
                        }`}
                      />
                      <span className={rule.valid ? "text-teal-900 font-medium" : "text-gray-500"}>
                        {rule.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Konfirmasi kata sandi baru"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-gray-700 font-medium focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300`}
                  value={confirm}
                  onChange={(e) => {
                    setConfirm(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center text-gray-400 hover:text-gray-650 transition-colors"
                >
                  {showConfirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Notification Messages */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-red-50 border border-red-100 rounded-xl p-3.5 flex items-center gap-3 text-red-650"
                >
                  <span className="text-xs font-semibold">{error}</span>
                </motion.div>
              )}
              {successMsg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-teal-50 border border-teal-100 rounded-xl p-3.5 flex items-center gap-3 text-teal-800"
                >
                  <span className="text-xs font-semibold">{successMsg}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#2B7A75] hover:bg-[#1E5C58] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-teal-700/10 hover:shadow-teal-700/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Simpan Kata Sandi</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
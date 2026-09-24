/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, KeyRound, Home } from "lucide-react";
import { forgotPassword } from "@/lib/api/forgotpassword";

export default function LupaPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Email wajib diisi.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword({ email });

      if (res.success) {
        router.push(
          `/auth/timer_lupa_password?email=${encodeURIComponent(email)}&type=reset`
        );
      } else {
        setError(res.message || "Gagal mengirim email.");
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat mengirim email.");
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
            <KeyRound className="w-8 h-8 text-[#A2E4D3]" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Lupa Kata Sandi?
          </h1>
          <p className="text-teal-50 text-sm lg:text-base leading-relaxed opacity-90 max-w-sm">
            Jangan khawatir! Masukkan alamat email Anda, dan kami akan mengirimkan instruksi untuk menyetel ulang kata sandi Anda.
          </p>
        </div>

        <div className="relative z-10 text-xs text-teal-100/50 mt-auto">
          &copy; {new Date().getFullYear()} Puspa. Semua Hak Dilindungi.
        </div>
      </div>

      {/* Right Side - Forgot Password Form */}
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
              Pulihkan Akun Anda
            </h2>
            <p className="text-gray-500 text-sm">
              Kami akan mengirimkan email dengan tautan untuk mereset kata sandi Anda.
            </p>
          </div>

          <form onSubmit={handleSendEmail} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Alamat Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type="email"
                  placeholder="Masukkan alamat email terdaftar"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-gray-700 font-medium focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300`}
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError("");
                  }}
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence>
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
            </AnimatePresence>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || email.trim() === ""}
              className={`w-full bg-[#2B7A75] hover:bg-[#1E5C58] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-teal-700/10 hover:shadow-teal-700/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Kirim Link Reset Password</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

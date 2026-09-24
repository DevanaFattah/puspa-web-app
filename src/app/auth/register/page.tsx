"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  UserSquare2,
  LockKeyhole,
  Mail,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HeartPulse,
  Sparkles,
  Home,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/lib/api/register";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const isFilled = email && username && password;

  const validations = [
    { text: "Minimal 8 karakter", valid: password.length >= 8 },
    { text: "Huruf kapital (A-Z)", valid: /[A-Z]/.test(password) },
    { text: "Memuat angka (0-9)", valid: /\d/.test(password) },
    {
      text: "Simbol spesial (contoh: !@#$%)",
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const validateEmail = (value: string) => {
    if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailError("Format email tidak valid");
    } else {
      setEmailError(null);
    }
    setEmail(value);
  };

  const validateUsername = (value: string) => {
    if (!value) {
      setUsernameError("Nama pengguna tidak boleh kosong");
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      setUsernameError("Hanya huruf, angka, dan garis bawah (_)");
    } else {
      setUsernameError(null);
    }
    setUsername(value);
  };

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      const userId = data?.user_id;
      if (userId) {
        router.push(
          `/auth/timer_verif_email?user_id=${encodeURIComponent(userId)}`,
        );
      } else {
        router.push(
          `/auth/timer_verif_email?email=${encodeURIComponent(email)}&type=register`,
        );
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      setServerError(error.message || "Terjadi kesalahan saat pendaftaran");
    },
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!isFilled || emailError || usernameError) return;
    if (!validations.every((rule) => rule.valid)) return;

    // simpan email untuk halaman verifikasi
    localStorage.setItem("registered_email", email);

    mutation.mutate({ username, email, password });
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

        <div className="relative z-10 flex flex-col gap-6 mt-auto pb-4">
          <div>
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
              Bergabung <br />
              <span className="text-[#A2E4D3]">Bersama Kami</span>
            </h1>
            <p className="text-teal-50 text-sm lg:text-base leading-relaxed opacity-90 max-w-sm">
              Buat akun sekarang untuk mendapatkan akses ke seluruh layanan
              terapi, jadwal observasi, dan riwayat perkembangan buah hati
              Anda.
            </p>
          </div>

          <div className="space-y-4 pt-6 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="bg-[#A2E4D3]/20 p-2.5 rounded-xl">
                <HeartPulse className="w-5 h-5 text-[#A2E4D3]" />
              </div>
              <div>
                <h3 className="font-semibold text-base">
                  Pendekatan Holistik
                </h3>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-[#A2E4D3]/20 p-2.5 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#A2E4D3]" />
              </div>
              <div>
                <h3 className="font-semibold text-base">
                  Terapis Profesional
                </h3>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-teal-100/50 mt-4">
          &copy; {new Date().getFullYear()} Puspa. Semua Hak Dilindungi.
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-14 bg-white relative flex flex-col justify-center min-h-screen overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#2B7A75] transition-colors mb-6 group w-fit"
          >
            <Home className="w-4 h-4 text-gray-400 group-hover:text-[#2B7A75] transition-colors" />
            <span>Kembali ke Beranda</span>
          </Link>

          {/* Mobile Logo */}
          <div className="md:hidden flex justify-center mb-6">
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

          <div className="mb-8 text-center md:text-left">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1E5C58] mb-2">
              Pendaftaran Baru
            </h2>
            <p className="text-gray-500 text-sm">
              Lengkapi form singkat di bawah ini untuk memulai.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Alamat Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Alamat Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => validateEmail(e.target.value)}
                  required
                  placeholder="nama@email.com"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all text-gray-700
                    ${emailError ? "border-red-305 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300"}`}
                />
              </div>
              {emailError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-xs mt-1 ml-1 font-medium"
                >
                  {emailError}
                </motion.p>
              )}
            </div>

            {/* Nama Pengguna */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Nama Pengguna (Username)
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserSquare2 className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => validateUsername(e.target.value)}
                  required
                  placeholder="Pilih nama pengguna"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-50 border rounded-xl outline-none transition-all text-gray-700
                    ${usernameError ? "border-red-305 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300"}`}
                />
              </div>
              {usernameError && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-xs mt-1 ml-1 font-medium"
                >
                  {usernameError}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Kata Sandi Baru
              </label>
              <div className="relative group mb-3">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Buat kata sandi kuat"
                  className="w-full pl-12 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none transition-all text-gray-700 font-medium focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Password validatiors UI */}
              <div className="bg-[#F4F9F8] p-4 rounded-xl border border-teal-100/60 mt-2">
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
                  {validations.map((rule, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle2
                        className={`w-4 h-4 transition-colors duration-300 ${rule.valid ? "text-[#2B7A75]" : "text-gray-300"}`}
                      />
                      <span
                        className={`text-xs font-medium transition-colors duration-300 ${rule.valid ? "text-[#1E5C58]" : "text-gray-555"}`}
                      >
                        {rule.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* General Error */}
            <AnimatePresence>
              {serverError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 mt-4"
                >
                  <div className="mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-red-606 text-sm font-medium leading-tight">
                    {serverError}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Register Button */}
            <div className="pt-4">
              <motion.button
                whileHover={
                  isFilled &&
                  !mutation.isPending &&
                  !emailError &&
                  !usernameError &&
                  validations.every((r) => r.valid)
                    ? { scale: 1.01 }
                    : {}
                }
                whileTap={
                  isFilled &&
                  !mutation.isPending &&
                  !emailError &&
                  !usernameError &&
                  validations.every((r) => r.valid)
                    ? { scale: 0.98 }
                    : {}
                }
                type="submit"
                disabled={
                  !isFilled ||
                  mutation.isPending ||
                  !!emailError ||
                  !!usernameError ||
                  !validations.every((rule) => rule.valid)
                }
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all duration-300 ${
                  isFilled &&
                  !mutation.isPending &&
                  !emailError &&
                  !usernameError &&
                  validations.every((r) => r.valid)
                    ? "bg-[#2B7A75] text-white hover:bg-[#1E5C58] shadow-lg shadow-teal-500/30 cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
              >
                {mutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    <span>Mendaftarkan...</span>
                  </div>
                ) : (
                  <>
                    Buat Akun Sekarang
                    <ArrowRight
                      className={`w-5 h-5 ${isFilled && !emailError && !usernameError && validations.every((r) => r.valid) ? "opacity-100" : "opacity-0"} transition-opacity`}
                    />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center pb-2">
            <p className="text-gray-505 text-sm">
              Sudah punya akun?{" "}
              <Link
                href="/auth/login"
                className="text-[#2B7A75] font-bold hover:text-[#1E5C58] hover:underline underline-offset-4 transition-all"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

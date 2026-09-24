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
  ArrowRight,
  ShieldCheck,
  Home,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { login, LoginPayload, LoginErrorResponse } from "@/lib/api/login";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldError, setFieldError] = useState<LoginErrorResponse>({});

  const isFilled = identifier.trim() !== "" && password.trim() !== "";

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),
    onSuccess: (data) => {
      localStorage.setItem("user", JSON.stringify(data));

      switch (data.role) {
        case "admin":
          router.push("/admin/dashboard");
          break;
        case "owner":
          router.push("/owner/dashboard-Owner");
          break;
        case "terapis":
        case "asesor":
          router.push("/terapis/dashboard");
          break;
        case "orangtua":
        case "user":
          router.push("/orangtua/dashboard");
          break;
        default:
          router.push("/");
      }
    },
    onError: (error: LoginErrorResponse) => {
      setFieldError(error);
    },
  });

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldError({});
    loginMutation.mutate({ identifier, password });
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
            <ShieldCheck className="w-8 h-8 text-[#A2E4D3]" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Selamat
            <br />
            <span className="text-[#A2E4D3]">Datang Kembali!</span>
          </h1>
          <p className="text-teal-50 text-sm lg:text-base leading-relaxed opacity-90 max-w-sm">
            Masuk untuk melanjutkan perjalanan tumbuh kembang dan melihat
            progres laporan anak dengan aman.
          </p>
        </div>

        <div className="relative z-10 text-xs text-teal-100/50 mt-auto">
          &copy; {new Date().getFullYear()} Puspa. Semua Hak Dilindungi.
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 xl:p-24 bg-white relative flex flex-col justify-center min-h-screen overflow-y-auto">
        <div className="max-w-md mx-auto w-full">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-500 hover:text-[#2B7A75] transition-colors mb-8 group w-fit"
          >
            <Home className="w-4 h-4 text-gray-400 group-hover:text-[#2B7A75] transition-colors" />
            <span>Kembali ke Beranda</span>
          </Link>

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
              Masuk ke Akun
            </h2>
            <p className="text-gray-500 text-sm">
              Silakan masukkan kredensial Anda untuk mengakses dasbor.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username / Email */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">
                Username atau Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <UserSquare2 className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                  placeholder="Masukkan username atau email"
                  className={`w-full pl-12 pr-4 py-3.5 bg-gray-55 border rounded-xl outline-none transition-all text-gray-700
                    ${fieldError.identifier ? "border-red-305 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300"}`}
                />
              </div>
              {fieldError.identifier && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-500 text-xs mt-1.5 ml-1 font-medium"
                >
                  {fieldError.identifier[0]}
                </motion.p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-sm font-semibold text-gray-700">
                  Kata Sandi
                </label>
                <Link
                  href="/auth/lupa_password"
                  className="text-xs font-semibold text-[#2B7A75] hover:text-[#1E5C58] transition-colors"
                >
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockKeyhole className="h-5 w-5 text-gray-400 group-focus-within:text-[#2B7A75] transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Masukkan kata sandi"
                  className={`w-full pl-12 pr-12 py-3.5 bg-gray-55 border rounded-xl outline-none transition-all text-gray-700 font-medium
                    ${fieldError.password ? "border-red-305 focus:border-red-500 focus:ring-4 focus:ring-red-500/10" : "border-gray-200 focus:border-[#2B7A75] focus:bg-white focus:ring-4 focus:ring-[#2B7A75]/10 hover:border-gray-300"}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center text-gray-400 hover:text-gray-605 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {fieldError.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="text-red-505 text-xs mt-1.5 ml-1 font-medium"
                >
                  {fieldError.password[0]}
                </motion.p>
              )}
            </div>

            {/* General Error */}
            <AnimatePresence>
              {fieldError.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3"
                >
                  <div className="mt-0.5">
                    <ShieldCheck className="w-4 h-4 text-red-500" />
                  </div>
                  <p className="text-red-606 text-sm font-medium leading-tight">
                    {fieldError.general}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Login Button */}
            <div className="pt-2">
              <motion.button
                whileHover={
                  isFilled && !loginMutation.isPending ? { scale: 1.01 } : {}
                }
                whileTap={
                  isFilled && !loginMutation.isPending ? { scale: 0.98 } : {}
                }
                type="submit"
                disabled={loginMutation.isPending || !isFilled}
                className={`w-full py-4 rounded-xl flex items-center justify-center gap-2 font-bold text-base transition-all duration-300 ${
                  isFilled && !loginMutation.isPending
                    ? "bg-[#2B7A75] text-white hover:bg-[#1E5C58] shadow-lg shadow-teal-500/30 cursor-pointer"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                }`}
              >
                {loginMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                    <span>Memverifikasi...</span>
                  </div>
                ) : (
                  <>
                    Masuk ke Akun
                    <ArrowRight
                      className={`w-5 h-5 ${isFilled ? "opacity-100" : "opacity-0"} transition-opacity`}
                    />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Register Link */}
          <div className="mt-10 text-center">
            <p className="text-gray-500 text-sm">
              Belum memiliki akun?{" "}
              <Link
                href="/auth/register"
                className="text-[#2B7A75] font-bold hover:text-[#1E5C58] hover:underline underline-offset-4 transition-all"
              >
                Daftar Sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, ArrowLeft, ShieldAlert, Home } from "lucide-react";
import { resendVerification } from "@/lib/api/resendVerification";

export default function TimerVerifEmailPage() {
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
      <TimerVerifEmailContent />
    </Suspense>
  );
}

function TimerVerifEmailContent() {
  const [isClient, setIsClient] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const userId = searchParams.get("user_id");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const storedEmail = localStorage.getItem("registered_email");
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  useEffect(() => {
    if (!isClient || !userId) return;

    const sendFirstEmail = async () => {
      setLoading(true);
      setMsg("");
      setError("");

      try {
        const res = await resendVerification(userId);
        if (res?.success) {
          setMsg("Email verifikasi telah dikirim!");
        } else {
          setError(res?.message || "Gagal mengirim email.");
        }
      } catch {
        setError("Terjadi kesalahan koneksi.");
      } finally {
        setLoading(false);
      }
    };

    sendFirstEmail();
  }, [isClient, userId]);

  useEffect(() => {
    if (!isClient) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      setCanResend(false);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft, isClient]);

  if (!isClient) return null;

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
            <MailCheck className="w-8 h-8 text-[#A2E4D3]" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight mb-4">
            Verifikasi Email
          </h1>
          <p className="text-teal-50 text-sm lg:text-base leading-relaxed opacity-90 max-w-sm">
            Satu langkah lagi untuk mengaktifkan akun Anda. Periksa kotak masuk email Anda dan klik link verifikasi.
          </p>
        </div>

        <div className="relative z-10 text-xs text-teal-100/50 mt-auto">
          &copy; {new Date().getFullYear()} Puspa. Semua Hak Dilindungi.
        </div>
      </div>

      {/* Right Side - Verification Form */}
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
              Verifikasi Akun Anda
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Kami telah mengirimkan email verifikasi ke: <br />
              <span className="font-bold text-[#1E5C58] break-all">{email ?? "email Anda"}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-[#F4F9F8] p-5 rounded-xl border border-teal-100/60 text-center">
              {!canResend ? (
                <p className="text-gray-600 text-sm">
                  Tidak menerima email? Tunggu{" "}
                  <span className="text-[#EDB720] font-bold">{timeLeft} detik</span> sebelum mengirim ulang.
                </p>
              ) : (
                <p className="text-[#2B7A75] text-sm font-semibold">
                  Anda sekarang dapat meminta pengiriman ulang link verifikasi.
                </p>
              )}
            </div>

            {/* Notification Messages */}
            <AnimatePresence mode="wait">
              {msg && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-teal-50 border border-teal-100 rounded-xl p-3.5 flex items-center gap-3 text-teal-800"
                >
                  <span className="text-xs font-semibold">{msg}</span>
                </motion.div>
              )}
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

            {/* Resend Button */}
            <button
              onClick={async () => {
                if (!userId) return setError("User ID tidak ditemukan.");

                setLoading(true);
                setMsg("");
                setError("");

                try {
                  const res = await resendVerification(userId);
                  if (res?.success) {
                    setMsg("Email verifikasi telah dikirim ulang!");
                    setTimeLeft(60);
                  } else {
                    setError(res?.message || "Gagal mengirim ulang email.");
                  }
                } catch {
                  setError("Terjadi kesalahan koneksi.");
                } finally {
                  setLoading(false);
                }
              }}
              disabled={!canResend || loading}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-md active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                ${
                  canResend
                    ? "bg-[#2B7A75] hover:bg-[#1E5C58] text-white shadow-teal-700/10 hover:shadow-teal-700/20"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none"
                }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span>Kirim Ulang Link Verifikasi</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
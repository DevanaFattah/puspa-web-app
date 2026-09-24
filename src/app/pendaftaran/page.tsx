/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, LogIn, Home } from "lucide-react";

export default function TerimakasihPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#1E5C58] via-[#246D68] to-[#123C39] text-white flex flex-col justify-between relative">
      {/* Background Decorator Container to prevent vertical overflow and scrolling bugs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-teal-400/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-15%] left-[-10%] w-[600px] h-[600px] bg-[#A2E4D3]/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="bg-transparent backdrop-blur-xs flex items-center justify-between px-6 sm:px-12 py-4 sm:py-5 border-b border-white/10 w-full relative z-20">
        <div className="bg-white px-2.5 py-1.5 rounded-xl shadow-md border border-white/20">
          <Image
            src="/logo.png"
            alt="Logo Puspa"
            width={110}
            height={33}
            priority
            className="w-auto h-6 sm:h-7"
          />
        </div>
        <button
          onClick={() => router.push("/auth/login")}
          className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/25 rounded-xl text-white font-bold text-xs transition-all active:scale-95 shadow-sm"
        >
          <LogIn className="w-4 h-4" />
          <span>Masuk</span>
        </button>
      </header>

      {/* Content Area - Full Screen Layout */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 sm:py-16 relative z-10 max-w-4xl mx-auto text-center w-full">
        {/* Glowing Success Icon */}
        <div className="relative flex justify-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center relative z-10"
          >
            <CheckCircle2 className="w-12 h-12 sm:w-14 sm:h-14 text-[#A2E4D3]" strokeWidth={2} />
          </motion.div>
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-40 sm:h-40 bg-teal-400/15 rounded-full animate-pulse pointer-events-none" />
        </div>

        {/* Text Details */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="font-extrabold text-2xl sm:text-4xl md:text-5xl text-white mb-3 sm:mb-5 tracking-tight leading-tight"
        >
          Pendaftaran Berhasil Dikirim!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-teal-150/90 text-xs sm:text-base md:text-lg max-w-2xl mx-auto mb-6 sm:mb-12 leading-relaxed"
        >
          Terima kasih telah mempercayakan tumbuh kembang buah hati Anda bersama kami. Data Anda telah aman tersimpan di sistem kami.
        </motion.p>

        {/* Steps cards (transparent, full-bleed screen design) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full mb-6 sm:mb-12 text-left"
        >
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#A2E4D3]/20 flex items-center justify-center mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-[#A2E4D3] border border-[#A2E4D3]/20">
              1
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1 sm:mb-2">Peninjauan Data</h4>
            <p className="text-[11px] sm:text-xs text-teal-100/70 leading-relaxed font-medium">
              Tim administrasi kami sedang meninjau keluhan utama dan mencocokkan pilihan layanan terbaik untuk ananda.
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 sm:p-6 hover:bg-white/10 transition-all duration-300">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#A2E4D3]/20 flex items-center justify-center mb-3 sm:mb-4 text-xs sm:text-sm font-bold text-[#A2E4D3] border border-[#A2E4D3]/20">
              2
            </div>
            <h4 className="text-xs sm:text-sm font-bold text-white mb-1 sm:mb-2">Konfirmasi Jadwal</h4>
            <p className="text-[11px] sm:text-xs text-teal-100/70 leading-relaxed font-medium">
              Admin akan menghubungi Anda via WhatsApp dalam waktu maksimal 1x24 jam kerja untuk penjadwalan observasi.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full max-w-md mx-auto"
        >
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer w-full sm:flex-1 py-3 px-6 rounded-xl bg-white hover:bg-teal-50 text-[#1E5C58] font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-lg shadow-white/5 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </button>
          
          <button
            onClick={() => router.push("/auth/login")}
            className="cursor-pointer w-full sm:flex-1 py-3 px-6 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 text-white font-bold text-sm sm:text-xs transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Masuk Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-white/10 relative z-20 bg-[#123C39]/40 backdrop-blur-md">
        <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
          Puspa Holistic Integrative Care © 2026
        </p>
      </footer>
    </main>
  );
}
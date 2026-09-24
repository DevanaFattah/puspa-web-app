"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, ArrowRight, Home } from "lucide-react";

export default function EmailVerifedPage() {
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
            Akun Siap Digunakan!
          </h1>
          <p className="text-teal-50 text-sm lg:text-base leading-relaxed opacity-90 max-w-sm">
            Email Anda telah berhasil diverifikasi. Sekarang Anda dapat mengakses dasbor Puspa untuk melihat progress tumbuh kembang anak Anda secara langsung.
          </p>
        </div>

        <div className="relative z-10 text-xs text-teal-100/50 mt-auto">
          &copy; {new Date().getFullYear()} Puspa. Semua Hak Dilindungi.
        </div>
      </div>

      {/* Right Side - Success Content */}
      <div className="w-full md:w-7/12 p-8 sm:p-12 md:p-16 xl:p-24 bg-white relative flex flex-col justify-center min-h-screen overflow-y-auto">
        <div className="max-w-md mx-auto w-full flex flex-col items-center">
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

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center text-center w-full"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#A2E4D3]/10 rounded-full blur-2xl pointer-events-none transform scale-90" />
              <Image
                src="/password.png"
                alt="Ilustrasi Email Verified"
                width={280}
                height={280}
                className="w-auto h-48 sm:h-56 object-contain relative z-10"
                priority
              />
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#1E5C58] mb-3">
              Email Terverifikasi
            </h2>
            <p className="text-gray-500 text-sm mb-8 max-w-sm leading-relaxed">
              Selamat, email Anda telah terverifikasi dan akun berhasil diaktifkan. Silakan klik tombol di bawah untuk masuk ke dasbor.
            </p>

            <Link href="/auth/login" className="w-full">
              <button className="w-full bg-[#2B7A75] hover:bg-[#1E5C58] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-teal-700/10 hover:shadow-teal-700/20 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                <span>Masuk Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>

            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-400 hover:text-[#2B7A75] transition-colors mt-6 group"
            >
              <Home className="w-4 h-4 text-gray-300 group-hover:text-[#2B7A75] transition-colors" />
              <span>Kembali ke Beranda</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
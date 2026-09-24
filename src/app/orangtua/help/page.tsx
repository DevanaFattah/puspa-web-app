"use client";

import React, { useState } from "react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HelpOrangtuaPage() {
  const faqs = [
    {
      question: "Bagaimana cara melakukan assessment mandiri untuk anak saya?",
      answer:
        "Anda dapat masuk ke menu 'Assessment', pilih anak yang bersangkutan, kemudian klik tombol 'Aksi' -> 'Mulai Isi' pada kategori data yang tersedia (seperti Data Umum, Fisioterapi, Okupasi, Wicara, atau Paedagog). Isi setiap pertanyaan dengan lengkap lalu simpan jawaban Anda.",
    },
    {
      question:
        "Dapatkah saya mengubah data profil anak yang sudah didaftarkan?",
      answer:
        "Ya, Anda dapat masuk ke menu 'Anak', kemudian klik ikon pena (edit) pada kartu anak yang ingin diubah datanya. Lakukan perubahan pada kolom isian yang diinginkan lalu klik 'Simpan'.",
    },
    {
      question:
        "Bagaimana cara mendownload laporan perkembangan hasil observasi/assessment?",
      answer:
        "Laporan perkembangan dapat didownload setelah asesor/terapis selesai melakukan verifikasi dan mengupload dokumen laporan. Masuk ke menu 'Assessment' -> pilih anak -> klik tombol 'Unduh Laporan' di bagian bawah halaman kategori jika file laporan sudah tersedia.",
    },
    {
      question:
        "Bagaimana jika ada kesalahan data pada riwayat jawaban assessment?",
      answer:
        "Jawaban assessment yang telah dikirim bersifat final untuk keperluan rekam medis perkembangan anak. Jika terdapat kesalahan pengisian yang fatal, silakan hubungi tim administrasi kami melalui WhatsApp support untuk bantuan perbaikan data.",
    },
    {
      question: "Apakah saya bisa mendaftarkan lebih dari satu anak dalam satu akun?",
      answer:
        "Tentu saja. Anda dapat mendaftarkan beberapa anak melalui menu 'Anak' dengan mengklik tombol 'Tambah Anak'. Setiap anak akan memiliki rekam medis assessment yang terpisah secara aman.",
    },
    {
      question: "Berapa lama batas waktu pengisian formulir assessment?",
      answer:
        "Tidak ada batas waktu pengisian. Anda dapat mengisi formulir secara bertahap. Pastikan semua kolom wajib diisi dengan benar sebelum mengirimkan jawaban akhir.",
    },
    {
      question: "Bagaimana cara memperbarui kata sandi atau informasi profil saya?",
      answer:
        "Klik foto profil atau nama Anda di bagian pojok kiri bawah sidebar untuk memunculkan menu dropdown. Pilih 'Profil' untuk mengubah nama/kontak, atau 'Ubah Password' untuk memperbarui kata sandi akun Anda.",
    },
    {
      question: "Bagaimana jika saya lupa akun email yang terdaftar?",
      answer:
        "Jika Anda lupa alamat email yang terdaftar pada sistem kami, silakan hubungi tim administrasi kami melalui WhatsApp Support dengan melampirkan nama lengkap wali dan nama anak Anda.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Address details for map embedding
  const addressQuery = "Holistic Care Puspa Center Jl. Teratai I No.21 Surakarta";
  const mapEmbedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(addressQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const gmapsLink = "https://maps.app.goo.gl/YyYJmvqmMuuubQgo8";

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      <div className="space-y-6 text-[#1E5C58]">
        {/* Header Section */}
        <div className="pb-2">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E5C58] tracking-tight">
            Pusat Bantuan & FAQ
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-1">
            Temukan jawaban atas pertanyaan Anda atau hubungi tim support kami.
          </p>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: FAQ List */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 space-y-4">
            <h2 className="text-lg font-extrabold flex items-center gap-2 mb-2 text-[#1E5C58]">
              <HelpCircle className="w-5 h-5 text-[#2B7A75]" /> Pertanyaan Umum (FAQ)
            </h2>

            <div className="divide-y divide-teal-50/50">
              {faqs.map((faq, index) => {
                const isOpen = activeIndex === index;
                return (
                  <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setActiveIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between text-left font-bold text-[#1E5C58] hover:text-[#2B7A75] transition-colors py-2 cursor-pointer group"
                    >
                      <span className="text-sm sm:text-base pr-4 group-hover:translate-x-0.5 transition-transform duration-200">
                        {faq.question}
                      </span>
                      <div className="w-7 h-7 rounded-lg bg-teal-50/50 flex items-center justify-center text-[#2B7A75] group-hover:bg-[#2B7A75] group-hover:text-white transition-colors duration-300">
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 shrink-0" />
                        )}
                      </div>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed pt-2 pb-1 pl-1 pr-4">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Info & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Contact Card */}
            <div className="bg-white border border-teal-50 rounded-3xl p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-4">
              <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2 text-[#1E5C58]">
                <MessageCircle className="w-5 h-5 text-[#2B7A75]" /> Hubungi Tim Support
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                Butuh bantuan administratif atau teknis darurat? Hubungi kami langsung melalui:
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href="https://wa.me/6281225823055"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-[#F4F9F8] hover:bg-[#2B7A75]/10 rounded-2xl transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-[#2B7A75] transition-colors duration-300">
                    <Phone className="w-5 h-5 text-[#2B7A75] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400">WhatsApp Support</span>
                    <span className="text-xs sm:text-sm font-bold text-[#1E5C58]">+62 812-2582-3055</span>
                  </div>
                </a>

                <a
                  href="mailto:[EMAIL_ADDRESS]"
                  className="flex items-center gap-3 p-3 bg-[#F4F9F8] hover:bg-[#2B7A75]/10 rounded-2xl transition-all group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center group-hover:bg-[#2B7A75] transition-colors duration-300">
                    <Mail className="w-5 h-5 text-[#2B7A75] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-400">Email Resmi</span>
                    <span className="text-xs sm:text-sm font-bold text-[#1E5C58]">puspa@alfirdausina.net</span>
                  </div>
                </a>
              </div>
            </div>

            {/* Location & Google Maps Card */}
            <div className="bg-white border border-teal-50 rounded-3xl p-6 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base md:text-lg flex items-center gap-2 text-[#1E5C58]">
                    <MapPin className="w-5 h-5 text-[#2B7A75]" /> Lokasi Klinik
                  </h3>
                  <p className="text-[11px] font-bold text-[#1E5C58]">Holistic Care Puspa Center</p>
                  <p className="text-[10px] text-gray-400 font-semibold leading-normal max-w-xs">
                    Jl. Teratai I No.21, Mangkubumen, Kec. Banjarsari, Kota Surakarta, Jawa Tengah 57139
                  </p>
                </div>

                <a
                  href={gmapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-teal-500/10 active:scale-95 cursor-pointer shrink-0"
                >
                  Gmaps <ExternalLink size={12} />
                </a>
              </div>

              {/* GMAPS PREVIEW IFRAME */}
              <div className="w-full h-48 sm:h-56 rounded-2xl overflow-hidden border border-teal-100 shadow-inner relative">
                <iframe
                  src={mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Peta Lokasi Klinik Holistic Care Puspa Center"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

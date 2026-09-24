/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  Download, 
  Play, 
  History, 
  X,
  ClipboardList,
  Activity,
  Volume2,
  GraduationCap,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { downloadAssessmentReport } from "@/lib/api/childrenAsesment";
import { getMyAssessmentDetail } from "@/lib/api/checkStatusAsesment";

interface AssessmentDetail {
  assessment_detail_id: number;
  type: string;
  status: string;
  parent_completed_status: string; // global
  is_filled: boolean; // PER TERAPI
}

export default function AssessmentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id") ?? "";

  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState<string[]>([]);
  const [hasNewFile, setHasNewFile] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const [completionStatus, setCompletionStatus] = useState<
    Record<string, string>
  >({});

  const [filledStatus, setFilledStatus] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    async function fetchDetail() {
      if (!assessmentId) return;

      try {
        const res = await getMyAssessmentDetail(assessmentId);

        setTypes(res.details.map((d: AssessmentDetail) => d.type));

        const mapCompleted: Record<string, string> = {};
        const mapFilled: Record<string, boolean> = {};

        res.details.forEach((d: AssessmentDetail) => {
          mapCompleted[d.type] = d.parent_completed_status;
          mapFilled[d.type] = d.is_filled; 
        });

        setCompletionStatus(mapCompleted);
        setFilledStatus(mapFilled);

        setHasNewFile(Boolean(res.report?.available));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [assessmentId]);

  if (!assessmentId) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600 text-xl font-bold">
        Assessment ID tidak ditemukan.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat kategori formulir...</p>
      </div>
    );
  }

  const kategoriList = [
    {
      code: "umum",
      kategori: "Data Umum",
      subkategori: [
        "Identitas",
        "Riwayat Anak",
        "Riwayat Kesehatan",
        "Riwayat Pendidikan",
      ],
      link: `/orangtua/assessment/kategori/data-umum?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/data-umumRiwayat?assessment_id=${assessmentId}`,
      color: "bg-teal-50 text-teal-700 border-teal-100/50",
      icon: ClipboardList,
    },
    {
      code: "fisio",
      kategori: "Data Fisioterapi",
      subkategori: ["Keluhan Utama", "Riwayat Penyakit"],
      link: `/orangtua/assessment/kategori/fisioterapi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/fisioterapiRiwayat?assessment_id=${assessmentId}`,
      color: "bg-blue-50 text-blue-700 border-blue-100/50",
      icon: Activity,
    },
    {
      code: "okupasi",
      kategori: "Terapi Okupasi",
      subkategori: ["Perkembangan Sensorik", "Motorik Halus"],
      link: `/orangtua/assessment/kategori/okupasi?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/okupasiRiwayat?assessment_id=${assessmentId}`,
      color: "bg-indigo-50 text-indigo-700 border-indigo-100/50",
      icon: Sparkles,
    },
    {
      code: "wicara",
      kategori: "Terapi Wicara",
      subkategori: ["Kemampuan Bicara", "Komunikasi Verbal"],
      link: `/orangtua/assessment/kategori/wicara?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/wicaraRiwayat?assessment_id=${assessmentId}`,
      color: "bg-pink-50 text-pink-700 border-pink-100/50",
      icon: Volume2,
    },
    {
      code: "paedagog",
      kategori: "Data Paedagog",
      subkategori: [
        "Aspek Akademis",
        "Aspek Ketunaan",
        "Sosialisasi & Komunikasi",
      ],
      link: `/orangtua/assessment/kategori/paedagog?assessment_id=${assessmentId}`,
      riwayat: `/orangtua/assessment/kategori/paedagogRiwayat?assessment_id=${assessmentId}`,
      color: "bg-amber-50 text-amber-700 border-amber-100/50",
      icon: GraduationCap,
    },
  ];

  const filteredKategori = kategoriList.filter((k) =>
    types.includes(k.code)
  );

  const handleDownload = async () => {
    if (!hasNewFile) return;
    try {
      setDownloading(true);
      await downloadAssessmentReport(assessmentId);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      <div className="space-y-6 text-[#1E5C58]">
        {/* Top Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E5C58] tracking-tight">
              Formulir Assessment
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm font-semibold mt-1">
              Silakan lengkapi kategori data assessment berikut sesuai instruksi medis.
            </p>
          </div>

          <button
            onClick={() => router.push("/orangtua/assessment")}
            className="flex self-start sm:self-center items-center justify-center p-2.5 bg-white border border-teal-50 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X size={20} />
          </button>
        </div>

        {/* Report Status Banner (Download) */}
        <div className={`bg-white border-2 ${hasNewFile ? 'border-teal-500/30 bg-teal-50/10' : 'border-gray-150'} p-5 md:p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.03)]`}>
          <div className="flex items-start gap-4">
            <div className={`p-2.5 rounded-2xl shrink-0 ${hasNewFile ? 'bg-teal-500/10 text-teal-600' : 'bg-gray-100 text-gray-400'}`}>
              {hasNewFile ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-[#1E5C58] text-base md:text-lg">
                {hasNewFile ? "Laporan Observasi Siap Diunduh" : "Laporan Belum Tersedia"}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 font-semibold mt-0.5 max-w-2xl">
                {hasNewFile
                  ? "Asesor / Terapis telah menyelesaikan pemeriksaan dan mengunggah laporan hasil assessment resmi anak Anda."
                  : "Laporan perkembangan anak Anda akan tersedia di sini setelah seluruh proses assessment dan pemeriksaan selesai diverifikasi."}
              </p>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={!hasNewFile || downloading}
            className="w-full md:w-auto flex items-center justify-center gap-2 bg-[#2B7A75] hover:bg-[#1E5C58] text-white px-6 py-3.5 rounded-2xl font-bold disabled:opacity-50 disabled:cursor-not-allowed transition-all text-xs shadow-md shadow-teal-500/10 cursor-pointer whitespace-nowrap active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>
              {downloading ? "Mengunduh Laporan..." : "Unduh Laporan Resmi"}
            </span>
          </button>
        </div>

        {/* Categories Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredKategori.map((item, index) => {
            const isFilled = filledStatus[item.code] === true;
            const IconComponent = item.icon;

            return (
              <motion.div
                key={index}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="bg-white rounded-3xl border border-teal-50/80 shadow-[0_10px_35px_-10px_rgba(0,0,0,0.03)] p-6 flex flex-col justify-between min-h-[260px] relative overflow-hidden group"
              >
                {/* Visual Glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-radial from-teal-50/40 via-transparent to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 -mr-6 -mt-6 pointer-events-none" />

                <div>
                  {/* Category Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-2xl border ${item.color} shrink-0`}>
                      <IconComponent className="w-6 h-6" />
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0">
                      {isFilled ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-teal-50 text-[#2B7A75] rounded-full text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2B7A75] animate-pulse" />
                          Selesai Diisi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Belum Diisi
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-extrabold text-[#1E5C58] text-base md:text-lg mb-2 group-hover:text-[#2B7A75] transition-colors duration-300">
                    {item.kategori}
                  </h3>

                  {/* Subcategories List */}
                  {item.subkategori.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {item.subkategori.map((sub, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-semibold text-gray-500"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Direct Action Buttons */}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center gap-3">
                  {!isFilled ? (
                    <button
                      onClick={() => router.push(item.link)}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Mulai Pengisian
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => router.push(item.riwayat)}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-[#2B7A75]/10 text-[#2B7A75] hover:text-[#1E5C58] rounded-xl text-xs font-bold transition-all border border-teal-50 cursor-pointer"
                      >
                        <History className="w-3.5 h-3.5" />
                        Riwayat Jawaban
                      </button>
                      <button
                        onClick={() => router.push(item.link)}
                        className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-xl transition-all border border-gray-100 cursor-pointer"
                        title="Ubah / Isi Kembali"
                      >
                        <Play className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
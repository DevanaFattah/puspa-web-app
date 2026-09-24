/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";

function DataFisioterapiRiwayatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umumRiwayat" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapiRiwayat" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasiRiwayat" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicaraRiwayat" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagogRiwayat" },
  ];
  const activeStep = 1;

  const [dataRiwayat, setDataRiwayat] = useState({
    keluhan: "",
    riwayat: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      console.warn("assessment_id tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await getParentAssessmentAnswers(
          assessmentId as string,
          "fisio_parent" as ParentSubmitType
        );

        const dataArray = res?.data || [];

        const keluhanObj = dataArray.find(
          (item: any) =>
            item.question_text.toLowerCase().includes("keluhan utama")
        );

        const riwayatObj = dataArray.find(
          (item: any) =>
            item.question_text.toLowerCase().includes("riwayat penyakit")
        );

        setDataRiwayat({
          keluhan: keluhanObj?.answer?.value || "",
          riwayat: riwayatObj?.answer?.value || "",
        });
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Gagal mengambil data jawaban");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      {/* Header section with back & close actions */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6 text-[#1E5C58]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Riwayat: II. Fisioterapi</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Melihat kembali riwayat pengisian data keluhan dan riwayat medis fisioterapi anak Anda.</p>
        </div>
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="flex items-center justify-center p-2.5 bg-white border border-teal-50 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
      </div>

      {/* STEP PROGRESS - Horizontal Scroll pada Mobile */}
      <div className="mb-6 md:mb-10 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <div className="flex items-center min-w-max md:min-w-0 md:justify-center px-4 md:px-0">
          {steps.map((step, i) => {
            const isCompleted = i < activeStep;
            const isActive = i === activeStep;
            return (
              <div key={i} className="flex items-center">
                <div 
                  className="flex flex-col items-center text-center space-y-1.5 md:space-y-2 cursor-pointer group" 
                  onClick={() => router.push(`${step.path}?assessment_id=${assessmentId}`)}
                >
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-[10px] md:text-sm font-extrabold border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                        : isCompleted
                          ? "bg-teal-50/50 border-[#2B7A75]/30 text-[#2B7A75]"
                          : "bg-gray-100 border-gray-200 text-gray-400"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[10px] md:text-xs font-bold transition-colors ${
                      isActive ? "text-[#1E5C58]" : "text-gray-400 group-hover:text-gray-600"
                    } max-w-[70px] md:max-w-none leading-tight`}
                  >
                    {step.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`h-0.5 transition-all duration-300 mx-2 md:mx-4 translate-y-[-10px] md:translate-y-[-14px] rounded-full ${
                      i < activeStep ? "bg-[#2B7A75] w-6 md:w-16" : "bg-gray-200 w-4 md:w-12"
                    }`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card utama read-only */}
      <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 w-full">
        {loading ? (
          <div className="flex flex-col justify-center items-center py-12 gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2B7A75]"></div>
            <p className="text-gray-400 font-semibold text-xs animate-pulse">Sinkronisasi data...</p>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-4 bg-red-50 rounded-2xl text-xs md:text-sm font-bold border border-red-100">{error}</p>
        ) : (
          <div className="space-y-6">
            {/* Keluhan */}
            <div className="p-5 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              <label className="block text-xs sm:text-sm font-bold text-[#1E5C58] mb-3 leading-relaxed">
                Keluhan utama yang dialami anak saat ini:
              </label>
              <div className="w-full border border-gray-150 rounded-xl p-4 bg-gray-50/40 text-gray-700 text-xs md:text-sm min-h-[120px] whitespace-pre-wrap leading-relaxed">
                {dataRiwayat.keluhan || <span className="text-gray-400 italic">Tidak ada keluhan yang dicatat</span>}
              </div>
            </div>

            {/* Riwayat */}
            <div className="p-5 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              <label className="block text-xs sm:text-sm font-bold text-[#1E5C58] mb-3 leading-relaxed">
                Riwayat penyakit atau kondisi yang berhubungan dengan fisioterapi:
              </label>
              <div className="w-full border border-gray-150 rounded-xl p-4 bg-gray-50/40 text-gray-700 text-xs md:text-sm min-h-[120px] whitespace-pre-wrap leading-relaxed">
                {dataRiwayat.riwayat || <span className="text-gray-400 italic">Tidak ada riwayat penyakit yang dicatat</span>}
              </div>
            </div>
          </div>
        )}

        {/* Button Back */}
        <div className="flex flex-col sm:flex-row justify-end mt-8 gap-3 border-t border-gray-50 pt-6">
          <button
            onClick={() => router.back()}
            className="w-full sm:w-auto px-8 py-3.5 bg-gray-100 text-[#1E5C58] font-bold rounded-2xl hover:bg-gray-200 transition-all active:scale-95 text-xs text-center cursor-pointer"
          >
            Kembali
          </button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

export default function DataFisioterapiRiwayatPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Halaman...</p>
      </div>
    }>
      <DataFisioterapiRiwayatContent />
    </Suspense>
  );
}
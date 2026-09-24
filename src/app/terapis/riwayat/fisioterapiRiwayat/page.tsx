/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight, Check } from "lucide-react";
import { getFisioParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";

/* ======================= TYPES ======================= */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: any;
  note: string | null;
};

/* ======================= STEPPER ======================= */
const steps = [
  { label: "Data Umum", path: "/terapis/riwayat/umumRiwayat", type: "umum_parent" },
  { label: "Fisioterapi", path: "/terapis/riwayat/fisioterapiRiwayat", type: "fisio_parent" },
  { label: "Okupasi", path: "/terapis/riwayat/okupasiRiwayat", type: "okupasi_parent" },
  { label: "Wicara", path: "/terapis/riwayat/wicaraRiwayat", type: "wicara_parent" },
  { label: "Paedagog", path: "/terapis/riwayat/paedagogRiwayat", type: "paedagog_parent" },
];

export default function DataFisioterapiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");
  const activeStep = 1; // Fisioterapi

  /* ======================= STATE ======================= */
  const [dataRiwayat, setDataRiwayat] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================= FETCH ======================= */
  useEffect(() => {
    if (!assessmentId) {
      setError("assessment_id tidak ditemukan di URL");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getFisioParentAnswer(assessmentId);
        setDataRiwayat(res?.data || []);
      } catch (err: any) {
        console.error("❌ Gagal fetch data:", err);
        setError(err.message || "Gagal mengambil data jawaban");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ======================= RENDER ANSWER ======================= */
  const renderAnswer = (answer: any) => {
    if (answer === null || answer === undefined) return <span className="text-gray-400 italic">Tidak ada jawaban</span>;

    // { value: "..." }
    if (typeof answer === "object" && "value" in answer) {
      return <span className="font-semibold text-gray-800">{answer.value ?? "-"}</span>;
    }

    // Array (checkbox / saudara / dll)
    if (Array.isArray(answer)) {
      if (answer.length === 0) return <span className="text-gray-400 italic">Kosong</span>;

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {answer.map((item, idx) => (
            <div key={idx} className="flex gap-2 items-center bg-white border border-teal-50/50 rounded-lg p-2 font-semibold">
              <span className="w-4 h-4 bg-teal-500 rounded-md flex items-center justify-center text-white shrink-0">
                <Check size={10} strokeWidth={3} />
              </span>
              <span className="text-gray-700">
                {typeof item === "string"
                  ? item
                  : Object.entries(item).map(([k, v]) => `${k}: ${String(v)}`).join(", ")}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Object (milestone / penyakit / dll)
    if (typeof answer === "object") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {Object.entries(answer).map(([k, v]) => (
            <div key={k} className="flex gap-2 items-center bg-white border border-teal-50/50 rounded-lg p-2">
              <span className="font-bold text-[#1E5C58] capitalize">{k.replace(/_/g, " ")}:</span>
              <span className="text-gray-600 font-medium">{String(v ?? "-")}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="font-semibold text-gray-800">{String(answer)}</span>;
  };

  /* ======================= UI ======================= */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FBFB] text-[#1E5C58]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#81B7A9] border-t-transparent"></div>
          <p className="text-sm font-semibold">Memuat Data Jawaban...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FBFB] text-red-600 font-semibold text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= STEPPER & BACK BUTTON ================= */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 max-w-7xl mx-auto w-full bg-white rounded-2xl p-4 border border-teal-50/50 shadow-[0_2px_12px_rgba(30,92,88,0.02)]">
        <div className="flex items-center w-full justify-between lg:max-w-[80%]">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isCompleted = i < activeStep;
            return (
              <React.Fragment key={i}>
                <button
                  onClick={() => {
                    if (assessmentId) {
                      router.push(`${step.path}?assessment_id=${assessmentId}&type=${step.type}`);
                    }
                  }}
                  className="flex flex-col items-center gap-1.5 focus:outline-none group cursor-pointer shrink-0"
                >
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${
                      isActive
                        ? "bg-[#1E5C58] border-[#1E5C58] text-white shadow-sm scale-105"
                        : isCompleted
                        ? "bg-[#81B7A9] border-[#81B7A9] text-white"
                        : "bg-gray-50 border-gray-200 text-gray-400 group-hover:border-[#81B7A9] group-hover:text-[#1E5C58]"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span
                    className={`text-[10px] md:text-xs transition-colors duration-300 font-bold ${
                      isActive
                        ? "text-[#1E5C58]"
                        : isCompleted
                        ? "text-[#81B7A9]"
                        : "text-gray-400 group-hover:text-[#1E5C58]"
                    }`}
                  >
                    {step.label}
                  </span>
                </button>

                {i < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-100 mx-2 md:mx-4 translate-y-[-14px]" />
                )}
              </React.Fragment>
            );
          })}
        </div>
        <div className="h-px w-full bg-gray-100 lg:hidden" />
        <button
          onClick={() => router.push("/terapis/asessmentOrtu?status=Selesai")}
          className="px-5 py-2.5 border bg-[#1E5C58] hover:bg-[#2E8B83] rounded-xl transition-all text-xs font-bold text-white cursor-pointer shrink-0 shadow-sm w-full lg:w-auto text-center"
        >
          Kembali
        </button>
      </div>

      {/* ================= CONTENT CARD ================= */}
      <div className="bg-white rounded-3xl border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.02)] max-w-7xl mx-auto overflow-hidden">
        {/* Aspect Header Row */}
        <div className="bg-[#EAF4F2]/30 px-6 py-4 border-b border-teal-50 flex items-center gap-2 text-[#1E5C58]">
          <BookOpen size={18} className="text-[#81B7A9]" />
          <h2 className="text-sm font-extrabold">II. Data Fisioterapi (Riwayat Jawaban)</h2>
        </div>

        {/* Questions Area */}
        <div className="p-6 md:p-8">
          {dataRiwayat.length === 0 ? (
            <p className="text-gray-400 italic text-center py-6 text-xs w-full col-span-2">Tidak ada data untuk aspek ini</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {dataRiwayat.map((item, idx) => (
                <div key={item.question_id} className="bg-[#F8FBFB]/80 border border-teal-50/50 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-3.5">
                  <p className="text-xs sm:text-sm font-extrabold text-[#1E5C58]">
                    {idx + 1}. {item.question_text}
                  </p>

                  <div className="space-y-2">
                    {/* Response Card Container */}
                    <div className="bg-white border border-teal-50/30 rounded-xl p-3 space-y-1.5 shadow-sm">
                      <div className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                        Jawaban Orang Tua
                      </div>
                      <div className="text-xs sm:text-sm text-gray-700 font-medium">
                        {renderAnswer(item.answer)}
                      </div>
                    </div>

                    {item.note && (
                      <div className="text-[10px] sm:text-[11px] text-amber-600 bg-amber-50/40 border border-amber-100/40 px-3 py-1.5 rounded-xl font-medium flex items-start gap-1">
                        <span className="font-extrabold shrink-0">Catatan:</span>
                        <span>{item.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Nav Bar */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-teal-50/50 flex justify-end">
          <button
            onClick={() => router.push("/terapis/asessmentOrtu?status=Selesai")}
            className="cursor-pointer px-4 py-2 border border-teal-100 rounded-xl text-xs font-bold text-[#1E5C58] hover:bg-teal-50/20 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    </div>
  );
}

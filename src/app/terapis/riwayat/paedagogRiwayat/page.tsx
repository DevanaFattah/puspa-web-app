/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import { getPaedagogParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";

/* ===================== TYPES ===================== */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer_value: string | null;
};

/* ===================== STEPPER ===================== */
const steps = [
  { label: "Data Umum", path: "/terapis/riwayat/umumRiwayat", type: "umum_parent" },
  { label: "Fisioterapi", path: "/terapis/riwayat/fisioterapiRiwayat", type: "fisio_parent" },
  { label: "Okupasi", path: "/terapis/riwayat/okupasiRiwayat", type: "okupasi_parent" },
  { label: "Wicara", path: "/terapis/riwayat/wicaraRiwayat", type: "wicara_parent" },
  { label: "Paedagog", path: "/terapis/riwayat/paedagogRiwayat", type: "paedagog_parent" },
];

/* ===================== ASPEK RANGE PAEDAGOG ===================== */
const paedagogAspectRanges = [
  { key: "akademis", label: "Aspek Akademis", range: [598, 616] },
  { key: "ketunaan_visual", label: "Aspek Ketunaan - Visual", range: [617, 622] },
  { key: "ketunaan_auditori", label: "Aspek Ketunaan - Auditori", range: [623, 629] },
  { key: "ketunaan_motorik", label: "Aspek Ketunaan - Motorik", range: [630, 634] },
  { key: "ketunaan_kognitif", label: "Aspek Ketunaan - Kognitif", range: [635, 639] },
  { key: "ketunaan_perilaku", label: "Aspek Ketunaan - Perilaku", range: [640, 645] },
  { key: "sosialisasi", label: "Aspek Sosialisasi", range: [646, 651] },
];

export default function PaedagogFormPageReadOnly() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [activeAspectIndex, setActiveAspectIndex] = useState(0);

  const activeStep = 4; // Paedagog
  const activeAspect = paedagogAspectRanges[activeAspectIndex];

  /* ===================== FETCH DATA ===================== */
  useEffect(() => {
    if (!assessmentId) {
      console.error("❌ assessment_id tidak ditemukan");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getPaedagogParentAnswer(assessmentId);
        const list = res?.data ?? [];

        const mapped: AnswerItem[] = list.map((item: any) => ({
          question_id: String(item.question_id),
          question_text: item.question_text ?? "-",
          answer_value: item?.answer?.value ?? null,
        }));

        setAnswers(mapped);
      } catch (e) {
        console.error("❌ Gagal memuat jawaban paedagog", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ===================== FILTER JAWABAN ===================== */
  const filteredAnswers = answers.filter((item) => {
    const qid = Number(item.question_id);
    return qid >= activeAspect.range[0] && qid <= activeAspect.range[1];
  });

  /* ===================== NAVIGASI ASPEK ===================== */
  const handlePrev = () => {
    setActiveAspectIndex((i) => (i > 0 ? i - 1 : i));
  };

  const handleNext = () => {
    setActiveAspectIndex((i) =>
      i < paedagogAspectRanges.length - 1 ? i + 1 : i
    );
  };

  /* ===================== RENDER ANSWER ===================== */
  const renderAnswer = (answerValue: string | null) => {
    if (answerValue === null || answerValue === undefined || answerValue === "") {
      return <span className="text-gray-400 italic">Tidak ada jawaban</span>;
    }

    if (answerValue === "Ya") {
      return (
        <span className="inline-flex items-center gap-1 bg-teal-50 text-teal-800 text-xs font-extrabold px-3 py-1 rounded-full border border-teal-100/30">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
          Ya
        </span>
      );
    }

    if (answerValue === "Tidak") {
      return (
        <span className="inline-flex items-center gap-1 bg-gray-50 text-gray-500 text-xs font-extrabold px-3 py-1 rounded-full border border-gray-200/55">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
          Tidak
        </span>
      );
    }

    return <span className="font-semibold text-gray-800">{answerValue}</span>;
  };

  /* ===================== UI ===================== */
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
        <div className="bg-[#EAF4F2]/30 px-6 py-4 border-b border-teal-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 text-[#1E5C58]">
            <BookOpen size={18} className="text-[#81B7A9]" />
            <h2 className="text-sm font-extrabold">{activeAspect.label}</h2>
          </div>

          <div className="relative w-full sm:w-60">
            <select
              value={activeAspectIndex}
              onChange={(e) => setActiveAspectIndex(Number(e.target.value))}
              className="w-full bg-white border border-teal-100 rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#81B7A9] text-[#1E5C58]"
            >
              {paedagogAspectRanges.map((aspect, i) => (
                <option key={aspect.key} value={i}>
                  {aspect.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Questions Area */}
        <div className="p-6 md:p-8">
          {filteredAnswers.length === 0 ? (
            <p className="text-gray-400 italic text-center py-6 text-xs w-full col-span-2">Tidak ada data untuk aspek ini</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredAnswers.map((item, idx) => (
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
                        {renderAnswer(item.answer_value)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Nav Bar */}
        <div className="px-6 py-4 bg-gray-50/50 border-t border-teal-50/50 flex justify-between items-center">
          <button
            disabled={activeAspectIndex === 0}
            onClick={handlePrev}
            className="cursor-pointer px-4 py-2 border border-teal-100 rounded-xl text-xs font-semibold text-[#1E5C58] hover:bg-teal-50/20 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            Sebelumnya
          </button>

          <button
            disabled={activeAspectIndex === paedagogAspectRanges.length - 1}
            onClick={handleNext}
            className="cursor-pointer px-4 py-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white rounded-xl text-xs font-bold disabled:opacity-40 disabled:hover:bg-[#1E5C58] transition-colors"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, ArrowLeft, MessageSquare, ClipboardCheck, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAssessmentAnswers } from "@/lib/api/asesment";

/* ======================
   TYPES
====================== */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: { value: number | string };
  note: string | null;
};

type GroupedAnswers = Record<string, AnswerItem[]>;

/* ======================
   ASPEK RANGE (PAEDAGOG)
====================== */
const ASPEK_RANGE = [
  { title: "Membaca", from: 69, to: 78 },
  { title: "Menulis", from: 79, to: 90 },
  { title: "Berhitung", from: 91, to: 97 },
  { title: "Kesiapan Belajar", from: 98, to: 104 },
  { title: "Pengetahuan Umum", from: 105, to: 112 },
];

const getAspekByQuestionId = (id: number) => {
  const found = ASPEK_RANGE.find(
    (range) => id >= range.from && id <= range.to
  );
  return found?.title ?? "Lainnya";
};

const groupByAspek = (items: AnswerItem[]): GroupedAnswers => {
  const grouped: GroupedAnswers = {};

  items.forEach((item) => {
    const qid = Number(item.question_id);
    const aspek = getAspekByQuestionId(qid);

    if (!grouped[aspek]) {
      grouped[aspek] = [];
    }

    grouped[aspek].push(item);
  });

  return grouped;
};

const SCORE_LABELS: Record<string, { label: string; color: string; bg: string; text: string }> = {
  "0": { label: "Buruk", color: "bg-red-500", bg: "bg-red-50", text: "text-red-700" },
  "1": { label: "Kurang Baik", color: "bg-orange-500", bg: "bg-orange-50", text: "text-orange-700" },
  "2": { label: "Cukup Baik", color: "bg-yellow-500", bg: "bg-yellow-50", text: "text-yellow-700" },
  "3": { label: "Baik", color: "bg-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
};

export default function RiwayatJawabanPaedagogPage() {
  const router = useRouter();
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id") ?? "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [answers, setAnswers] = useState<GroupedAnswers>({});
  const [activeAspek, setActiveAspek] = useState("");

  useEffect(() => {
    if (!assessmentId) {
      setError("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const fetchAnswers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getAssessmentAnswers(assessmentId, "paedagog");

        if (!Array.isArray(data)) {
          throw new Error("Format data tidak valid");
        }

        const grouped = groupByAspek(data);
        setAnswers(grouped);
        setActiveAspek(Object.keys(grouped)[0] ?? "");
      } catch (err) {
        console.error(err);
        setError("Gagal memuat riwayat jawaban.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnswers();
  }, [assessmentId]);

  const aspekList = Object.keys(answers);
  const currentQuestions = answers[activeAspek] ?? [];

  const currentAspekIndex = aspekList.findIndex((a) => a === activeAspek);

  const hasPrev = currentAspekIndex > 0;
  const hasNext = currentAspekIndex < aspekList.length - 1;

  const goPrev = () => {
    if (!hasPrev) return;
    setActiveAspek(aspekList[currentAspekIndex - 1]);
  };

  const goNext = () => {
    if (!hasNext) return;
    setActiveAspek(aspekList[currentAspekIndex + 1]);
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#81B7A9] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[#1E5C58]">Memuat riwayat jawaban...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center font-medium text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 text-[#1E5C58]">
      {/* HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100/50 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#81B7A9] uppercase tracking-wider">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Riwayat Asesmen</span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#1E5C58] mt-0.5">
            PLB | Paedagog ({activeAspek})
          </h1>
        </div>
        <button
          onClick={() => {
            const status = params.get("status") || "completed";
            router.push(`/terapis/asessment?type=paedagog&status=${status}`);
          }}
          className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(30,92,88,0.15)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.25)] hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar</span>
        </button>
      </div>

      {/* ASPEK CAPSULE TABS */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#EAF4F2]/50 border border-teal-100/30 rounded-xl w-fit">
        {aspekList.map((aspek) => {
          const isActive = aspek === activeAspek;
          return (
            <button
              key={aspek}
              onClick={() => setActiveAspek(aspek)}
              className={`cursor-pointer px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#1E5C58] text-white shadow-sm"
                  : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
              }`}
            >
              {aspek}
            </button>
          );
        })}
      </div>

      {/* QUESTIONS CONTAINER */}
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeAspek}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 gap-4"
          >
            {currentQuestions.map((q, idx) => {
              const isTextOnly = typeof q.answer?.value === "string";
              const scoreVal = String(q.answer?.value ?? "");
              const selectedScore = SCORE_LABELS[scoreVal];

              return (
                <div
                  key={q.question_id}
                  className="bg-white rounded-xl p-4 border border-teal-50 shadow-[0_4px_20px_rgba(30,92,88,0.02)] hover:shadow-[0_6px_24px_rgba(30,92,88,0.05)] transition-all duration-300"
                >
                  {/* Aspect Header */}
                  <div className="flex items-start justify-between gap-3 border-b border-gray-100 pb-2.5 mb-2.5">
                    <div className="space-y-0.5">
                      <span className="inline-block text-[9px] bg-teal-50 text-[#1E5C58] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        Pertanyaan {idx + 1}
                      </span>
                      <h3 className="font-extrabold text-[#1E5C58] text-sm md:text-base leading-relaxed">
                        {q.question_text}
                      </h3>
                    </div>
                    
                    {/* Compact Score Badge */}
                    {!isTextOnly && selectedScore && (
                      <div className={`flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${selectedScore.bg} ${selectedScore.text} border border-teal-100/50 whitespace-nowrap`}>
                        <Award className="w-3 h-3" />
                        <span>Skor: {scoreVal} ({selectedScore.label})</span>
                      </div>
                    )}
                  </div>

                  {/* ANSWER LAYOUT */}
                  {isTextOnly ? (
                    <div className="space-y-1.5">
                      <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider">Jawaban Asesor</span>
                      <div className="bg-teal-50/20 border border-teal-100/30 rounded-lg p-2.5 text-xs font-semibold text-gray-700 leading-relaxed min-h-[48px]">
                        {q.answer?.value || "-"}
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
                      {/* Rating Scale UX Visualizer */}
                      <div className="lg:col-span-5 space-y-2">
                        <span className="block text-[9px] text-gray-400 uppercase font-bold tracking-wider">Visualisasi Nilai</span>
                        <div className="flex flex-col sm:flex-row gap-1.5">
                          {["0", "1", "2", "3"].map((val) => {
                            const config = SCORE_LABELS[val];
                            const isCurrent = scoreVal === val;
                            return (
                              <div
                                key={val}
                                className={`flex-1 flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all ${
                                  isCurrent
                                    ? `${config.bg} border-teal-200 shadow-sm scale-[1.02]`
                                    : "bg-gray-50/50 border-gray-100 opacity-40"
                                }`}
                              >
                                <span className={`w-5 h-5 flex items-center justify-center rounded-full text-[10px] font-bold text-white mb-0.5 ${
                                  isCurrent ? config.color : "bg-gray-300"
                                }`}>
                                  {val}
                                </span>
                                <span className={`text-[9px] font-bold ${isCurrent ? config.text : "text-gray-400"}`}>
                                  {config.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Catatan/Keterangan */}
                      <div className="lg:col-span-7 space-y-1.5">
                        <div className="flex items-center gap-1 text-gray-400">
                          <MessageSquare className="w-3 h-3 text-[#81B7A9]" />
                          <span className="block text-[9px] uppercase font-bold tracking-wider">Keterangan / Catatan Tambahan</span>
                        </div>
                        <div className="bg-teal-50/20 border border-teal-100/30 rounded-lg p-2.5 text-xs font-semibold text-gray-700 leading-relaxed min-h-[48px]">
                          {q.note ? q.note : <span className="text-gray-400 font-normal italic">Tidak ada catatan</span>}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM PAGINATION */}
      <div className="flex items-center justify-between border-t border-teal-100/50 pt-4 mt-4">
        <button
          onClick={goPrev}
          disabled={!hasPrev}
          className={`cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-bold transition-all duration-300 ${
            hasPrev
              ? "bg-white border-teal-100 text-[#1E5C58] hover:bg-teal-50/20"
              : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <span className="text-[10px] font-bold text-[#81B7A9] uppercase tracking-widest bg-teal-50/40 px-2.5 py-1 rounded-lg border border-teal-100/30">
          {currentAspekIndex + 1} / {aspekList.length}
        </span>

        <button
          onClick={goNext}
          disabled={!hasNext}
          className={`cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-bold transition-all duration-300 ${
            hasNext
              ? "bg-white border-teal-100 text-[#1E5C58] hover:bg-teal-50/20"
              : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <span>Selanjutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


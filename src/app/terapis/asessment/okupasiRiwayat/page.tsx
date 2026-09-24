"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, ArrowLeft, ClipboardCheck, FileText, CheckSquare, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAssessmentQuestions,
  getAssessmentAnswers,
} from "@/lib/api/asesment";

/* =======================
   TYPES
======================= */
type Question = {
  id: number;
  question_text: string;
  answer_type: string;
  answer_options: string | null;
};

type Group = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

type AnswerItem = {
  question_id: string;
  answer?: {
    value: any;
  };
  note?: string | null;
};

export default function RiwayatJawabanOkupasiPage() {
  const router = useRouter();
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");
  const type = "okupasi";

  const [groups, setGroups] = useState<Group[]>([]);
  const [rawAnswers, setRawAnswers] = useState<AnswerItem[]>([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  /* =======================
     FETCH DATA
  ======================= */
  useEffect(() => {
    const fetchData = async () => {
      if (!assessmentId) return;

      try {
        const [questionRes, answerRes] = await Promise.all([
          getAssessmentQuestions(type),
          getAssessmentAnswers(assessmentId, type),
        ]);

        setGroups(questionRes.groups ?? []);
        setRawAnswers(answerRes ?? []);
      } catch (e) {
        console.error("Gagal load riwayat:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* =======================
     MAP ANSWERS
  ======================= */
  const answersMap = useMemo(() => {
    const map: Record<number, AnswerItem> = {};
    rawAnswers.forEach((a) => {
      map[Number(a.question_id)] = a;
    });
    return map;
  }, [rawAnswers]);

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

  if (groups.length === 0) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6 text-gray-500 font-medium">
        Tidak ada data riwayat.
      </div>
    );
  }

  const group = groups[stepIndex];

  /* =======================
     HELPER
  ======================= */
  const splitTitle = (text: string) => {
    if (text.includes("—")) return text.split("—").map((t) => t.trim());
    if (text.includes("-")) return text.split("-").map((t) => t.trim());
    return [text, text];
  };

  const TEXT_ONLY_GROUPS = [
    "final_report",
    "catatan",
    "rekomendasi",
    "laporan_khusus",
  ];

  const isTextOnly = TEXT_ONLY_GROUPS.includes(group.group_key);

  const progressPercent = ((stepIndex + 1) / groups.length) * 100;

  return (
    <div className="p-4 md:p-6 space-y-4 text-[#1E5C58]">
      {/* HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100/50 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#81B7A9] uppercase tracking-wider">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Riwayat Asesmen Okupasi</span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#1E5C58] mt-0.5">
            Terapi Okupasi ({stepIndex + 1}/{groups.length})
          </h1>
        </div>
        <button
          onClick={() => {
            const status = params.get("status") || "completed";
            router.push(`/terapis/asessment?type=okupasi&status=${status}`);
          }}
          className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(30,92,88,0.15)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.25)] hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar</span>
        </button>
      </div>

      {/* PROGRESS TRACKER */}
      <div className="space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-[#81B7A9]">
          <span className="truncate max-w-[80%]">Bagian saat ini: {group.title}</span>
          <span>{Math.round(progressPercent)}%</span>
        </div>
        <div className="w-full bg-[#EAF4F2] h-1.5 rounded-full overflow-hidden">
          <motion.div
            className="bg-[#1E5C58] h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-teal-50 shadow-[0_4px_24px_rgba(30,92,88,0.02)]">
        <h2 className="text-sm md:text-base font-extrabold text-[#1E5C58] mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
          <FileText className="w-4 h-4 text-[#81B7A9]" />
          <span>{group.title}</span>
        </h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={group.group_id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {/* TEXT ONLY (LAPORAN) */}
            {isTextOnly ? (
              <div className="space-y-4">
                {group.questions.map((q) => {
                  const ans = answersMap[q.id];
                  const valueText = ans?.answer?.value ?? ans?.note ?? "";
                  return (
                    <div key={q.id} className="space-y-1">
                      <label className="font-extrabold text-xs block text-[#1E5C58]">
                        {q.question_text}
                      </label>
                      <div className="bg-teal-50/20 border border-teal-100/30 rounded-lg p-2.5 text-xs font-semibold text-gray-700 leading-relaxed min-h-[64px] whitespace-pre-wrap">
                        {valueText || <span className="text-gray-400 font-normal italic">Tidak ada jawaban/laporan ditulis</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE WITH SUB JUDUL */
              <div className="overflow-x-auto border border-teal-100/40 rounded-xl shadow-sm bg-white">
                <table className="w-full text-xs text-left border-collapse">
                  <thead>
                    <tr className="bg-[#EAF4F2]/50 text-[#1E5C58] font-bold border-b border-teal-100/40">
                      <th className="p-2.5 w-[8%] text-center text-[10px] uppercase tracking-wider font-extrabold">No</th>
                      <th className="p-2.5 w-[47%] text-[10px] uppercase tracking-wider font-extrabold">Aspek Penilaian</th>
                      <th className="p-2.5 w-[15%] text-center text-[10px] uppercase tracking-wider font-extrabold">Nilai</th>
                      <th className="p-2.5 w-[30%] text-[10px] uppercase tracking-wider font-extrabold">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-teal-50/60">
                    {(() => {
                      let lastSubTitle = "";

                      return group.questions.map((q, idx) => {
                        const ans = answersMap[q.id];
                        const [subTitle, aspect] = splitTitle(q.question_text);
                        const showSubTitle = subTitle !== lastSubTitle;
                        lastSubTitle = subTitle;

                        const val = ans?.answer?.value;
                        const isArrayVal = Array.isArray(val);

                        return (
                          <React.Fragment key={q.id}>
                            {showSubTitle && (
                              <tr className="bg-[#EAF4F2]/30">
                                <td colSpan={4} className="p-2 pl-4 font-extrabold text-[10px] text-[#1E5C58] tracking-wider uppercase border-y border-teal-100/20">
                                  {subTitle}
                                </td>
                              </tr>
                            )}

                            <tr className="hover:bg-teal-50/10 transition-colors">
                              <td className="p-2.5 text-center font-bold text-gray-400">
                                {idx + 1}
                              </td>
                              <td className="p-2.5 font-bold text-gray-700">
                                {aspect}
                              </td>
                              <td className="p-2.5 text-center">
                                {isArrayVal ? (
                                  <div className="flex flex-wrap gap-1 justify-center">
                                    {(val as string[]).map((v, i) => (
                                      <span key={i} className="inline-block bg-teal-50 text-[#1E5C58] border border-teal-100/50 text-[9px] font-bold px-1.5 py-0.5 rounded">
                                        {v}
                                      </span>
                                    ))}
                                  </div>
                                ) : val !== undefined && val !== null && val !== "" ? (
                                  <span className="inline-block bg-teal-50 text-[#1E5C58] border border-teal-100/50 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                    {val}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 font-medium">-</span>
                                )}
                              </td>
                              <td className="p-2.5 text-xs font-semibold text-gray-600">
                                {ans?.note ? (
                                  <div className="flex items-start gap-1 bg-gray-50/70 border border-gray-100 p-1.5 rounded-lg text-[10px] font-medium">
                                    <MessageSquare className="w-3 h-3 text-[#81B7A9] mt-0.5 shrink-0" />
                                    <span>{ans.note}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 font-normal italic text-[10px]">Tidak ada catatan</span>
                                )}
                              </td>
                            </tr>
                          </React.Fragment>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* NAVIGATION BUTTONS */}
      <div className="flex items-center justify-between border-t border-teal-100/50 pt-4 mt-4">
        <button
          onClick={() => stepIndex > 0 && setStepIndex((i) => i - 1)}
          disabled={stepIndex === 0}
          className={`cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-bold transition-all duration-300 ${
            stepIndex > 0
              ? "bg-white border-teal-100 text-[#1E5C58] hover:bg-teal-50/20"
              : "bg-gray-50 border-gray-100 text-gray-300 cursor-not-allowed"
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <span className="text-[10px] font-bold text-[#81B7A9] uppercase tracking-widest bg-teal-50/40 px-2.5 py-1 rounded-lg border border-teal-100/30">
          {stepIndex + 1} / {groups.length}
        </span>

        {stepIndex < groups.length - 1 ? (
          <button
            onClick={() => setStepIndex((i) => i + 1)}
            className="cursor-pointer inline-flex items-center gap-1 bg-white border border-teal-100 text-[#1E5C58] hover:bg-teal-50/20 px-3 py-2 rounded-xl text-[10px] font-bold transition-all duration-300"
          >
            <span>Selanjutnya</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            Akhir Riwayat
          </span>
        )}
      </div>
    </div>
  );
}


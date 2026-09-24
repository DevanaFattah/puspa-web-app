/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

/* =======================
   TYPES
======================= */
type Question = {
  id: number;
  question_code: string;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options: string | null;
  extra_schema?: string | null;
};

type Group = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

type UIAnswer = {
  score?: string;
  note?: string;
  checked?: string[];
};

/* =======================
   HELPERS
======================= */
const splitQuestion = (text: string) => {
  const parts = text.split("—").map((t) => t.trim());
  if (parts.length >= 2) {
    return { subTitle: parts[0], question: parts.slice(1).join(" — ") };
  }
  return { subTitle: null, question: text };
};

const getShortTitle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes("bodily self")) return "Bodily Self";
  if (t.includes("keseimbangan")) return "Keseimbangan";
  if (t.includes("konsentrasi")) return "Konsentrasi";
  if (t.includes("konsep huruf")) return "Konsep Dasar";
  if (t.includes("motoric planning")) return "Motorik";
  if (t.includes("laporan akhir")) return "Laporan Akhir";
  return title;
};

export default function OkupasiAssessmentPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get("assessment_id") || "";

  const [groups, setGroups] = useState<Group[]>([]);
  const [answers, setAnswers] = useState<Record<number, UIAnswer>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  /* =======================
     LOAD QUESTIONS
  ======================= */
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getAssessmentQuestions("okupasi");
        setGroups(data.groups ?? []);
      } catch (err) {
        console.error(err);
        setError("Gagal memuat pertanyaan");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  /* =======================
     HANDLERS
  ======================= */
  const handleScoreChange = (id: number, value: string) => {
    setAnswers((p) => ({ ...p, [id]: { ...p[id], score: value } }));
  };

  const handleNoteChange = (id: number, value: string) => {
    setAnswers((p) => ({ ...p, [id]: { ...p[id], note: value } }));
  };

  const handleCheckboxToggle = (
    id: number,
    option: string,
    checked: boolean
  ) => {
    setAnswers((p) => {
      const current = p[id]?.checked ?? [];
      return {
        ...p,
        [id]: {
          ...p[id],
          checked: checked
            ? [...current, option]
            : current.filter((o) => o !== option),
        },
      };
    });
  };

  /* =======================
     SUBMIT
  ======================= */
  const handleSubmit = async () => {
    if (!assessmentId) {
      handleApiError(null, "assessment_id tidak ditemukan ❌");
      return;
    }

    const payloadAnswers: any[] = [];

    for (const g of groups) {
      for (const q of g.questions) {
        const ui = answers[q.id] ?? {};

        if (q.answer_type === "checkbox") {
          payloadAnswers.push({
            question_id: q.id,
            answer: { value: ui.checked ?? [] },
          });
        } else if (q.answer_type === "score_with_note") {
          payloadAnswers.push({
            question_id: q.id,
            answer: { value: Number(ui.score ?? 0) },
            note: ui.note ?? "",
          });
        } else {
          payloadAnswers.push({
            question_id: q.id,
            answer: { value: ui.note ?? "" },
          });
        }
      }
    }

    const payload = { answers: payloadAnswers };

    try {
      setSubmitting(true);
      await submitAssessment(assessmentId, "okupasi", payload);

      showSuccessToast("Assessment berhasil disubmit! ✅");
      router.push(`/terapis/asessment?type=okupasi&status=completed`);
    } catch (err: any) {
      console.error("❌ Submit Okupasi Assessment error:", err);

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan";

      if (status === 403) {
        handleApiError(err, "Anda tidak memiliki izin untuk mengirim assessment ini. Pastikan login sebagai Asesor sesuai jenis terapi.");
        return;
      }

      if (status === 401) {
        handleApiError(err, "Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = "/auth/login";
        return;
      }

      handleApiError(err, "Gagal submit assessment: " + message);
    } finally {
      setSubmitting(false);
    }
  };

  const currentQuestionsData = useMemo(() => {
    const group = groups[currentGroupIndex];
    if (!group) return [];
    
    let lastSubTitle: string | null = null;
    return group.questions.map((q) => {
      const { subTitle, question } = splitQuestion(q.question_text);
      const showSubTitle = subTitle && subTitle !== lastSubTitle;
      if (showSubTitle) lastSubTitle = subTitle;
      return {
        ...q,
        subTitle: showSubTitle ? subTitle : null,
        cleanQuestion: question,
      };
    });
  }, [groups, currentGroupIndex]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-medium">Memuat pertanyaan okupasi...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-20 text-red-500 font-bold">
        {error}
      </div>
    );
  }

  const group = groups[currentGroupIndex];

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Form Asesmen Terapi Okupasi
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Lengkapi lembar evaluasi okupasi dan tumbuh kembang motorik anak.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/asessment")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {/* ================= PROGRESS STEPPER TABS ================= */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#EAF4F2]/50 border border-teal-50/50 rounded-2xl w-fit">
        {groups.map((g, idx) => {
          const isActive = currentGroupIndex === idx;
          return (
            <button
              key={g.group_id}
              onClick={() => setCurrentGroupIndex(idx)}
              className={`cursor-pointer px-4 py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#1E5C58] text-white shadow-sm"
                  : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
              }`}
            >
              {idx + 1}. {getShortTitle(g.title)}
            </button>
          );
        })}
      </div>

      {/* ================= CARD FORM ================= */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-teal-100 shadow-[0_4px_20px_rgba(30,92,88,0.02)] space-y-4">
        <h2 className="text-base font-extrabold text-[#1E5C58] border-b border-gray-100 pb-2.5">
          {group.title}
        </h2>

        {group.group_key === "final_report" ? (
          <div className="space-y-3">
            {group.questions.map((q) => {
              const ui = answers[q.id] ?? {};

              if (q.answer_type === "checkbox") {
                return (
                  <div key={q.id} className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 space-y-2 text-xs sm:text-sm">
                    <label className="font-bold text-gray-700 block">
                      {q.question_text}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {["paedagog", "okupasi", "wicara", "fisio"].map((opt) => {
                        const isChecked = ui.checked?.includes(opt) ?? false;
                        return (
                          <label
                            key={opt}
                            className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                              isChecked
                                ? "bg-[#1E5C58] text-white border-[#1E5C58]"
                                : "bg-white text-gray-500 border-teal-100 hover:bg-teal-50/40"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="hidden"
                              checked={isChecked}
                              onChange={(e) =>
                                handleCheckboxToggle(q.id, opt, e.target.checked)
                              }
                            />
                            <span className="capitalize">{opt}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                );
              }

              return (
                <div key={q.id} className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 space-y-2">
                  <label className="font-bold text-gray-700 text-xs sm:text-sm block">
                    {q.question_text}
                  </label>
                  <textarea
                    className="w-full border border-teal-100 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] transition-all bg-white"
                    rows={3}
                    placeholder="Tulis kesimpulan laporan akhir..."
                    value={ui.note ?? ""}
                    onChange={(e) => handleNoteChange(q.id, e.target.value)}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {currentQuestionsData.map((q, idx) => {
              const ui = answers[q.id] ?? {};

              return (
                <React.Fragment key={q.id}>
                  {/* subTitle spans both columns */}
                  {q.subTitle && (
                    <div
                      className="md:col-span-2 text-[10px] font-extrabold text-teal-700 bg-teal-50 border border-teal-100 px-3 py-1 rounded-lg shadow-sm w-fit uppercase tracking-wider mt-1"
                    >
                      {q.subTitle}
                    </div>
                  )}

                  {/* Question card */}
                  <div
                    className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 flex flex-col gap-2 text-xs sm:text-sm"
                  >
                    {/* Question label */}
                    <p className="font-bold text-gray-700 leading-relaxed">
                      {idx + 1}. {q.cleanQuestion}
                    </p>

                    {/* Notes + Score in one row */}
                    <div className="flex items-center gap-2">
                      <input
                        className="flex-1 min-w-0 border border-teal-100 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] transition-all bg-white"
                        placeholder="Catatan..."
                        value={ui.note ?? ""}
                        onChange={(e) => handleNoteChange(q.id, e.target.value)}
                      />
                      <div className="flex items-center gap-1 shrink-0">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Skor:</span>
                        <div className="flex gap-0.5 p-0.5 bg-white border border-teal-100 rounded-lg">
                          {[0, 1, 2, 3].map((s) => {
                            const isSelected = ui.score === String(s);
                            return (
                              <button
                                key={s}
                                type="button"
                                onClick={() => handleScoreChange(q.id, String(s))}
                                className={`cursor-pointer px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-200 ${
                                  isSelected
                                    ? "bg-[#1E5C58] text-white shadow-sm"
                                    : "bg-transparent text-gray-500 hover:bg-teal-50/30"
                                }`}
                              >
                                {s}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        )}

        {/* ================= ACTION NAVIGATION ================= */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            disabled={currentGroupIndex === 0}
            onClick={() => setCurrentGroupIndex((i) => Math.max(i - 1, 0))}
            className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#1E5C58] px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>← Sebelumnya</span>
          </button>
          
          {currentGroupIndex < groups.length - 1 ? (
            <button
              onClick={() => setCurrentGroupIndex((i) => i + 1)}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <span>Lanjutkan →</span>
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-6 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <span>{submitting ? "Mengirim..." : "Submit & Selesai"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

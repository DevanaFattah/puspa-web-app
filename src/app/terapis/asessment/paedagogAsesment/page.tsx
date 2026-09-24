/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";

import { submitAssessment, getAssessmentQuestions } from "@/lib/api/asesment";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

// ==========================================================
// API INTERFACES
// ==========================================================
export interface Question {
  id: number;
  question_code: string;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options: string;
  answer_format: string | null;
  extra_schema: string | null;
}

export interface Group {
  group_id: number;
  group_key: string;
  title: string;
  filled_by: string;
  sort_order: string;
  questions: Question[];
}

export interface PaedagogData {
  assessment_type: string;
  groups: Group[];
}

// ==========================================================
// FRONTEND TYPES
// ==========================================================
type QuestionItem = {
  field: string;
  label: string;
  options: number[];
  id: number;
  answer_type: string;
};

type AspectItem = {
  key: string;
  title: string;
  questions: QuestionItem[];
};

type QuestionsData = AspectItem[];

type Answer = { desc?: string; score?: number };
type AnswersState = Record<string, Record<number, Answer>>;

// ==========================================================
// MAP ANSWERS → PAYLOAD
// ==========================================================
const mapAnswersToPayloadBE = (
  answersState: AnswersState,
  questionsData: QuestionsData
) => {
  const answersPayload: any[] = [];

  for (const aspek of questionsData) {
    const akey = aspek.key;
    const aspekAnswers = answersState[akey] || {};

    Object.entries(aspekAnswers).forEach(([idx, val]) => {
      const q = aspek.questions[Number(idx)];
      const payloadItem: any = {
        question_id: q.id,
      };

      if (q.answer_type === "text") {
        payloadItem.answer = { value: val.desc || "" };
      } else if (val.score !== undefined) {
        payloadItem.answer = { value: val.score };
        if (val.desc) payloadItem.note = val.desc;
      }

      answersPayload.push(payloadItem);
    });
  }

  return { answers: answersPayload };
};

// ==========================================================
// COMPONENT
// ==========================================================
export default function PLBAssessmentPage() {
  const params = useSearchParams();
  const router = useRouter();

  const assessmentId = params.get("assessment_id");
  const type = "paedagog";

  const [allQuestions, setAllQuestions] = useState<QuestionsData>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);

  const [activeAspek, setActiveAspek] = useState<string>("");
  const [answers, setAnswers] = useState<AnswersState>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // FETCH QUESTIONS
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);
        const res = await getAssessmentQuestions("paedagog");
        const groups: Group[] = res?.groups ?? [];

        if (!groups.length) {
          setAllQuestions([]);
          return;
        }

        const mapped: QuestionsData = groups.map((g) => ({
          key: g.group_key,
          title: g.title,
          questions: g.questions.map((q) => ({
            field: q.question_code,
            label: q.question_text,
            options: q.answer_options ? JSON.parse(q.answer_options) : [],
            id: q.id,
            answer_type: q.answer_type,
          })),
        }));

        setAllQuestions(mapped);
        if (mapped.length > 0) setActiveAspek(mapped[0].key);
      } catch (err) {
        handleApiError(err, "Gagal memuat pertanyaan dari server. ❌");
        setAllQuestions([]);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const aspekTabs = useMemo(() => allQuestions.map((a) => a.key), [allQuestions]);
  const activeAspectObj = useMemo(
    () => allQuestions.find((x) => x.key === activeAspek) ?? allQuestions[0],
    [activeAspek, allQuestions]
  );
  const currentQuestions = useMemo(() => activeAspectObj?.questions ?? [], [activeAspectObj]);

  const validationStatus = useMemo(() => {
    const status: Record<string, "completed" | "scheduled"> = {};
    aspekTabs.forEach((key) => {
      const aspek = allQuestions.find((a) => a.key === key);
      if (!aspek) {
        status[key] = "scheduled";
        return;
      }
      const total = aspek.questions.length;
      const answered = Object.values(answers[key] || {}).filter((a) =>
        a.score !== undefined || a.desc
      ).length;
      status[key] = answered >= total ? "completed" : "scheduled";
    });
    return status;
  }, [answers, aspekTabs, allQuestions]);

  const isLast = aspekTabs.indexOf(activeAspek) === aspekTabs.length - 1;
  const isFirst = aspekTabs.indexOf(activeAspek) === 0;

  const validateCurrentAspek = () => {
    const qList = currentQuestions;
    const currentAnswers = answers[activeAspek] || {};
    for (let i = 0; i < qList.length; i++) {
      const q = qList[i];
      if (q.answer_type !== "text" && (!currentAnswers[i] || currentAnswers[i].score === undefined))
        return false;
    }
    return true;
  };

  const handleDescChange = (index: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [activeAspek]: {
        ...prev[activeAspek],
        [index]: { ...prev[activeAspek]?.[index], desc: value },
      },
    }));
  };

  const handleScoreSelect = (index: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [activeAspek]: {
        ...prev[activeAspek],
        [index]: { ...prev[activeAspek]?.[index], score: value },
      },
    }));
    setOpenDropdown(null);
  };

  const handleSubmit = async () => {
    if (!assessmentId) {
      handleApiError(null, "assessment_id tidak ditemukan ❌");
      return;
    }

    const allComplete = Object.values(validationStatus).every(
      (v) => v === "completed"
    );
    if (!allComplete) {
      handleApiError(null, "Lengkapi semua penilaian sebelum menyimpan! ❌");
      return;
    }

    const payload = mapAnswersToPayloadBE(answers, allQuestions);

    try {
      setLoading(true);
      await submitAssessment(assessmentId, type, payload);

      showSuccessToast("Penilaian berhasil disimpan! ✅");
      router.push(`/terapis/asessment?type=paedagog&status=completed`);
    } catch (err: any) {
      console.error("❌ Submit assessment error:", err);

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan";

      if (status === 403) {
        handleApiError(err, "Anda tidak memiliki izin untuk menyimpan penilaian ini. Pastikan Anda login sebagai Asesor sesuai jenis terapi dan assessment ini memang milik Anda.");
        return;
      }

      if (status === 401) {
        handleApiError(err, "Sesi Anda telah berakhir. Silakan login kembali.");
        router.push("/auth/login");
        return;
      }

      handleApiError(err, "Gagal menyimpan: " + message);
    } finally {
      setLoading(false);
    }
  };

  if (loadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-medium">Memuat pertanyaan kuesioner...</span>
      </div>
    );
  }
  
  if (!allQuestions.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-red-500 font-bold">
        ❌ Tidak ada pertanyaan tersedia.
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Form Asesmen PLB / Paedagog
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Lengkapi penilaian aspek tumbuh kembang anak secara berkala.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/asessment")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {/* ================= STEPPER PROGRESS TABS ================= */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-[#EAF4F2]/50 border border-teal-50/50 rounded-2xl w-fit">
        {aspekTabs.map((tab, idx) => {
          const isActive = activeAspek === tab;
          const isDone = validationStatus[tab] === "completed";
          return (
            <button
              key={tab}
              onClick={() => setActiveAspek(tab)}
              className={`cursor-pointer px-4 py-2.5 text-xs md:text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2 ${
                isActive
                  ? "bg-[#1E5C58] text-white shadow-sm"
                  : isDone
                  ? "bg-[#81B7A9] text-white"
                  : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
              }`}
            >
              {isDone && <Check className="w-3.5 h-3.5" />}
              <span>{idx + 1}. {allQuestions.find((x) => x.key === tab)?.title}</span>
            </button>
          );
        })}
      </div>

      {/* ================= QUESTION CARDS ================= */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-teal-100 shadow-[0_4px_20px_rgba(30,92,88,0.02)] space-y-4">
        <h2 className="text-base font-extrabold text-[#1E5C58] border-b border-gray-100 pb-2.5">
          Aspek: {activeAspectObj?.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {currentQuestions.map((q, i) => {
            const current = answers[activeAspek]?.[i];

            if (q.answer_type === "text") {
              return (
                <div
                  key={i}
                  className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 flex flex-col gap-2"
                >
                  <p className="font-bold text-gray-700 text-xs sm:text-sm leading-relaxed">
                    {i + 1}. {q.label}
                  </p>
                  <input
                    className="w-full border border-teal-100/70 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] transition-all bg-white"
                    placeholder="Tulis kesimpulan..."
                    value={current?.desc || ""}
                    onChange={(e) => handleDescChange(i, e.target.value)}
                  />
                </div>
              );
            }

            return (
              <div
                key={i}
                className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 flex flex-col gap-2 text-xs sm:text-sm"
              >
                <p className="font-bold text-gray-700 leading-relaxed">
                  {i + 1}. {q.label}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 min-w-0 border border-teal-100/70 rounded-lg px-2.5 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] transition-all bg-white"
                    placeholder="Catatan..."
                    value={current?.desc || ""}
                    onChange={(e) => handleDescChange(i, e.target.value)}
                  />
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider hidden sm:inline">Skor:</span>
                    <div className="flex gap-0.5 p-0.5 bg-white border border-teal-100/80 rounded-lg">
                      {q.options.map((opt) => {
                        const isSelected = current?.score === opt;
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => handleScoreSelect(i, opt)}
                            className={`cursor-pointer px-2.5 py-1 rounded-md text-xs font-bold transition-all duration-200 ${
                              isSelected
                                ? "bg-[#1E5C58] text-white shadow-sm"
                                : "bg-transparent text-gray-500 hover:bg-teal-50/30"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= LEGEND / METADATA ================= */}
        {isLast && (
          <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-4 space-y-2">
            <span className="block text-xs font-bold text-teal-800 uppercase tracking-wider">Keterangan Penilaian:</span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] font-semibold text-[#1E5C58]/80 leading-relaxed">
              <p><span className="text-[#1E5C58] font-bold">Nilai 0 :</span> Buruk / Anak belum menguasai aspek</p>
              <p><span className="text-[#1E5C58] font-bold">Nilai 1 :</span> Kurang baik / Anak menguasai aspek namun tidak konsisten dan butuh bantuan dalam mengerjakannya</p>
              <p><span className="text-[#1E5C58] font-bold">Nilai 2 :</span> Cukup baik / Anak menguasai aspek secara konsisten dengan sedikit bantuan</p>
              <p><span className="text-[#1E5C58] font-bold">Nilai 3 :</span> Baik / Anak menguasai aspek</p>
            </div>
          </div>
        )}

        {/* ================= ACTION NAVIGATION ================= */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <button
            disabled={isFirst}
            onClick={() => setActiveAspek(aspekTabs[aspekTabs.indexOf(activeAspek) - 1])}
            className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#1E5C58] px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>← Sebelumnya</span>
          </button>
          
          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <span>{loading ? "Menyimpan..." : "Simpan & Selesai"}</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (!validateCurrentAspek()) {
                  handleApiError(null, "Masih ada pertanyaan yang belum dinilai! ❌");
                  return;
                }
                setActiveAspek(aspekTabs[aspekTabs.indexOf(activeAspek) + 1]);
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <span>Lanjutkan →</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

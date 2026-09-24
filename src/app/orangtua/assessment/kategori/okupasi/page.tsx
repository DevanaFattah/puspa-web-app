/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getParentAssessmentQuestions,
  submitParentAssessment,
} from "@/lib/api/asesmentTerapiOrtu";

type Question = {
  id: number;
  question_number: string;
  question_text: string;
  answer_type: string;
  answer_options?: string[];
};

type Category = {
  group_id: number;
  group_key: string;
  title: string;
  questions: Question[];
};

export default function DataTerapiOkupasiPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Halaman...</p>
      </div>
    }>
      <OkupasiAssessmentContent />
    </Suspense>
  );
}

function OkupasiAssessmentContent() {
  const router = useRouter();
  const search = useSearchParams();
  const assessmentId = search.get("assessment_id");

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [activeIdx, setActiveIdx] = useState(0);

  const lastIndex = categories.length - 1;

  useEffect(() => {
    async function load() {
      try {
        const res = await getParentAssessmentQuestions("parent_okupasi");
        setCategories(
          res.data.groups.map((g: any) => ({
            group_id: g.group_id,
            group_key: g.group_key,
            title: g.title,
            questions: g.questions.map((q: any) => ({
              id: q.id,
              question_number: q.question_number,
              question_text: q.question_text,
              answer_type: q.answer_type,
              answer_options: q.answer_options ?? [],
            })),
          }))
        );
      } catch (e) {
        console.error("Gagal load pertanyaan okupasi:", e);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const currentCategory = categories[activeIdx];

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex(
    (step) => step.label === "Data Terapi Okupasi"
  );

  const setAnswer = (qid: number, val: any) =>
    setAnswers((s) => ({ ...s, [qid]: val }));

  const goNext = () => activeIdx < lastIndex && setActiveIdx(activeIdx + 1);
  const goPrev = () => activeIdx > 0 && setActiveIdx(activeIdx - 1);

  const getValue = (qid: number, type?: string) => {
    if (answers.hasOwnProperty(qid)) return answers[qid];
    if (type === "checkbox") return [];
    if (type === "slider") return 1;
    return "";
  };

  const onSubmitAll = async () => {
    if (!assessmentId) {
      alert("Assessment ID tidak ditemukan!");
      return;
    }

    const payload = {
      answers: categories
        .flatMap((cat) =>
          cat.questions.map((q) => {
            const val =
              q.answer_type === "slider"
                ? answers[q.id] ?? 1
                : answers[q.id];

            if (
              val === undefined ||
              val === null ||
              (Array.isArray(val) && val.length === 0)
            )
              return null;

            return {
              question_id: Number(q.id),
              answer: {
                value:
                  q.answer_type === "checkbox"
                    ? val
                    : q.answer_type === "slider"
                    ? Number(val)
                    : val,
              },
            };
          })
        )
        .filter(Boolean),
    };

    try {
      await submitParentAssessment(assessmentId, "okupasi_parent", payload);
      alert("Jawaban berhasil dikirim!");
      router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`);
    } catch (e) {
      console.error("Error submit okupasi:", e);
      alert("Gagal mengirim jawaban.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Pertanyaan...</p>
      </div>
    );
  }

  if (!currentCategory) return null;

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      {/* Header section with back & close actions */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6 text-[#1E5C58]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">III. Terapi Okupasi</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Pantau aspek motorik kasar, motorik halus, dan sensorik anak Anda.</p>
        </div>
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="flex items-center justify-center p-2.5 bg-white border border-teal-50 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
      </div>

      {/* STEP INDICATOR */}
      <div className="mb-6 md:mb-10 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        <div className="flex items-center min-w-max md:min-w-0 md:justify-center px-4 md:px-0">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center">
              <div 
                className="flex flex-col items-center text-center space-y-1.5 md:space-y-2 cursor-pointer group" 
                onClick={() => router.push(`${step.path}?assessment_id=${assessmentId}`)}
              >
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-[10px] md:text-sm font-extrabold border-2 transition-all duration-300 ${
                    i === activeStep
                      ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                      : i < activeStep
                        ? "bg-teal-50/50 border-[#2B7A75]/30 text-[#2B7A75]"
                        : "bg-gray-100 border-gray-200 text-gray-400"
                  }`}
                >
                  {i + 1}
                </div>
                <span
                  className={`text-[10px] md:text-xs font-bold transition-colors ${
                    i === activeStep ? "text-[#1E5C58]" : "text-gray-400 group-hover:text-gray-600"
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
          ))}
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 w-full">
        {/* Card Sub-header */}
        <div className="mb-6 md:mb-8 border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h4 className="text-base md:text-lg font-extrabold text-[#1E5C58]">
              {activeIdx + 1}. {currentCategory.title}
            </h4>
            <p className="text-[10px] md:text-xs text-gray-400 font-semibold mt-0.5">Bagian {activeIdx + 1} dari {categories.length}</p>
          </div>
          
          <div className="flex gap-1">
            {categories.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeIdx ? "w-6 bg-[#2B7A75]" : "w-2 bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Questions Render - Grid 2 Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentCategory.questions.map((q) => {
            const isFullWidth = q.answer_type === "checkbox" || q.answer_type === "slider";
            return (
              <div key={q.id} className={`p-4 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] ${isFullWidth ? "col-span-full" : "col-span-full md:col-span-1"}`}>
                {q.answer_type === "yes_only" ? (
                  <div className="flex justify-between items-center gap-4">
                    <p className="font-bold text-[#1E5C58] text-xs md:text-sm leading-relaxed">
                      {q.question_number ? `${q.question_number}. ` : ""}{q.question_text}
                    </p>
                    <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl cursor-pointer hover:bg-white select-none">
                      <input
                        type="checkbox"
                        className="w-4.5 h-4.5 rounded text-[#2B7A75] accent-[#2B7A75] cursor-pointer"
                        checked={getValue(q.id) === "Ya"}
                        onChange={(e) => setAnswer(q.id, e.target.checked ? "Ya" : null)}
                      />
                      <span className="text-[10px] font-bold text-gray-400">Ya</span>
                    </label>
                  </div>
                ) : (
                  <>
                    <p className="font-bold text-[#1E5C58] text-xs md:text-sm mb-3 leading-relaxed">
                      {q.question_number ? `${q.question_number}. ` : ""}{q.question_text}
                    </p>

                    {q.answer_type === "radio3" && (
                      <div className="flex flex-col sm:flex-row sm:gap-6 gap-3">
                        {q.answer_options?.map((opt) => (
                          <label 
                            key={opt} 
                            className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none text-xs md:text-sm font-semibold ${
                              getValue(q.id) === opt 
                                ? "bg-teal-50/50 border-[#2B7A75]/35 text-[#1E5C58]" 
                                : "bg-white border-gray-200 text-gray-550 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name={q.id.toString()}
                              className="w-4.5 h-4.5 cursor-pointer accent-[#2B7A75]"
                              checked={getValue(q.id) === opt}
                              onChange={() => setAnswer(q.id, opt)}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {q.answer_type === "checkbox" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {q.answer_options?.map((opt) => (
                          <label 
                            key={opt} 
                            className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none text-xs md:text-sm font-semibold ${
                              getValue(q.id, "checkbox").includes(opt) 
                                ? "bg-teal-50/50 border-[#2B7A75] text-[#1E5C58] shadow-sm" 
                                : "bg-white border-gray-250 text-gray-650 hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="checkbox"
                              className="w-4.5 h-4.5 rounded cursor-pointer accent-[#2B7A75]"
                              checked={getValue(q.id, "checkbox").includes(opt)}
                              onChange={(e) => {
                                const old = getValue(q.id, "checkbox");
                                if (e.target.checked) setAnswer(q.id, [...old, opt]);
                                else setAnswer(q.id, old.filter((x: string) => x !== opt));
                              }}
                            />
                            {opt}
                          </label>
                        ))}
                      </div>
                    )}

                    {q.answer_type === "slider" && (
                      <div className="flex flex-col bg-gray-50/40 p-4 rounded-2xl border border-gray-100/50">
                        <div className="flex justify-between items-center mb-4">
                           <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skala Penilaian</span>
                           <span className="bg-[#2B7A75] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">{getValue(q.id, "slider")}</span>
                        </div>
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={getValue(q.id, "slider")}
                          onChange={(e) => setAnswer(q.id, Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#2B7A75]"
                        />
                        <div className="flex justify-between text-[11px] font-bold text-gray-450 mt-3 px-1">
                          <span className={getValue(q.id, "slider") === 1 ? "text-[#2B7A75]" : ""}>1</span>
                          <span className={getValue(q.id, "slider") === 2 ? "text-[#2B7A75]" : ""}>2</span>
                          <span className={getValue(q.id, "slider") === 3 ? "text-[#2B7A75]" : ""}>3</span>
                          <span className={getValue(q.id, "slider") === 4 ? "text-[#2B7A75]" : ""}>4</span>
                          <span className={getValue(q.id, "slider") === 5 ? "text-[#2B7A75]" : ""}>5</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between mt-10 gap-4 pt-6 border-t border-gray-100">
          <button
            type="button"
            onClick={goPrev}
            disabled={activeIdx === 0}
            className="px-6 py-3.5 rounded-2xl border border-gray-200 text-[#1E5C58] font-bold bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs order-2 sm:order-1 active:scale-95 cursor-pointer text-center"
          >
            Sebelumnya
          </button>

          <div className="flex flex-col sm:flex-row gap-3 order-1 sm:order-2">
            {activeIdx < lastIndex ? (
              <button
                type="button"
                onClick={goNext}
                className="px-10 py-3.5 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-2xl font-bold transition-all shadow-md shadow-teal-500/10 active:scale-95 text-xs w-full sm:w-auto cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Lanjutkan <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onSubmitAll}
                className="px-10 py-3.5 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-2xl font-bold transition-all shadow-md shadow-teal-500/10 active:scale-95 text-xs w-full sm:w-auto cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Simpan & Kirim Jawaban
              </button>
            )}
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronRight, ArrowLeft } from "lucide-react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { getParentAssessmentAnswers, ParentSubmitType } from "@/lib/api/asesmentTerapiOrtu";
import { getParentAssessmentQuestions, ParentAssessmentType } from "@/lib/api/asesmentTerapiOrtu";

type Q = { id: string; text: string; type?: string; options?: string[]; };
type Category = { id: string; title: string; type: string; questions: Q[]; };

function tryParseMaybeJson(v: any) {
  if (v === null || v === undefined) return undefined;
  if (Array.isArray(v) || typeof v === "object") return v;
  if (typeof v === "number") return v;
  if (typeof v !== "string") return v;
  try { return JSON.parse(v); } catch { return v; }
}

function OkupasiRiwayatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") || null;

  const [categories, setCategories] = useState<Category[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const lastIndex = categories.length - 1;
  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umumRiwayat" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapiRiwayat" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasiRiwayat" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicaraRiwayat" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagogRiwayat" },
  ];
  const activeStep = 2;

  useEffect(() => {
    const fetchAll = async () => {
      if (!assessmentId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const qRes = await getParentAssessmentQuestions("parent_okupasi" as ParentAssessmentType);
        const groups = qRes?.data?.groups ?? [];
        const aRes = await getParentAssessmentAnswers(assessmentId, "okupasi_parent" as ParentSubmitType);
        const list = aRes?.data ?? [];
        const fetchedAnswers: Record<string, any> = {};
        list.forEach((item: any) => {
          fetchedAnswers[String(item.question_id)] = item?.answer?.value !== undefined ? tryParseMaybeJson(item.answer.value) : null;
        });

        const builtCategories: Category[] = groups.map((g: any) => {
          const answerTypes = g.questions.map((q: any) => q.answer_type);
          let categoryType = "radio3";
          if (answerTypes.every((t: string) => t === "slider")) categoryType = "slider";
          else if (answerTypes.every((t: string) => t === "yes_only")) categoryType = "yes_only";
          else if (answerTypes.every((t: string) => t === "checkbox")) categoryType = "checkbox";
          return {
            id: String(g.group_id),
            title: g.title,
            type: categoryType,
            questions: g.questions.map((q: any) => ({
              id: String(q.id),
              text: q.question_text,
              type: q.answer_type,
              options: q.answer_options ?? [],
            })),
          };
        });

        setCategories(builtCategories);
        setAnswers(fetchedAnswers);
      } catch (err) {
        console.error("❌ ERROR fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [assessmentId]);

  const currentCategory = categories[activeIdx];
  const goNext = () => { if (activeIdx < lastIndex) setActiveIdx((i) => i + 1); };
  const goPrev = () => { if (activeIdx > 0) setActiveIdx((i) => i - 1); };

  const radioClass = "appearance-none w-4.5 h-4.5 rounded-full border border-gray-300 checked:bg-[#2B7A75] checked:border-[#2B7A75] relative before:content-['✔'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:text-[9px] cursor-not-allowed";
  const checkboxClass = "appearance-none w-4.5 h-4.5 rounded border border-gray-300 checked:bg-[#2B7A75] checked:border-[#2B7A75] relative before:content-['✔'] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:text-white before:text-[9px] cursor-not-allowed";

  const Radio3Table = ({ questions }: { questions: Q[] }) => {
    const opts = ["Ya", "Tidak", "Kadang-kadang"];
    return (
      <div className="w-full">
        {/* DESKTOP VIEW */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-xs md:text-sm border-separate border-spacing-y-2">
            <thead>
              <tr className="text-[#1E5C58] font-bold">
                <th className="text-left w-[55%] pb-2">Pertanyaan</th>
                {opts.map((opt) => (<th key={opt} className="text-center w-[15%] pb-2">{opt}</th>))}
              </tr>
            </thead>
            <tbody>
              {questions.map((q, idx) => {
                const val = answers[q.id];
                return (
                  <tr key={q.id} className="bg-gray-50/30 border border-gray-150 rounded-2xl">
                    <td className="py-3 px-4 text-[#1E5C58] font-bold text-xs md:text-sm rounded-l-2xl border-y border-l border-gray-100">{idx + 1}. {q.text}</td>
                    {opts.map((opt) => (
                      <td key={opt} className="text-center py-3 border-y border-gray-100 last:border-r last:rounded-r-2xl">
                        <input type="radio" checked={val === opt} readOnly disabled className={radioClass} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* MOBILE VIEW */}
        <div className="block md:hidden space-y-4">
          {questions.map((q, idx) => {
            const val = answers[q.id];
            return (
              <div key={q.id} className="p-4 rounded-2xl border border-gray-150 bg-gray-50/50">
                <p className="text-xs font-bold text-[#1E5C58] mb-3">{idx + 1}. {q.text}</p>
                <div className="flex justify-between items-center gap-2">
                  {opts.map((opt) => (
                    <div key={opt} className="flex flex-col items-center gap-1.5 flex-1">
                      <input type="radio" checked={val === opt} readOnly disabled className={radioClass} />
                      <span className="text-[10px] text-gray-550 font-semibold">{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const YesOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-3">
      {questions.map((q, i) => (
        <div key={q.id} className="flex justify-between items-center p-3.5 bg-gray-50/40 border border-gray-100 rounded-2xl gap-4">
          <span className="text-xs md:text-sm text-[#1E5C58] font-bold leading-relaxed">{i + 1}. {q.text}</span>
          <input type="checkbox" checked={answers[q.id] === "Ya" || answers[q.id] === true} readOnly disabled className={checkboxClass} />
        </div>
      ))}
    </div>
  );

  const SliderReadOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const value = typeof answers[q.id] === "number" ? Number(answers[q.id]) : 1;
        return (
          <div key={q.id} className="p-5 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
            <p className="text-xs md:text-sm text-[#1E5C58] mb-4 font-bold leading-relaxed">
              {i + 1}. {q.text}
            </p>
            <div className="bg-gray-50/40 p-4 rounded-xl border border-gray-100/50">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skala Penilaian</span>
                 <span className="bg-[#2B7A75] text-white px-3 py-1 rounded-lg text-xs font-bold shadow-sm">{value}</span>
              </div>
              <input type="range" min={1} max={5} step={1} value={value} readOnly className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-default accent-[#2B7A75]" />
              <div className="flex justify-between text-[11px] font-bold text-gray-455 mt-3 px-1">
                {[1, 2, 3, 4, 5].map((num) => (
                  <span key={num} className={value === num ? "text-[#2B7A75]" : ""}>{num}</span>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  const CheckboxReadOnlyList = ({ questions }: { questions: Q[] }) => (
    <div className="space-y-6">
      {questions.map((q, i) => {
        const selectedValues: string[] = Array.isArray(answers[q.id]) ? answers[q.id] : [];
        return (
          <div key={q.id} className="p-5 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] space-y-4">
            <p className="text-xs md:text-sm font-bold text-[#1E5C58] border-l-4 border-[#2B7A75] pl-3">{i + 1}. {q.text}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {q.options?.map((opt) => (
                <label key={opt} className={`flex items-center gap-3 p-3.5 rounded-xl border text-xs md:text-sm font-semibold select-none ${
                  selectedValues.includes(opt) 
                    ? "bg-teal-50/50 border-[#2B7A75] text-[#1E5C58] shadow-sm" 
                    : "bg-white border-gray-200 text-gray-450"
                }`}>
                  <input type="checkbox" checked={selectedValues.includes(opt)} readOnly disabled className={checkboxClass} />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Riwayat...</p>
      </div>
    );
  }
  if (!currentCategory) return <div className="p-10 text-center text-gray-500 font-semibold">Tidak ada data</div>;

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      {/* Header section with back & close actions */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6 text-[#1E5C58]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Riwayat: III. Terapi Okupasi</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Melihat kembali riwayat pengisian data aspek motorik kasar, motorik halus, dan sensorik anak Anda.</p>
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

      <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 w-full">
        {/* Header */}
        <div className="mb-6 md:mb-8 border-b border-gray-100 pb-4 flex items-center justify-between">
          <div>
            <h4 className="text-base md:text-lg font-extrabold text-[#1E5C58]">
              {currentCategory.title}
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

        {/* Category Content */}
        <div className="mb-8 animate-in fade-in duration-300">
          <div>
            {currentCategory.type === "yes_only" && <YesOnlyList questions={currentCategory.questions} />}
            {currentCategory.type === "radio3" && <Radio3Table questions={currentCategory.questions} />}
            {currentCategory.type === "slider" && <SliderReadOnlyList questions={currentCategory.questions} />}
            {currentCategory.type === "checkbox" && <CheckboxReadOnlyList questions={currentCategory.questions} />}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-between mt-8 gap-4 pt-6 border-t border-gray-100">
          <button
            onClick={goPrev}
            disabled={activeIdx === 0}
            className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl border border-gray-200 text-[#1E5C58] font-bold bg-white hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all text-xs order-2 sm:order-1 active:scale-95 cursor-pointer text-center"
          >
            <ArrowLeft size={14} />
            Sebelumnya
          </button>
          <button
            onClick={goNext}
            disabled={activeIdx === lastIndex}
            className="flex items-center justify-center gap-2 px-10 py-3.5 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-2xl font-bold transition-all shadow-md shadow-teal-500/10 active:scale-95 text-xs w-full sm:w-auto cursor-pointer text-center flex items-center justify-center gap-1.5 disabled:opacity-30 disabled:cursor-not-allowed order-1 sm:order-2"
          >
            Lanjutkan
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

export default function DataTerapiOkupasiPageReadOnly() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Halaman...</p>
      </div>
    }>
      <OkupasiRiwayatContent />
    </Suspense>
  );
}
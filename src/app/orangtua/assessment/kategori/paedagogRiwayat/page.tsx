/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ChevronRight, ArrowLeft } from "lucide-react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getParentAssessmentAnswers,
  ParentSubmitType,
  getParentAssessmentQuestions,
  ParentAssessmentType,
} from "@/lib/api/asesmentTerapiOrtu";

type AnswerItem = {
  question_id: string;
  question_text: string;
  answer_value: string | null;
  note: string | null;
  section_key: string;
  aspect_key: string;
};

type Aspect = { key: string; label: string; };

function PaedagogRiwayatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;

  const submitType: ParentSubmitType = "paedagog_parent";
  const questionType: ParentAssessmentType = "parent_paedagog";

  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<AnswerItem[]>([]);
  const [aspects, setAspects] = useState<Aspect[]>([]);
  const [activeAspectKey, setActiveAspectKey] = useState("");

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umumRiwayat" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapiRiwayat" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasiRiwayat" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicaraRiwayat" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagogRiwayat" },
  ];
  const activeStep = 4;

  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const questionRes = await getParentAssessmentQuestions(questionType);
        const groups = questionRes?.data?.groups || [];
        const aspectList: Aspect[] = groups.map((g: any) => ({
          key: g.group_key,
          label: g.title,
        }));

        const answerRes = await getParentAssessmentAnswers(assessmentId, submitType);
        const apiAnswers = answerRes?.data || [];

        const mergedAnswers: AnswerItem[] = apiAnswers.map((item: any) => {
          let aspect_key = "default";
          let section_key = "Lainnya";

          for (const group of groups) {
            const found = group.questions.find(
              (q: any) => String(q.id) === String(item.question_id)
            );
            if (found) {
              aspect_key = group.group_key;
              section_key = group.title;
              break;
            }
          }

          return {
            question_id: String(item.question_id),
            question_text: item.question_text,
            answer_value: item.answer?.value ?? null,
            note: item.note ?? null,
            aspect_key,
            section_key,
          };
        });

        setAspects(aspectList);
        setAnswers(mergedAnswers);
        setActiveAspectKey(aspectList[0]?.key || "default");
      } catch (error) {
        console.error("❌ Gagal load riwayat paedagog parent", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId, questionType, submitType]);

  const activeQuestions = answers.filter((q) => q.aspect_key === activeAspectKey);

  const sectionGroups: Record<string, AnswerItem[]> = {};
  activeQuestions.forEach((q) => {
    if (!sectionGroups[q.section_key]) sectionGroups[q.section_key] = [];
    sectionGroups[q.section_key].push(q);
  });

  const currentIndex = aspects.findIndex((a) => a.key === activeAspectKey);
  const handlePrevAspect = () => {
    if (currentIndex > 0) {
      setActiveAspectKey(aspects[currentIndex - 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const handleNextAspect = () => {
    if (currentIndex < aspects.length - 1) {
      setActiveAspectKey(aspects[currentIndex + 1].key);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Riwayat...</p>
      </div>
    );
  }

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      {/* Header section with back & close actions */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6 text-[#1E5C58]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Riwayat: V. Data Paedagog</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Melihat kembali riwayat pengisian kesiapan belajar, akademis, dan kemandirian perilaku anak Anda.</p>
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

      {/* ASPEK SELECT */}
      <div className="mb-6 flex justify-end">
        <div className="relative w-full sm:w-64">
          <select
            value={activeAspectKey}
            onChange={(e) => setActiveAspectKey(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs md:text-sm font-bold text-[#1E5C58] focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none w-full transition-all shadow-sm cursor-pointer"
          >
            {aspects.map((asp) => (
              <option key={asp.key} value={asp.key}>
                {asp.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#2B7A75] text-xs font-bold font-mono">▼</span>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 w-full space-y-8 animate-in fade-in duration-300">
        {Object.keys(sectionGroups).length > 0 ? (
          Object.keys(sectionGroups).map((section) => (
            <div key={section} className="space-y-4">
              <h3 className="font-extrabold text-[#1E5C58] text-base md:text-lg border-b border-gray-100 pb-3">
                {section}
              </h3>
              <div className="space-y-4">
                {sectionGroups[section].map((q, i) => (
                  <div key={q.question_id} className="p-5 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] space-y-3">
                    <p className="font-bold text-[#1E5C58] text-xs md:text-sm">
                      {i + 1}. {q.question_text}
                    </p>
                    <div className="w-full border border-gray-150 rounded-xl p-3.5 bg-gray-50/40 text-gray-700 text-xs md:text-sm shadow-inner min-h-[44px] flex items-center">
                      {q.answer_value ?? <span className="text-gray-400 italic">Belum dijawab</span>}
                    </div>
                    {q.note && (
                      <div className="mt-2.5 flex items-start gap-2 text-xs italic text-gray-400 ml-2">
                        <span className="font-bold text-[#2B7A75]">Catatan:</span>
                        <span>{q.note}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400 font-semibold text-sm">
            Tidak ada data riwayat untuk aspek ini.
          </div>
        )}
      </div>

      {/* ASPEK NAVIGATION */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4 border-t border-gray-50 pt-6">
        <button
          onClick={handlePrevAspect}
          disabled={currentIndex === 0}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs transition-all w-full sm:w-auto
            disabled:opacity-0 disabled:pointer-events-none bg-gray-100 text-gray-500 hover:bg-gray-250 cursor-pointer active:scale-95"
        >
          <ArrowLeft size={16} />
          Sebelumnya
        </button>

        <button
          onClick={handleNextAspect}
          disabled={currentIndex === aspects.length - 1}
          className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-2xl font-bold text-xs transition-all w-full sm:w-auto
            disabled:opacity-0 disabled:pointer-events-none bg-[#2B7A75] text-white hover:bg-[#1E5C58] shadow-md shadow-teal-500/10 active:scale-95 cursor-pointer"
        >
          Selanjutnya
          <ChevronRight size={16} />
        </button>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

export default function PaedagogFormPageReadOnly() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Riwayat...</p>
      </div>
    }>
      <PaedagogRiwayatContent />
    </Suspense>
  );
}
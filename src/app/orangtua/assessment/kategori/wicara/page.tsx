/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { X } from "lucide-react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";

import {
  getParentAssessmentQuestions,
  submitParentAssessment,
  ParentAssessmentType,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";

function TerapiWicaraContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assessmentId = searchParams.get("assessment_id") ?? "";

  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const parseSchema = (schema: any): any => {
    if (!schema) return {};
    try {
      if (typeof schema === "string") return JSON.parse(schema);
      return schema;
    } catch {
      return {};
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getParentAssessmentQuestions(
          "parent_wicara" as ParentAssessmentType
        );

        const q = res?.data?.groups?.[0]?.questions ?? [];
        setQuestions(q);
      } catch (err) {
        console.error("Fetch question error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (id: number, value: any) =>
    setAnswers((prev) => ({ ...prev, [id]: value }));

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];

  const activeStep = steps.findIndex((s) => pathname.includes(s.path));

  const resolveAnswerForWhen = (when: number | string) => {
    const whenNum = typeof when === "string" && /^\d+$/.test(when) ? Number(when) : when;
    if (typeof whenNum === "number" && answers[whenNum] !== undefined) {
      return answers[whenNum];
    }

    const whenStr = String(when);
    const found = questions.find((q: any) => {
      if (String(q.id) === whenStr) return true;
      if (q.question_id && String(q.question_id) === whenStr) return true;
      if (q.question_number && String(q.question_number) === whenStr) return true;
      if (q.question_code && String(q.question_code).includes(whenStr)) return true;
      return false;
    });

    if (!found) return undefined;

    return answers[found.id];
  };

  const shouldShowQuestion = (q: any) => {
    const schema = parseSchema(q.extra_schema);
    const rules = schema?.conditional_rules;
    if (!rules || !Array.isArray(rules)) return true;

    return rules.every((r: any) => {
      const rawAnswer = resolveAnswerForWhen(r.when);
      if (rawAnswer == null) return false;

      const val = typeof rawAnswer === "object" ? rawAnswer.status ?? rawAnswer : rawAnswer;

      if (r.operator === "==" || r.operator === "===") {
        return String(val) === String(r.value);
      }
      return String(val) === String(r.value);
    });
  };

  const handleSubmit = async () => {
    if (!assessmentId) return alert("Assessment ID tidak ditemukan");

    try {
      setSubmitting(true);

      const payload = {
        answers: questions
          .filter((q) => shouldShowQuestion(q))
          .map((q) => {
            const ans = answers[q.id];
            const schema = parseSchema(q.extra_schema);

            if (q.answer_type === "table") {
              const rows = schema.rows || [];
              const cols = schema.columns || [];

              const tableAnswer = rows.map((row: string) => {
                const rowAns: Record<string, any> = { kegiatan: row };
                cols.forEach((col: string) => {
                  rowAns[col] = ans?.[row]?.[col] ?? null;
                });
                return rowAns;
              });

              return {
                question_id: q.id,
                answer: {
                  value: tableAnswer,
                },
              };
            }

            if (q.answer_type === "radio") {
              const out = typeof ans === "object" ? ans.status ?? ans : ans ?? null;

              return {
                question_id: q.id,
                answer: {
                  value: out,
                },
              };
            }

            return {
              question_id: q.id,
              answer: {
                value: ans ?? null,
              },
            };
          }),
      };

      await submitParentAssessment(
        assessmentId,
        "wicara_parent" as ParentSubmitType,
        payload
      );

      alert("Jawaban berhasil disimpan!");
      router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`);
    } catch (err: any) {
      console.error("Submit error:", err);
      alert(err?.response?.data?.message || "Gagal submit jawaban");
    } finally {
      setSubmitting(false);
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

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      {/* Header section with back & close actions */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6 text-[#1E5C58]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">IV. Terapi Wicara</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Analisis kemampuan komunikasi verbal, non-verbal, dan artikulasi suara anak Anda.</p>
        </div>
        <button
          onClick={() => router.push(`/orangtua/assessment/kategori?assessment_id=${assessmentId}`)}
          className="flex items-center justify-center p-2.5 bg-white border border-teal-50 rounded-2xl hover:bg-gray-50 text-gray-400 hover:text-gray-600 shadow-sm transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
      </div>

      {/* Stepper - Horizontal Scroll pada Mobile */}
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

      {/* Konten Form Utama */}
      <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 w-full">
        {/* Grid 2 Column */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions.map((q) => {
            if (!shouldShowQuestion(q)) return null;

            const schema = parseSchema(q.extra_schema);

            const radioOptions =
              schema.options ||
              (q.answer_options ? JSON.parse(q.answer_options) : []);

            const tableRows = schema.rows || [];
            const tableColumns = schema.columns || [];
            
            const isFullWidth = q.answer_type === "textarea" || q.answer_type === "table";

            return (
              <div key={q.id} className={`p-4 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] animate-in fade-in duration-300 ${isFullWidth ? "col-span-full" : "col-span-full md:col-span-1"}`}>
                <label className="block font-bold text-[#1E5C58] text-xs md:text-sm leading-relaxed mb-3">
                  {q.question_number}. {q.question_text}
                </label>

                {/* Input Textarea */}
                {q.answer_type === "textarea" && (
                  <textarea
                    className="w-full border border-gray-200 rounded-xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white text-xs md:text-sm resize-y"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    placeholder="Tuliskan jawaban lengkap Anda di sini..."
                  />
                )}

                {/* Input Text Biasa */}
                {q.answer_type === "text" && (
                  <input
                    type="text"
                    className="w-full border border-gray-200 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white text-xs md:text-sm"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    placeholder="Masukkan jawaban singkat..."
                  />
                )}

                {/* Pilihan Radio Button */}
                {q.answer_type === "radio" && (
                  <div className="flex flex-col sm:flex-row sm:gap-6 gap-3">
                    {radioOptions.map((op: string) => (
                      <label 
                        key={op} 
                        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border cursor-pointer transition-all select-none text-xs md:text-sm font-semibold ${
                          answers[q.id] === op 
                            ? "bg-teal-50/50 border-[#2B7A75]/35 text-[#1E5C58]" 
                            : "bg-white border-gray-200 text-gray-550 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name={"q" + q.id}
                          value={op}
                          checked={answers[q.id] === op}
                          onChange={() => handleChange(q.id, op)}
                          className="accent-[#2B7A75] w-4.5 h-4.5 cursor-pointer"
                        />
                        {op}
                      </label>
                    ))}
                  </div>
                )}

                {/* Tabel Pertanyaan - Dioptimalkan untuk Mobile */}
                {q.answer_type === "table" && (
                  <div className="space-y-3 mt-3">
                    {tableRows.map((row: string, idx: number) => (
                      <div key={idx} className="flex flex-col md:flex-row md:items-center gap-3 p-3 bg-gray-50/50 rounded-2xl border border-gray-100/50">
                        <span className="text-xs md:text-sm font-semibold text-gray-755 md:w-72 leading-relaxed">{row}</span>

                        <div className="flex flex-1 gap-3">
                          {tableColumns.map((col: string) => (
                            <input
                              key={col}
                              type="text"
                              placeholder={col}
                              className="border border-gray-200 rounded-xl p-2.5 flex-1 text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none bg-white transition-all duration-200"
                              value={answers[q.id]?.[row]?.[col] || ""}
                              onChange={(e) =>
                                handleChange(q.id, {
                                  ...answers[q.id],
                                  [row]: {
                                    ...answers[q.id]?.[row],
                                    [col]: e.target.value,
                                  },
                                })
                              }
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-end mt-10 gap-3 border-t border-gray-50 pt-6">
          <button
            onClick={() => router.push(`/orangtua/assessment/kategori/okupasi?assessment_id=${assessmentId}`)}
            className="px-6 py-3.5 bg-gray-100 hover:bg-gray-200 text-[#1E5C58] rounded-2xl font-bold active:scale-95 transition-all w-full sm:w-auto text-xs cursor-pointer text-center"
          >
            Sebelumnya
          </button>
          <button
            className="bg-[#2B7A75] hover:bg-[#1E5C58] text-white px-10 py-3.5 rounded-2xl shadow-md shadow-teal-500/10 active:scale-95 transition-all font-bold text-xs disabled:opacity-50 w-full sm:w-auto cursor-pointer text-center"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
          </button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

export default function TerapiWicaraPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Halaman...</p>
      </div>
    }>
      <TerapiWicaraContent />
    </Suspense>
  );
}
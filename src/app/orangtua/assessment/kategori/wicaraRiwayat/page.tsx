/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, ArrowLeft } from "lucide-react";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getParentAssessmentAnswers,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";

function TerapiWicaraRiwayatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id") as string;
  const type: ParentSubmitType = "wicara_parent";

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!assessmentId) {
      setErrorMsg("assessment_id tidak ditemukan di URL.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await getParentAssessmentAnswers(assessmentId, type);

        if (!res.success) {
          setErrorMsg("Gagal mengambil data dari server.");
          setLoading(false);
          return;
        }

        const data = res.data;
        if (!Array.isArray(data)) {
          setErrorMsg("Format data jawaban tidak valid.");
          setLoading(false);
          return;
        }

        const parsed = data.map((q: any) => {
          const val = q.answer?.value;
          if (Array.isArray(val)) return { ...q, answer: val, answer_type: "table" };
          if (typeof val === "string") return { ...q, answer: val, answer_type: "textarea" };
          return { ...q, answer: "", answer_type: "textarea" };
        });

        setItems(parsed);
      } catch (err) {
        console.error("API ERROR:", err);
        setErrorMsg("Terjadi kesalahan saat memuat data.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [assessmentId]);

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umumRiwayat" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapiRiwayat" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasiRiwayat" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicaraRiwayat" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagogRiwayat" },
  ];
  const activeStep = 3;

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Riwayat...</p>
      </div>
    );
  }
  if (errorMsg) return <div className="p-10 text-center text-red-600 font-semibold">{errorMsg}</div>;

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      {/* Header section with back & close actions */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6 text-[#1E5C58]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Riwayat: IV. Terapi Wicara</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Melihat kembali riwayat pengisian data aspek komunikasi, artikulasi, dan pemahaman wicara anak Anda.</p>
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

      {/* CONTENT CARD */}
      <div className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 w-full animate-in fade-in duration-300">
        <h2 className="text-base md:text-lg font-extrabold text-[#1E5C58] mb-6 border-b border-gray-100 pb-4">
          Riwayat Terapi Wicara
        </h2>

        <div className="space-y-6 md:space-y-8">
          {items.map((q: any, index: number) => (
            <div key={index} className="p-5 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
              <label className="block font-bold text-[#1E5C58] mb-3.5 text-xs md:text-sm leading-relaxed">
                <span className="text-[#2B7A75]">{q.question_number || index + 1}.</span> {q.question_text}
              </label>

              {/* Textarea / Text field */}
              {(q.answer_type === "textarea" || q.answer_type === "text") && (
                <div className="bg-gray-50/40 border border-gray-150 rounded-xl p-4 text-gray-700 text-xs md:text-sm min-h-[100px] whitespace-pre-wrap leading-relaxed shadow-inner">
                  {q.answer || <span className="text-gray-405 italic">Tidak ada jawaban</span>}
                </div>
              )}

              {/* Table Style for Activities */}
              {q.answer_type === "table" && Array.isArray(q.answer) && (
                <div className="grid grid-cols-1 gap-3">
                  {q.answer.map((row: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50/40 border border-gray-100 rounded-xl gap-3 hover:bg-white hover:border-teal-50 transition-colors">
                      <span className="text-xs md:text-sm font-bold text-[#1E5C58]">
                        {row.kegiatan}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-gray-450 uppercase tracking-tight">Mampu pada usia:</span>
                        <span className="bg-teal-50/50 text-[#2B7A75] px-3.5 py-1.5 rounded-lg text-xs font-bold border border-[#2B7A75]/25">
                          {row.usia || "-"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 flex flex-col md:flex-row justify-between items-center pt-6 border-t border-gray-50 gap-4">
          <p className="text-xs text-gray-400 font-semibold order-2 md:order-1">
            Menampilkan data asesmen wicara yang tersimpan pada sistem Puspa.
          </p>
          <button
            className="w-full md:w-auto bg-[#2B7A75] hover:bg-[#1E5C58] text-white px-10 py-3.5 rounded-2xl font-bold shadow-md shadow-teal-500/10 transition-all active:scale-95 text-xs order-1 md:order-2 cursor-pointer text-center"
            onClick={() => router.back()}
          >
            Kembali ke Daftar
          </button>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

export default function TerapiWicaraPageReadOnly() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Halaman...</p>
      </div>
    }>
      <TerapiWicaraRiwayatContent />
    </Suspense>
  );
}
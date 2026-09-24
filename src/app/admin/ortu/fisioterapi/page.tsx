"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { getFisioParentAnswer } from "@/lib/api/riwayatAsesmentOrtu";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  LayoutList,
  MessageSquare,
  Target,
} from "lucide-react";

/* ======================= TYPES ======================= */
type AnswerItem = {
  question_id: string;
  question_text: string;
  answer: any;
  note: string | null;
};

export default function DataFisioterapiPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  /* ======================= STATE ======================= */
  const [dataRiwayat, setDataRiwayat] = useState<AnswerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ======================= FETCH ======================= */
  useEffect(() => {
    if (!assessmentId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getFisioParentAnswer(assessmentId);
        setDataRiwayat(res?.data || []);
      } catch (err: any) {
        console.error("Gagal fetch data:", err);
        setError(err.message || "Gagal mengambil data jawaban");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [assessmentId]);

  /* ======================= RENDER ANSWER ======================= */
  const renderAnswer = (answer: any) => {
    if (!answer)
      return <span className="text-gray-400 italic">Belum Ada Jawaban</span>;

    const badgeClass =
      "inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-[#E6F3F0] text-[#1E5C58] shadow-sm border border-teal-100";

    if (typeof answer === "object" && "value" in answer) {
      if (answer.value === "No" || answer.value === "Tidak") {
        return (
          <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 shadow-sm border border-amber-100">
            {answer.value}
          </span>
        );
      }
      return <span className={badgeClass}>{answer.value ?? "-"}</span>;
    }

    if (Array.isArray(answer)) {
      return (
        <div className="flex flex-wrap gap-2">
          {answer.map((item, idx) => (
            <React.Fragment key={idx}>
              {typeof item === "string" ? (
                <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-lg text-sm text-gray-700 font-medium">
                  {item}
                </span>
              ) : (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 w-full max-w-sm">
                  {Object.entries(item).map(([k, v]) => (
                    <div
                      key={k}
                      className="flex justify-between border-b border-gray-100 last:border-0 pb-1 mb-1 last:mb-0 last:pb-0"
                    >
                      <span className="text-xs text-gray-400 uppercase tracking-wider">
                        {k}
                      </span>
                      <span className="text-sm font-bold text-gray-700">
                        {String(v)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      );
    }

    if (typeof answer === "object") {
      return (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 w-full max-w-sm">
          {Object.entries(answer).map(([k, v]) => (
            <div
              key={k}
              className="flex justify-between border-b border-gray-100 last:border-0 pb-1.5 mb-1.5 last:mb-0 last:pb-0"
            >
              <span className="text-xs text-gray-400 uppercase tracking-wider">
                {k}
              </span>
              <span className="text-sm font-bold text-gray-700">
                {String(v)}
              </span>
            </div>
          ))}
        </div>
      );
    }

    // Normal Text
    if (String(answer) === "No" || String(answer) === "Tidak") {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold bg-amber-50 text-amber-700 shadow-sm border border-amber-100">
          {String(answer)}
        </span>
      );
    }
    if (String(answer) === "Yes" || String(answer) === "Ya") {
      return <span className={badgeClass}>{String(answer)}</span>;
    }

    return (
      <span className="text-sm font-semibold text-gray-700 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 inline-block">
        {String(answer)}
      </span>
    );
  };

  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/admin/jadwal_asesmen")}
              className="cursor-pointer p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-[#F4F9F8] hover:text-[#2B7A75] hover:border-teal-200 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
                <LayoutList className="w-6 h-6 text-[#2B7A75]" />
                Riwayat Jawaban (Orangtua)
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Tinjau kembali rincian data fisioterapi yang telah diisi oleh
                orangtua/wali.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main Content Area */}
          <div className="flex-1 space-y-6 min-w-0">
            {loading ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[50vh]">
                <div className="w-12 h-12 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
                <p className="font-medium text-gray-500">
                  Menyusun berkas data fisioterapi...
                </p>
              </div>
            ) : error ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[50vh] text-red-500">
                <CheckCircle2 className="w-12 h-12 mb-4 opacity-50" />
                <p>{error}</p>
              </div>
            ) : dataRiwayat.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[50vh]">
                <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                <p className="font-medium text-gray-500">
                  Belum ada jawaban Fisioterapi untuk asemen ini.
                </p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key="content-fisio"
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl shadow-[0_5px_30px_-15px_rgba(0,0,0,0.05)] border border-teal-50 overflow-hidden"
                >
                  <div className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F9F8]">
                    <h2 className="text-xl font-bold text-[#1E5C58] flex items-center gap-2">
                      Data Fisioterapi
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Menampilkan keseluruhan {dataRiwayat.length} butir daftar
                      pertanyaan dan isian.
                    </p>
                  </div>

                  <div className="p-6 md:p-8 space-y-6">
                    {dataRiwayat.map((item, index) => (
                      <div
                        key={item.question_id}
                        className="group flex flex-col gap-4 bg-white border border-gray-100 p-6 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-8 h-8 rounded-full bg-teal-50 text-[#2B7A75] font-bold flex items-center justify-center shrink-0 border border-teal-100 text-sm">
                            {index + 1}
                          </div>
                          <div className="w-full min-w-0">
                            <p className="font-semibold text-gray-800 text-sm leading-relaxed mb-4">
                              {item.question_text}
                            </p>

                            {/* Custom Render Output Box */}
                            <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 min-h-[60px] flex items-center">
                              {renderAnswer(item.answer)}
                            </div>

                            {/* Notes Block */}
                            {item.note && (
                              <div className="mt-4 flex items-start gap-2 bg-amber-50/50 p-3 rounded-xl border border-amber-100/50">
                                <MessageSquare className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                  <span className="font-bold">
                                    Catatan Orangtua:
                                  </span>{" "}
                                  {item.note}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-72 shrink-0">
            {!loading && dataRiwayat.length > 0 && (
              <div className="sticky top-6">
                <div className="bg-linear-to-br from-[#2B7A75] to-[#1E5C58] rounded-3xl p-6 text-white shadow-xl shadow-teal-500/20 relative overflow-hidden text-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />
                  <Target className="w-12 h-12 opacity-80 mx-auto mb-4" />
                  <p className="text-teal-50 font-semibold text-sm uppercase tracking-wider mb-2">
                    Total Butir SoaL
                  </p>
                  <div className="text-6xl font-black tabular-nums tracking-tight">
                    {dataRiwayat.length}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

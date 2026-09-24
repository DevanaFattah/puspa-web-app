"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getObservationDetail,
  getObservationQuestions,
} from "@/lib/api/observasiSubmit";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  LayoutList,
  MessageSquare,
  Target,
} from "lucide-react";

// ==================== TypeScript ====================
type Question = {
  id: number;
  question_code?: string;
  age_category?: string;
  question_number: number;
  question_text: string;
};

type AnswerDetail = {
  question_number: number;
  question_text: string;
  answer: number; // 0 | 1
  score_earned: number;
  note: string | null;
  question_code: string;
};

// Mapping kategori lengkap
const kategoriFullMap: Record<string, string> = {
  BPE: "Perilaku & Emosi",
  BFM: "Fungsi Motorik",
  BBB: "Bahasa & Bicara",
  BKA: "Kognitif & Atensi",
  BS: "Sosial & Emosi",
  APE: "Perilaku & Emosi",
  AFM: "Fungsi Motorik",
  ABB: "Bahasa & Bicara",
  AKA: "Kognitif & Atensi",
  AS: "Sosial & Emosi",
  RPE: "Perilaku & Emosi",
  RFM: "Fungsi Motorik",
  RBB: "Bahasa & Bicara",
  RKA: "Kognitif & Atensi",
  RS: "Sosial & Emosi",
  RK: "Kemandirian",
};

// ==================== Page ====================
export default function RiwayatJawabanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const observation_id =
    searchParams.get("observation_id") || searchParams.get("id") || "";

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<AnswerDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("");
  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      if (!observation_id) return setLoading(false);

      try {
        setLoading(true);

        // Ambil total skor dari detail completed
        const detailCompleted = await getObservationDetail(
          observation_id,
          "completed",
        );
        setTotalScore(Number(detailCompleted?.total_score || 0));

        // Ambil pertanyaan
        const questionData = await getObservationQuestions(observation_id);
        setQuestions(questionData || []);

        // Ambil jawaban dari API type=answer
        const answerRes = await getObservationDetail(observation_id, "answer");
        const answerDetails = answerRes?.answer_details || [];

        // Merge pertanyaan + jawabannya
        const merged: AnswerDetail[] = (questionData || []).map((q: any) => {
          const jawaban = answerDetails.find(
            (a: any) => Number(a.question_number) === Number(q.question_number),
          );

          return {
            question_number: Number(q.question_number),
            question_text: q.question_text,
            score_earned: Number(jawaban?.score_earned ?? 0),
            answer: Number(jawaban?.answer ?? 0),
            note: jawaban?.note ?? null,
            question_code: q.question_code ?? "UNK-0",
          };
        });

        setAnswers(merged);

        if (merged.length > 0) {
          const firstPrefix = (merged[0].question_code || "UNK-0").split(
            "-",
          )[0];
          setActiveTab(kategoriFullMap[firstPrefix] || firstPrefix);
        }
      } catch (err) {
        console.error("Gagal ambil data observasi:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [observation_id]);

  const groupedQuestions = useMemo(() => {
    return answers.reduce((acc: Record<string, AnswerDetail[]>, q) => {
      const prefix = (q.question_code || "UNK-0").split("-")[0];
      const kategori = kategoriFullMap[prefix] || prefix;
      if (!acc[kategori]) acc[kategori] = [];
      acc[kategori].push(q);
      return acc;
    }, {});
  }, [answers]);

  const kategoriList = Object.keys(groupedQuestions);

  const isKategoriComplete = (k: string) =>
    groupedQuestions[k]?.every(
      (q) => q.answer !== null && q.answer !== undefined,
    );

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
              onClick={() =>
                router.replace("/admin/jadwal_observasi?tab=selesai")
              }
              className="cursor-pointer p-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-[#F4F9F8] hover:text-[#2B7A75] hover:border-teal-200 transition-all shadow-sm group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
                <LayoutList className="w-6 h-6 text-[#2B7A75]" />
                Riwayat Jawaban Asesmen
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Tinjau kembali seluruh rincian jawaban observasi pasien yang
                telah diselesaikan.
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
                  Menyusun berkas jawaban...
                </p>
              </div>
            ) : answers.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center justify-center h-[50vh]">
                <MessageSquare className="w-16 h-16 text-gray-200 mb-4" />
                <p className="font-medium text-gray-500">
                  Tidak ada rekam jawaban yang ditemukan untuk observasi ini.
                </p>
              </div>
            ) : (
              <>
                {/* Tab Navigation / Stepper */}
                <div className="bg-white p-2.5 rounded-2xl shadow-sm border border-gray-100">
                  <div className="flex flex-wrap justify-center gap-2 p-1">
                    {kategoriList.map((k, i) => {
                      const isActive = activeTab === k;
                      const isComplete = isKategoriComplete(k);
                      return (
                        <button
                          key={k}
                          onClick={() => setActiveTab(k)}
                          className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all
                                                        ${
                                                          isActive
                                                            ? "bg-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                                                            : isComplete
                                                              ? "bg-[#E6F3F0] text-[#1E5C58] hover:bg-[#cbeae3]"
                                                              : "bg-gray-50 text-gray-400 border border-gray-100"
                                                        }
                                                    `}
                        >
                          <span
                            className={`flex items-center justify-center w-6 h-6 rounded-full text-xs
                                                        ${isActive ? "bg-white/20" : isComplete ? "bg-white" : "bg-gray-200/50"}
                                                    `}
                          >
                            {isComplete && !isActive ? (
                              <CheckCircle2 className="w-4 h-4 text-[#2B7A75]" />
                            ) : (
                              i + 1
                            )}
                          </span>
                          {k}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Form / Questions List */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial="initial"
                    animate="in"
                    exit="out"
                    variants={pageVariants}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-3xl shadow-[0_5px_30px_-15px_rgba(0,0,0,0.05)] border border-teal-50 overflow-hidden"
                  >
                    <div className="p-6 md:p-8 border-b border-gray-50 bg-[#F4F9F8]">
                      <h2 className="text-xl font-bold text-[#1E5C58] flex items-center gap-2">
                        {activeTab}
                      </h2>
                      <p className="text-sm text-gray-500 mt-1">
                        Menampilkan {groupedQuestions[activeTab]?.length || 0}{" "}
                        pertanyaan di kategori ini.
                      </p>
                    </div>

                    <div className="p-6 md:p-8 space-y-6">
                      {groupedQuestions[activeTab]?.map(
                        (q: AnswerDetail, idx: number) => {
                          const isYes = Number(q.answer) === 1;
                          const isNo = Number(q.answer) === 0;

                          return (
                            <div
                              key={q.question_number}
                              className="group flex flex-col md:flex-row gap-4 justify-between bg-white border border-gray-100 p-5 rounded-2xl hover:border-teal-200 hover:shadow-sm transition-all"
                            >
                              <div className="flex-1 flex items-start gap-4">
                                <div className="w-8 h-8 rounded-full bg-teal-50 text-[#2B7A75] font-bold flex items-center justify-center shrink-0 border border-teal-100 text-sm">
                                  {q.question_number}
                                </div>
                                <div className="w-full min-w-0">
                                  <p className="font-semibold text-gray-800 text-sm leading-relaxed mb-3">
                                    {q.question_text}
                                  </p>

                                  <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                    {/* Radio Simulator */}
                                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100 shrink-0">
                                      <div
                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors
                                                                            ${isYes ? "bg-[#2B7A75] text-white shadow-sm" : "text-gray-400 bg-transparent opacity-50"}`}
                                      >
                                        {isYes && (
                                          <CheckCircle2 className="w-4 h-4" />
                                        )}{" "}
                                        Ya
                                      </div>
                                      <div
                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-1.5 transition-colors
                                                                            ${isNo ? "bg-amber-500 text-white shadow-sm" : "text-gray-400 bg-transparent opacity-50"}`}
                                      >
                                        {isNo && (
                                          <CheckCircle2 className="w-4 h-4" />
                                        )}{" "}
                                        Tidak
                                      </div>
                                    </div>

                                    {/* Note Input */}
                                    <div className="flex-1 w-full relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MessageSquare className="h-4 w-4 text-gray-300" />
                                      </div>
                                      <input
                                        type="text"
                                        value={q.note || ""}
                                        readOnly
                                        placeholder="Tidak ada catatan tambahan."
                                        className="w-full pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium focus:outline-none placeholder-gray-400"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Score Badge */}
                              <div className="shrink-0 flex items-center md:items-start justify-end">
                                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/60 border border-amber-100 rounded-lg">
                                  <Target className="w-3.5 h-3.5 text-amber-500" />
                                  <span className="text-xs font-bold text-amber-700">
                                    Skor: {q.score_earned}
                                  </span>
                                </div>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>

                    {/* Bottom Navigation */}
                    <div className="p-6 md:p-8 border-t border-gray-50 bg-gray-50/30 flex justify-between items-center">
                      {kategoriList.indexOf(activeTab) > 0 ? (
                        <button
                          onClick={() =>
                            setActiveTab(
                              kategoriList[kategoriList.indexOf(activeTab) - 1],
                            )
                          }
                          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-100 transition-colors text-sm"
                        >
                          <ChevronLeft className="w-4 h-4" /> Sebelumnya
                        </button>
                      ) : (
                        <div />
                      )}

                      {kategoriList.indexOf(activeTab) <
                        kategoriList.length - 1 && (
                        <button
                          onClick={() =>
                            setActiveTab(
                              kategoriList[kategoriList.indexOf(activeTab) + 1],
                            )
                          }
                          className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B7A75] text-white font-bold text-sm hover:bg-[#1E5C58] shadow-md shadow-teal-500/20 transition-all active:scale-95"
                        >
                          Tahap Selanjutnya <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </>
            )}
          </div>

          {/* Right Sidebar - Score Card */}
          <div className="lg:w-72 shrink-0">
            {!loading && answers.length > 0 && (
              <div className="sticky top-6">
                <div className="bg-linear-to-br from-amber-400 to-amber-600 rounded-3xl p-6 text-white shadow-xl shadow-amber-500/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-2xl transform translate-x-1/3 -translate-y-1/3 pointer-events-none" />

                  <div className="relative z-10 flex flex-col items-center justify-center text-center py-4">
                    <p className="text-amber-50 font-semibold text-sm uppercase tracking-wider mb-2">
                      Total Akumulasi Skor
                    </p>
                    <div className="text-6xl font-black tabular-nums tracking-tight">
                      {totalScore}
                    </div>
                    <div className="mt-6 flex items-center gap-2 text-xs font-semibold bg-white/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/20">
                      <CheckCircle2 className="w-4 h-4" /> Penilaian Selesai
                    </div>
                  </div>
                </div>

                <div className="mt-4 bg-white p-5 rounded-2xl border border-teal-50 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
                    Informasi Singkat
                  </h3>
                  <ul className="text-sm space-y-3 font-medium text-gray-600">
                    <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span>Sesi Soal</span>
                      <span className="font-bold text-gray-800">
                        {kategoriList.length} Tahap
                      </span>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span>Total Soal</span>
                      <span className="font-bold text-gray-800">
                        {answers.length} Butir
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Inject Custom CSS for scrollbar if needed */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
                .custom-scrollbar::-webkit-scrollbar { height: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
            `,
        }}
      />
    </div>
  );
}

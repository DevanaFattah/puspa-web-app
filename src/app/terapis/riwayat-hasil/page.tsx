/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ClipboardList 
} from "lucide-react";
import {
  getObservationDetail,
  getObservationQuestions,
} from "@/lib/api/observasiSubmit";

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
  answer: number;
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

        const detailCompleted = await getObservationDetail(
          observation_id,
          "completed"
        );
        setTotalScore(Number(detailCompleted?.total_score || 0));

        const questionData = await getObservationQuestions(observation_id);
        setQuestions(questionData || []);

        const answerRes = await getObservationDetail(observation_id, "answer");
        const answerDetails = answerRes?.answer_details || [];

        const merged: AnswerDetail[] = (questionData || []).map((q: any) => {
          const jawaban = answerDetails.find(
            (a: any) =>
              Number(a.question_number) === Number(q.question_number)
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
          const firstPrefix = (merged[0].question_code || "UNK-0").split("-")[0];
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
      (q) => q.answer !== null && q.answer !== undefined
    );

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Riwayat Jawaban Observasi
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Hasil rekaman jawaban kuesioner observasi anak yang telah tersimpan.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/observasi/riwayat")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-medium">Memuat riwayat jawaban...</span>
        </div>
      ) : answers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <ClipboardList className="w-10 h-10 text-gray-300" />
          <span className="text-sm font-medium">Tidak ada jawaban untuk observasi ini</span>
        </div>
      ) : (
        <>
          {/* ================= STEPPER & SCORE PANEL ================= */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-white p-5 rounded-2xl border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.03)]">
            <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              {kategoriList.map((k, i) => {
                const isActive = activeTab === k;
                const sudahDiisi = isKategoriComplete(k);

                return (
                  <div key={k} className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setActiveTab(k)}
                      className={`cursor-pointer w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-[#1E5C58] text-white shadow-md shadow-[#1E5C58]/20"
                          : sudahDiisi
                          ? "bg-[#81B7A9] text-white"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {sudahDiisi && !isActive ? <Check className="w-4 h-4" /> : i + 1}
                    </button>
                    <span className={`text-xs font-semibold ${isActive ? "text-[#1E5C58] font-bold" : "text-gray-400"}`}>
                      {k}
                    </span>
                    {i < kategoriList.length - 1 && (
                      <span className="text-gray-300 mx-1">/</span>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="shrink-0 text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-4 py-2 rounded-full shadow-sm">
              Total Skor Observasi: {totalScore}
            </div>
          </div>

          {/* ================= ANSWERS LIST ================= */}
          <div className="space-y-6">
            {groupedQuestions[activeTab]?.map((q: AnswerDetail) => (
              <div 
                key={q.question_number} 
                className="p-5 bg-white rounded-2xl border border-teal-50/50 shadow-[0_4px_20px_rgba(30,92,88,0.02)] hover:shadow-[0_8px_30px_rgba(30,92,88,0.06)] transition-all duration-300"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <p className="font-bold text-gray-700 leading-relaxed text-sm md:text-base">
                      {q.question_number}. {q.question_text}
                    </p>
                    <span className="shrink-0 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                      Skor Diperoleh: {q.score_earned}
                    </span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <input
                      type="text"
                      className="w-full md:flex-1 border border-gray-100 rounded-xl px-4 py-2.5 text-xs md:text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      value={q.note || ""}
                      placeholder="Tidak ada keterangan tambahan"
                      readOnly
                    />
                    
                    <div className="flex items-center gap-5 shrink-0 bg-[#EAF4F2]/30 px-4 py-2 rounded-xl border border-teal-50/40">
                      <label className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-600 cursor-not-allowed opacity-80">
                        <input
                          type="radio"
                          checked={Number(q.answer) === 1}
                          readOnly
                          className="w-4 h-4 accent-[#1E5C58]"
                        />
                        <span>Ya</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-600 cursor-not-allowed opacity-80">
                        <input
                          type="radio"
                          checked={Number(q.answer) === 0}
                          readOnly
                          className="w-4 h-4 accent-[#1E5C58]"
                        />
                        <span>Tidak</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Navigation Actions */}
            <div className="flex justify-between items-center pt-4">
              <div>
                {kategoriList.indexOf(activeTab) > 0 && (
                  <button
                    onClick={() =>
                      setActiveTab(
                        kategoriList[
                          kategoriList.indexOf(activeTab) - 1
                        ]
                      )
                    }
                    className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#81B7A9] px-5 py-2.5 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-sm font-semibold"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Sebelumnya</span>
                  </button>
                )}
              </div>

              <div>
                {kategoriList.indexOf(activeTab) < kategoriList.length - 1 && (
                  <button
                    onClick={() =>
                      setActiveTab(
                        kategoriList[
                          kategoriList.indexOf(activeTab) + 1
                        ]
                      )
                    }
                    className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    <span>Lanjutkan</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

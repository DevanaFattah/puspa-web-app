/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  ClipboardList, 
  HelpCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import {
  submitObservation,
  getObservationQuestions,
} from "@/lib/api/observasiSubmit";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

type Question = {
  question_id: number;
  observation_id: number;
  question_text: string;
  score: number;
  question_code: string;
  age_category: string;
  question_number?: number;
};

type Answer = {
  jawaban?: boolean;
  keterangan?: string;
};

const kategoriMap: Record<string, string> = {
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

export default function FormObservasiPage() {
  const searchParams = useSearchParams();

  const pasien = {
    nama: searchParams.get("nama") || "",
    usia: searchParams.get("usia") || "",
    kategori: searchParams.get("kategori") || "",
    tglObservasi: searchParams.get("tglObservasi") || "",
    observation_id:
      searchParams.get("observation_id") || searchParams.get("id") || "",
  };

  const [questionsData, setQuestionsData] = useState<Question[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [step, setStep] = useState<"observasi" | "kesimpulan" | "review">(
    "observasi"
  );
  const [kesimpulan, setKesimpulan] = useState("");
  const [rekomendasiLanjutan, setRekomendasiLanjutan] = useState("");
  const [rekomendasiAssessment, setRekomendasiAssessment] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load questions
  useEffect(() => {
    const fetchData = async () => {
      if (!pasien.observation_id) {
        handleApiError(null, "Observation ID tidak ditemukan di URL.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getObservationQuestions(pasien.observation_id);
        if (Array.isArray(data) && data.length > 0) {
          setQuestionsData(data);
          const firstPrefix = data[0].question_code.split("-")[0];
          setActiveTab(kategoriMap[firstPrefix] || firstPrefix);
        } else {
          handleApiError(null, "Tidak ada pertanyaan untuk observasi ini.");
        }
      } catch (err) {
        console.error("Gagal mengambil data observasi:", err);
        handleApiError(err, "Terjadi kesalahan saat memuat data observasi.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pasien.observation_id]);

  // Group questions by category
  const groupedQuestions = questionsData.reduce(
    (acc: Record<string, Question[]>, q: Question) => {
      const prefix = q.question_code.split("-")[0];
      const kategori = kategoriMap[prefix] || prefix;
      if (!acc[kategori]) acc[kategori] = [];
      acc[kategori].push(q);
      return acc;
    },
    {}
  );

  const kategoriList = Object.keys(groupedQuestions);

  // Total Score
  const totalScore = questionsData.reduce((acc, q) => {
    const score = Number(q.score) || 0;
    if (answers[q.question_id]?.jawaban) return acc + score;
    return acc;
  }, 0);

  const handleChange = (id: number, field: keyof Answer, value: string | boolean) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleNext = () => {
    const pertanyaanKategori = groupedQuestions[activeTab];
    const belumDiisi = pertanyaanKategori.some(
      (q) => answers[q.question_id]?.jawaban === undefined
    );
    if (belumDiisi) {
      handleApiError(null, "Harap isi semua jawaban sebelum lanjut.");
      return;
    }
    const idx = kategoriList.indexOf(activeTab);
    if (idx < kategoriList.length - 1) setActiveTab(kategoriList[idx + 1]);
  };

  const handlePrev = () => {
    const idx = kategoriList.indexOf(activeTab);
    if (idx > 0) setActiveTab(kategoriList[idx - 1]);
  };

  const handleAssessmentChange = (value: string, checked: boolean) => {
    setRekomendasiAssessment((prev) => {
      if (checked) {
        return [...prev, value];
      } else {
        return prev.filter((v) => v !== value);
      }
    });
  };

  const handleSimpan = async () => {
    setSubmitting(true);

    const payload = {
      answers: Object.entries(answers).map(([id, ans]) => ({
        question_id: parseInt(id, 10),
        answer: ans.jawaban || false,
        note: ans.keterangan || "",
      })),
      conclusion: kesimpulan,
      recommendation: rekomendasiLanjutan,

      paedagog: rekomendasiAssessment.includes("(PLB) Paedagog"),
      okupasi: rekomendasiAssessment.includes("Terapi Okupasi"),
      wicara: rekomendasiAssessment.includes("Terapi Wicara"),
      fisio: rekomendasiAssessment.includes("Fisioterapi"),
    };

    try {
      const res = await submitObservation(pasien.observation_id, payload);
      if (res?.success) {
        showSuccessToast("Observasi berhasil disimpan! ✅");
        window.location.href = "/terapis/observasi/riwayat";
      } else {
        handleApiError(res, `Gagal menyimpan: ${res?.message || "Unknown error"} ❌`);
      }
    } catch (err) {
      console.error("Error saat menyimpan:", err);
      handleApiError(err, "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-4 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-3">
        <div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#1E5C58]">
            Form Observasi Klinis
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Lengkapi lembar observasi untuk: <span className="font-bold text-[#1E5C58]">{pasien.nama}</span> ({pasien.usia})
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/observasi")}
          className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs transition-all duration-300 shadow-sm"
        >
          <span>Kembali</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs font-semibold">Memuat pertanyaan form...</span>
        </div>
      ) : (
        <>
          {/* ================= STEPPER & SCORE PANEL ================= */}
          {step === "observasi" && kategoriList.length > 0 && (
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white p-4 rounded-xl border border-teal-50/60 shadow-sm">
              {/* Stepper Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 w-full lg:w-auto">
                {kategoriList.map((k, i) => {
                  const pertanyaanKategori = groupedQuestions[k];
                  const totalQs = pertanyaanKategori.length;
                  const answeredQs = pertanyaanKategori.filter(
                    (q) => answers[q.question_id]?.jawaban !== undefined
                  );
                  const isCompleted = answeredQs.length === totalQs;
                  const isActive = activeTab === k;

                  return (
                    <button
                      key={k}
                      onClick={() => setActiveTab(k)}
                      className={`cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-bold transition-all duration-300 shrink-0 ${
                        isActive
                          ? "bg-[#1E5C58] border-[#1E5C58] text-white shadow-sm"
                          : isCompleted
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800"
                          : "bg-[#EAF4F2]/30 border-teal-50/50 text-[#1E5C58]/80 hover:bg-white/80"
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isActive 
                          ? "bg-white text-[#1E5C58]" 
                          : isCompleted 
                          ? "bg-emerald-500 text-white" 
                          : "bg-teal-50 text-[#1E5C58]"
                      }`}>
                        {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : i + 1}
                      </span>
                      <span>{k}</span>
                      <span className={`text-[10px] font-normal ${isActive ? "text-white/80" : "text-gray-400"}`}>
                        ({answeredQs.length}/{totalQs})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Score Tag */}
              <div className="shrink-0 text-xs font-extrabold text-[#1E5C58] bg-[#EAF4F2] border border-teal-100/30 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
                <span>Total Skor Sementara:</span>
                <span className="bg-[#1E5C58] text-white px-2 py-0.5 rounded-md text-[11px] font-black">{totalScore}</span>
              </div>
            </div>
          )}
          {/* ================= STEP: OBSERVASI ================= */}
          {step === "observasi" && kategoriList.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {groupedQuestions[activeTab]?.map((q: Question) => {
                  const isAnswered = answers[q.question_id]?.jawaban !== undefined;
                  return (
                    <div 
                      key={q.question_id} 
                      className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col justify-between gap-3 ${
                        isAnswered 
                          ? "border-[#81B7A9]/40 bg-[#EAF4F2]/10 shadow-[0_2px_8px_rgba(30,92,88,0.02)]" 
                          : "border-gray-200 bg-white shadow-sm"
                      }`}
                    >
                      <div className="space-y-2.5">
                        <div className="flex justify-between items-start gap-4">
                          <p className="font-extrabold text-[#1E5C58] leading-relaxed text-xs md:text-sm">
                            {q.question_number}. {q.question_text}
                          </p>
                          <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-100">
                            Skor {q.score}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2.5 items-start sm:items-center">
                          <div className="relative w-full sm:flex-1">
                            <FileText className="absolute left-3 top-3.5 w-3.5 h-3.5 text-[#81B7A9]" />
                            <textarea
                              placeholder="Tambahkan catatan observasi..."
                              className="w-full pl-9 pr-4 py-2 border border-teal-100 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] shadow-sm hover:border-teal-200 transition-colors text-gray-700 font-semibold resize-none"
                              rows={2}
                              value={answers[q.question_id]?.keterangan || ""}
                              onChange={(e) =>
                                handleChange(q.question_id, "keterangan", e.target.value)
                              }
                            />
                          </div>
                          
                          {/* Tactile Toggle Buttons for Ya/Tidak */}
                          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
                            <button
                              type="button"
                              onClick={() => handleChange(q.question_id, "jawaban", true)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 flex items-center gap-1 cursor-pointer w-1/2 sm:w-auto justify-center ${
                                answers[q.question_id]?.jawaban === true
                                  ? "bg-emerald-600 border-emerald-600 text-white shadow-sm"
                                  : "bg-white border-teal-100 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700"
                              }`}
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Ya</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleChange(q.question_id, "jawaban", false)}
                              className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all duration-200 flex items-center gap-1 cursor-pointer w-1/2 sm:w-auto justify-center ${
                                answers[q.question_id]?.jawaban === false
                                  ? "bg-rose-600 border-rose-600 text-white shadow-sm"
                                  : "bg-white border-teal-100 text-gray-600 hover:bg-rose-50 hover:text-rose-700"
                              }`}
                            >
                              <X className="w-3.5 h-3.5" />
                              <span>Tidak</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Navigation Actions */}
              <div className="flex justify-between items-center pt-3">
                <div>
                  {activeTab !== kategoriList[0] && (
                    <button
                      onClick={handlePrev}
                      className="cursor-pointer inline-flex items-center gap-1 bg-white text-[#81B7A9] px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-50/20 transition-all text-xs font-bold"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Sebelumnya</span>
                    </button>
                  )}
                </div>

                <div className="flex gap-3">
                  {activeTab === kategoriList[kategoriList.length - 1] ? (
                    <button
                      onClick={() => {
                        const pertanyaanKategori = groupedQuestions[activeTab];
                        const belumDiisi = pertanyaanKategori.some(
                          (q) => answers[q.question_id]?.jawaban === undefined
                        );
                        if (belumDiisi) {
                          handleApiError(null, "Harap isi semua jawaban sebelum lanjut.");
                          return;
                        }
                        setStep("kesimpulan");
                      }}
                      className="cursor-pointer bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      Selesai Observasi
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="cursor-pointer inline-flex items-center gap-1 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                    >
                      <span>Lanjutkan</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP: KESIMPULAN & REKOMENDASI ================= */}
          {step === "kesimpulan" && (
            <div className="bg-white border border-teal-50/50 shadow-sm rounded-xl p-4 md:p-6 space-y-4 text-[#1E5C58]">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base md:text-lg font-extrabold tracking-tight">Evaluasi & Rekomendasi Akhir</h2>
                <p className="text-xs text-gray-400 mt-0.5">Lengkapi kesimpulan klinis hasil observasi untuk pasien.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Left side: Patient info & Checklists */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="bg-teal-50/20 border border-teal-100/30 rounded-xl p-3.5 space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#81B7A9]">Informasi Pasien</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="block text-[10px] text-gray-400">Nama Lengkap</span>
                        <span className="font-bold text-gray-700">{pasien.nama}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400">Usia / Tanggal Observasi</span>
                        <span className="font-bold text-gray-700">{pasien.usia} / {pasien.tglObservasi}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-teal-100/30 pt-2.5 mt-1">
                      <span className="text-xs font-bold text-gray-600">Total Akumulasi Skor</span>
                      <span className="bg-[#1E5C58] text-white px-2.5 py-1 rounded-lg text-xs font-black shadow-sm">{totalScore}</span>
                    </div>
                  </div>

                  {/* Checklist Rekomendasi Assessment */}
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">Rekomendasi Assessment Lanjutan</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {["(PLB) Paedagog", "Terapi Okupasi", "Terapi Wicara", "Fisioterapi"].map((item) => {
                        const isChecked = rekomendasiAssessment.includes(item);
                        return (
                          <label 
                            key={item} 
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors text-xs font-bold ${
                              isChecked
                                ? "bg-[#1E5C58] border-[#1E5C58] text-white shadow-sm"
                                : "bg-white border-teal-100/60 text-gray-700 hover:bg-teal-50/20"
                            }`}
                          >
                            <input
                              type="checkbox"
                              value={item}
                              checked={isChecked}
                              onChange={(e) => handleAssessmentChange(item, e.target.checked)}
                              className="w-3.5 h-3.5 accent-[#1E5C58]"
                            />
                            <span>{item}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Right side: Textareas */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">Kesimpulan Observasi</label>
                    <textarea
                      placeholder="Tuliskan kesimpulan evaluasi secara lengkap dan komprehensif..."
                      className="w-full border border-teal-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#81B7A9] hover:border-teal-200 transition-colors text-xs font-semibold text-gray-700 leading-relaxed"
                      rows={5}
                      value={kesimpulan}
                      onChange={(e) => setKesimpulan(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-gray-700 uppercase tracking-wider">Rekomendasi / Saran Lanjutan</label>
                    <textarea
                      placeholder="Tuliskan saran tindakan atau anjuran lanjutan untuk orang tua..."
                      className="w-full border border-teal-100 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-[#81B7A9] hover:border-teal-200 transition-colors text-xs font-semibold text-gray-700 leading-relaxed"
                      rows={4}
                      value={rekomendasiLanjutan}
                      onChange={(e) => setRekomendasiLanjutan(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setStep("observasi")}
                  className="cursor-pointer inline-flex items-center gap-1 bg-white text-[#81B7A9] px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-50/20 transition-all text-xs font-bold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={() => {
                    if (!kesimpulan.trim()) {
                      handleApiError(null, "Kesimpulan wajib diisi.");
                      return;
                    }
                    setStep("review");
                  }}
                  className="cursor-pointer inline-flex items-center gap-1 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all"
                >
                  <span>Lanjutkan</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP: REVIEW DATA ================= */}
          {step === "review" && (
            <div className="bg-white border border-teal-50/50 shadow-sm rounded-xl p-4 md:p-6 space-y-4 text-[#1E5C58]">
              <div className="border-b border-gray-100 pb-3">
                <h2 className="text-base md:text-lg font-extrabold tracking-tight">Review Hasil Observasi</h2>
                <p className="text-xs text-gray-400 mt-0.5">Periksa kembali data sebelum menyimpan ke database.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#EAF4F2]/30 border border-teal-50 rounded-xl p-3.5 text-xs font-bold">
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">Nama Pasien</span>
                  <span className="text-gray-700 text-sm font-bold">{pasien.nama}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">Tanggal Observasi</span>
                  <span className="text-gray-700 text-sm font-bold">{pasien.tglObservasi}</span>
                </div>
                <div>
                  <span className="block text-[9px] text-gray-400 uppercase">Akumulasi Skor</span>
                  <span className="text-teal-700 text-sm font-extrabold">{totalScore}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-4 space-y-1">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                    <FileText className="w-3.5 h-3.5 text-[#81B7A9]" />
                    <span>Kesimpulan Evaluasi</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                    {kesimpulan}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-4 space-y-1">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                      <AlertCircle className="w-3.5 h-3.5 text-[#81B7A9]" />
                      <span>Rekomendasi Lanjutan</span>
                    </div>
                    <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line font-medium">
                      {rekomendasiLanjutan || "Tidak ada rekomendasi tertulis"}
                    </p>
                  </div>

                  <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase">
                      <ClipboardList className="w-3.5 h-3.5 text-[#81B7A9]" />
                      <span>Rekomendasi Assessment Spesifik</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rekomendasiAssessment.length > 0 ? (
                        rekomendasiAssessment.map((rec) => (
                          <span key={rec} className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#EAF4F2] text-[#1E5C58]">
                            {rec}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-gray-500 font-medium italic">Tidak ada rekomendasi spesifik</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  onClick={() => setStep("kesimpulan")}
                  className="cursor-pointer inline-flex items-center gap-1 bg-white text-[#81B7A9] px-4 py-2 rounded-xl border border-teal-100 hover:bg-teal-50/20 transition-all text-xs font-bold"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Kembali</span>
                </button>
                <button
                  onClick={handleSimpan}
                  disabled={submitting}
                  className="cursor-pointer bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Hasil Observasi"}
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

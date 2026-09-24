/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronLeft, ArrowLeft, ClipboardCheck, MessageSquare, Award, Play } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getAssessmentAnswers } from "@/lib/api/asesment";

/* ================== RANGE UTAMA ================== */
const GROUP_RANGE: Record<string, [number, number]> = {
  "Pemeriksaan Umum": [316, 324],
  "Anamnesis Sistem": [325, 333],
  pemeriksaan_sensoris: [334, 340],
  pemeriksaan_refleks_primitif: [341, 356],
  gross_motor_pola_gerak: [357, 394],
  test_joint_laxity: [395, 399],
  pemeriksaan_spastisitas: [400, 405],
  pemeriksaan_kekuatan_otot: [406, 410],
  palpasi_otot: [411, 414],
  jenis_spastisitas: [415, 419],
  test_fungsi_bermain: [420, 426],
  "Diagnosa Fisioterapi": [427, 429],
};

/* ================== GROSS MOTOR ================== */
const GROSS_MOTOR_GROUPS = [
  { title: "Telentang", range: [357, 365] },
  { title: "Berguling", range: [366, 368] },
  { title: "Posisi Telungkup", range: [369, 375] },
  { title: "Posisi Duduk", range: [376, 383] },
  { title: "Posisi Berdiri", range: [384, 391] },
  { title: "Berjalan", range: [392, 394] },
];

export default function FisioterapiRiwayatPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");

  const [activeTab, setActiveTab] = useState("Pemeriksaan Umum");
  const [selectedKhusus, setSelectedKhusus] = useState("pemeriksaan_sensoris");
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { key: "Pemeriksaan Umum", label: "Pemeriksaan Umum" },
    { key: "Anamnesis Sistem", label: "Anamnesis Sistem" },
    { key: "pemeriksaan_khusus", label: "Pemeriksaan Khusus" },
  ];

  const pemeriksaanKhususList = [
    { key: "pemeriksaan_sensoris", label: "Pemeriksaan Sensoris" },
    { key: "pemeriksaan_refleks_primitif", label: "Pemeriksaan Reflek Primitif" },
    { key: "gross_motor_pola_gerak", label: "Gross Motor & Pola Gerak" },
    { key: "test_joint_laxity", label: "Test Joint Laxity" },
    { key: "pemeriksaan_spastisitas", label: "Pemeriksaan Spastisitas" },
    { key: "pemeriksaan_kekuatan_otot", label: "Pemeriksaan Kekuatan Otot" },
    { key: "palpasi_otot", label: "Palpasi Otot" },
    { key: "jenis_spastisitas", label: "Jenis Spastisitas" },
    { key: "test_fungsi_bermain", label: "Test Fungsi Bermain" },
    { key: "Diagnosa Fisioterapi", label: "Diagnosa Fisioterapi" },
  ];

  const tabIndex = tabs.findIndex((t) => t.key === activeTab);
  const khususIndex = pemeriksaanKhususList.findIndex((i) => i.key === selectedKhusus);

  /* ================== FETCH ================== */
  useEffect(() => {
    if (!assessmentId) return;
    getAssessmentAnswers(assessmentId, "fisio").then((res) => {
      setAnswers(Array.isArray(res) ? res : []);
      setLoading(false);
    });
  }, [assessmentId]);

  /* ================== FILTER ================== */
  const filteredQuestions = () => {
    let key = activeTab;
    if (activeTab === "pemeriksaan_khusus") key = selectedKhusus;
    const range = GROUP_RANGE[key];
    if (!range) return [];
    return answers
      .filter((q) => q.question_id >= range[0] && q.question_id <= range[1])
      .sort((a, b) => a.question_id - b.question_id);
  };

  /* ================== NAV LOGIC ================== */
  const handlePrev = () => {
    if (activeTab === "pemeriksaan_khusus" && khususIndex > 0) {
      setSelectedKhusus(pemeriksaanKhususList[khususIndex - 1].key);
      return;
    }
    if (tabIndex > 0) {
      const prevTab = tabs[tabIndex - 1].key;
      setActiveTab(prevTab);
      if (prevTab === "pemeriksaan_khusus") {
        setSelectedKhusus(pemeriksaanKhususList[pemeriksaanKhususList.length - 1].key);
      }
    }
  };

  const handleNext = () => {
    if (activeTab === "pemeriksaan_khusus" && khususIndex < pemeriksaanKhususList.length - 1) {
      setSelectedKhusus(pemeriksaanKhususList[khususIndex + 1].key);
      return;
    }
    if (tabIndex < tabs.length - 1) {
      const nextTab = tabs[tabIndex + 1].key;
      setActiveTab(nextTab);
      if (nextTab === "pemeriksaan_khusus") {
        setSelectedKhusus(pemeriksaanKhususList[0].key);
      }
    }
  };

  /* ================== PALPASI OTOT ================== */
  const renderPalpasiOtot = (ans: any) => {
    if (!ans || typeof ans !== "object") return "-";

    const rows = [
      { key: "hypertonus", label: "Hypertonus (spastic / rigid)" },
      { key: "hypotonus", label: "Hypotonus" },
      { key: "fluktuatif", label: "Fluktuatif" },
      { key: "normal", label: "Normal" },
    ];

    const renderDS = (rowKey: string, prefix: "aga" | "agb") => {
      const dKey = `${rowKey}_${prefix}_d`;
      const sKey = `${rowKey}_${prefix}_s`;
      const dVal = ans[dKey] ?? "";
      const sVal = ans[sKey] ?? "";

      return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
          {dVal && (
            <span className="inline-flex items-center gap-1 bg-teal-50 border border-teal-100 text-[#1E5C58] text-[9px] font-bold px-1.5 py-0.5 rounded">
              D: <span className="font-extrabold">{dVal}</span>
            </span>
          )}
          {sVal && (
            <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
              S: <span className="font-extrabold">{sVal}</span>
            </span>
          )}
        </div>
      );
    };

    return (
      <div className="overflow-x-auto border border-teal-100/40 rounded-xl shadow-sm mt-2 bg-white">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="bg-[#EAF4F2]/50 text-[#1E5C58] font-bold border-b border-teal-100/40">
              <th className="p-2.5 w-[40%] text-[10px] uppercase tracking-wider font-extrabold">Abnormalitas Tonus Otot</th>
              <th className="p-2.5 w-[20%] text-center text-[10px] uppercase tracking-wider font-extrabold">AGA</th>
              <th className="p-2.5 w-[20%] text-center text-[10px] uppercase tracking-wider font-extrabold">AGB</th>
              <th className="p-2.5 w-[20%] text-center text-[10px] uppercase tracking-wider font-extrabold">Perut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-50/60">
            {rows.map((row) => (
              <tr key={row.key} className="hover:bg-teal-50/10 transition-colors">
                <td className="p-2.5 font-bold text-gray-700">{row.label}</td>
                <td className="p-2.5 text-center">{renderDS(row.key, "aga")}</td>
                <td className="p-2.5 text-center">{renderDS(row.key, "agb")}</td>
                <td className="p-2.5 text-center">
                  {ans[`${row.key}_perut`] ? (
                    <span className="inline-block bg-amber-50 border border-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                      {ans[`${row.key}_perut`]}
                    </span>
                  ) : (
                    <span className="text-gray-400 font-medium">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  /* ================== RENDER ANSWER DEFAULT ================== */
  const renderAnswer = (q: any) => {
    const ans = q.answer;
    if (!ans) return <span className="text-gray-400 font-normal italic text-[11px]">Tidak ada jawaban</span>;

    return (
      <div className="space-y-2">
        {ans.value !== undefined && ans.value !== null && ans.value !== "" && (
          Array.isArray(ans.value) ? (
            <div className="flex flex-wrap gap-1">
              {ans.value.map((v: string, i: number) => (
                <span key={i} className="inline-block bg-teal-50 text-[#1E5C58] border border-teal-100/50 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                  {v}
                </span>
              ))}
            </div>
          ) : (
            <div className="font-bold text-gray-700 text-xs bg-teal-50/10 border border-teal-100/20 rounded-lg p-2.5 leading-relaxed">
              {ans.value}
            </div>
          )
        )}

        {ans.note && ans.note.trim() !== "" && (
          <div className="flex items-start gap-1.5 bg-gray-50/70 border border-gray-100 p-2 rounded-lg text-[10px] font-semibold text-gray-600">
            <MessageSquare className="w-3.5 h-3.5 text-[#81B7A9] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-gray-700">Catatan:</span> {ans.note}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ================== GROSS MOTOR ================== */
  const renderGrossMotor = (questions: any[]) => (
    <div className="space-y-4">
      {GROSS_MOTOR_GROUPS.map((g) => {
        const qs = questions.filter(
          (q) => q.question_id >= g.range[0] && q.question_id <= g.range[1]
        );
        if (qs.length === 0) return null;

        return (
          <div key={g.title} className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 space-y-3">
            <h4 className="font-extrabold text-xs text-[#1E5C58] tracking-wider uppercase border-b border-gray-100 pb-1.5">
              {g.title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {qs.map((q) => (
                <div key={q.question_id} className="bg-white p-3 rounded-lg border border-teal-50/60 shadow-sm flex flex-col justify-between gap-2.5">
                  <div>
                    <span className="inline-block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Gerakan</span>
                    <p className="text-[11px] md:text-xs font-bold text-[#1E5C58] leading-relaxed">
                      {q.question_text}
                    </p>
                  </div>
                  <div className="border-t border-gray-50 pt-2">
                    {renderAnswer(q)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#81B7A9] border-t-transparent"></div>
          <p className="text-sm font-semibold text-[#1E5C58]">Memuat riwayat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-4 text-[#1E5C58]">
      {/* HEADER & ACTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-teal-100/50 pb-3">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#81B7A9] uppercase tracking-wider">
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span>Riwayat Asesmen Fisioterapi</span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#1E5C58] mt-0.5">
            Fisioterapi ({activeTab === "pemeriksaan_khusus" ? selectedKhusus.replace(/_/g, " ").toUpperCase() : activeTab})
          </h1>
        </div>
        <button
          onClick={() => {
            const status = searchParams.get("status") || "completed";
            router.push(`/terapis/asessment?type=fisio&status=${status}`);
          }}
          className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(30,92,88,0.15)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.25)] hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar</span>
        </button>
      </div>

      {/* MAIN TABS CAPSULES */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#EAF4F2]/50 border border-teal-100/30 rounded-xl w-fit">
        {tabs.map((t) => {
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`cursor-pointer px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-[#1E5C58] text-white shadow-sm"
                  : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
              }`}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* SUB-ASPEK TABS FOR PEMERIKSAAN KHUSUS */}
      {activeTab === "pemeriksaan_khusus" && (
        <div className="flex flex-wrap gap-1.5 p-1.5 border border-teal-100/30 bg-[#EAF4F2]/30 rounded-xl">
          {pemeriksaanKhususList.map((i) => {
            const isSelected = selectedKhusus === i.key;
            return (
              <button
                key={i.key}
                onClick={() => setSelectedKhusus(i.key)}
                className={`cursor-pointer px-3 py-1 text-[10px] font-bold rounded-lg transition-all duration-300 ${
                  isSelected
                    ? "bg-[#81B7A9] text-white shadow-sm"
                    : "text-[#1E5C58]/80 hover:bg-white/40 hover:text-[#1E5C58]"
                }`}
              >
                {i.label}
              </button>
            );
          })}
        </div>
      )}

      {/* CONTENT CARD */}
      <div className="bg-white rounded-xl p-4 md:p-6 border border-teal-50 shadow-[0_4px_24px_rgba(30,92,88,0.02)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}|${selectedKhusus}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {activeTab === "pemeriksaan_khusus" && selectedKhusus === "gross_motor_pola_gerak" ? (
              renderGrossMotor(filteredQuestions())
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredQuestions().map((q) => {
                  const isPalpasi = q.question_id >= 411 && q.question_id <= 414;
                  return (
                    <div
                      key={q.question_id}
                      className={`p-3.5 rounded-xl border border-teal-50/60 shadow-sm flex flex-col justify-between gap-3 bg-white ${
                        isPalpasi ? "md:col-span-2" : ""
                      }`}
                    >
                      <div>
                        <span className="inline-block text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">
                          Pertanyaan / Aspek
                        </span>
                        <h3 className="text-[11px] md:text-xs font-extrabold text-[#1E5C58] leading-relaxed">
                          {q.question_text}
                        </h3>
                      </div>
                      <div className={isPalpasi ? "" : "border-t border-gray-50 pt-2"}>
                        {isPalpasi ? renderPalpasiOtot(q.answer) : renderAnswer(q)}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div className="flex items-center justify-between border-t border-teal-100/50 pt-4 mt-4">
        <button
          onClick={handlePrev}
          className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-bold bg-white border-teal-100 text-[#1E5C58] hover:bg-teal-50/20 transition-all duration-300"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Sebelumnya</span>
        </button>

        <span className="text-[10px] font-bold text-[#81B7A9] uppercase tracking-widest bg-teal-50/40 px-2.5 py-1 rounded-lg border border-teal-100/30">
          {activeTab === "pemeriksaan_khusus" ? `${khususIndex + 1} / ${pemeriksaanKhususList.length} (Khusus)` : `${tabIndex + 1} / ${tabs.length}`}
        </span>

        <button
          onClick={handleNext}
          className="cursor-pointer inline-flex items-center gap-1 px-3 py-2 rounded-xl border text-[10px] font-bold bg-white border-teal-100 text-[#1E5C58] hover:bg-teal-50/20 transition-all duration-300"
        >
          <span>Selanjutnya</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}


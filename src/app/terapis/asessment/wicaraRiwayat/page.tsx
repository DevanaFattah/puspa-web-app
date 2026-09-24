/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ArrowLeft, ClipboardCheck, MessageSquare, Check, X, FileText, CheckCircle2 } from "lucide-react";

import { 
  getAssessmentAnswers,
  getAssessmentQuestions
} from "@/lib/api/asesment";

/* ================== SUB GROUP LIDAH ================== */
const LIDAH_ASPEK = [
  { title: "Evaluasi Lidah (Istirahat)", range: [135, 139] },
  { title: "Evaluasi Lidah (Keluar)", range: [140, 144] },
  { title: "Evaluasi Lidah (Masuk)", range: [145, 148] },
  { title: "Evaluasi Lidah (Kanan)", range: [149, 151] },
  { title: "Evaluasi Lidah (Kiri)", range: [152, 154] },
  { title: "Evaluasi Lidah (Atas)", range: [155, 157] },
  { title: "Evaluasi Lidah (Bawah)", range: [158, 160] },
  { title: "Evaluasi Lidah (Alternatif)", range: [161, 163] },
];

/* ================== ORAL GROUP ================== */
const ORAL_GROUP_MAP = [
  { title: "Evaluasi Wajah", ids: [113, 114, 115, 116] },
  { title: "Evaluasi Rahang dan Gigi", ids: [117, 118, 119, 120, 121] },
  { title: "Observasi Gigi", ids: [122, 123, 124, 125, 126, 127] },
  { title: "Evaluasi Bibir", ids: [128, 129, 130, 131, 132, 133, 134] },
  { title: "Evaluasi Lidah", ids: [] },
  { title: "Evaluasi Faring", ids: [164, 165, 166] },
  {
    title: "Evaluasi Langit-langit Keras dan Lunak",
    ids: [167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180],
  },
];

/* ================== BAHASA ================== */
const BAHASA_GROUP_MAP = [
  { title: "Usia 0–6 Bulan", range: [181, 189] },
  { title: "Usia 7–12 Bulan", range: [190, 206] },
  { title: "Usia 13–18 Bulan", range: [207, 215] },
  { title: "Usia 19–24 Bulan", range: [216, 227] },
  { title: "Usia 2–3 Tahun", range: [228, 251] },
  { title: "Usia 3–4 Tahun", range: [252, 273] },
  { title: "Usia 4–5 Tahun", range: [274, 291] },
  { title: "Usia 5–6 Tahun", range: [292, 305] },
  { title: "Usia 6–7 Tahun", range: [306, 315] },
];

export default function RiwayatWicaraPage() {
  const router = useRouter();
  const tabs = ["Oral Fasial", "Kemampuan Bahasa"];
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [openSection, setOpenSection] = useState<number | null>(0);

  const [oralFasial, setOralFasial] = useState<any[]>([]);
  const [kemampuanBahasa, setKemampuanBahasa] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const params = useSearchParams();
  const assessmentId = params.get("assessment_id") || "";

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // 1. Ambil jawaban
      const answers = await getAssessmentAnswers(assessmentId, "wicara");

      // 2. Ambil questions
      const oralQ = await getAssessmentQuestions("wicara_oral");
      const bahasaQ = await getAssessmentQuestions("wicara_bahasa");

      // flatten questions
      const flatten = (groups: any[]) =>
        groups.flatMap((g) => g.questions || []);

      const oralQuestions = flatten(oralQ.groups);
      const bahasaQuestions = flatten(bahasaQ.groups);

      // 3. merge
      const merge = (questions: any[]) =>
        questions.map((q) => {
          const found = answers.find(
            (a: any) => Number(a.question_id) === Number(q.id)
          );

          return {
            question_id: q.id,
            question_text: q.question_text,
            answer: found?.answer ?? null,
            note: found?.note ?? null,
          };
        });

      const mergedOral = merge(oralQuestions);
      const mergedBahasa = merge(bahasaQuestions);

      /* ===== ORAL GROUP ===== */
      const oral = ORAL_GROUP_MAP.map((g) => {
        if (g.title === "Evaluasi Lidah") {
          return {
            title: g.title,
            aspek: LIDAH_ASPEK.map((a) => ({
              title: a.title,
              questions: mergedOral.filter((q) => {
                const id = Number(q.question_id);
                return id >= a.range[0] && id <= a.range[1];
              }),
            })),
          };
        }

        return {
          title: g.title,
          questions: mergedOral.filter((q) =>
            g.ids.includes(Number(q.question_id))
          ),
        };
      });

      /* ===== BAHASA GROUP ===== */
      const bahasa = BAHASA_GROUP_MAP
        .map((g) => ({
          title: g.title,
          questions: mergedBahasa.filter((q) => {
            const id = Number(q.question_id);
            return id >= g.range[0] && id <= g.range[1];
          }),
        }))
        .filter((g) =>
          g.questions.some(
            (q) => q.answer?.value !== null && q.answer?.value !== undefined
          )
        );

      setOralFasial(oral);
      setKemampuanBahasa(bahasa);
      setLoading(false);
    };

    if (assessmentId) load();
  }, [assessmentId]);

  const data = activeTab === "Oral Fasial" ? oralFasial : kemampuanBahasa;

  const getAnswerBadgeStyle = (val: string) => {
    const cleanVal = val.toLowerCase().trim();
    if (cleanVal === "normal" || cleanVal === "simetris" || cleanVal === "ada" || cleanVal === "bisa" || cleanVal === "cukup") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200/50";
    }
    if (cleanVal === "-" || cleanVal === "" || cleanVal === "tidak ada" || cleanVal === "tidak bisa") {
      return "bg-gray-50 text-gray-500 border-gray-200";
    }
    return "bg-amber-50 text-amber-700 border-amber-200/50";
  };

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
            <span>Riwayat Asesmen Wicara</span>
          </div>
          <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-[#1E5C58] mt-0.5">
            Terapi Wicara ({activeTab})
          </h1>
        </div>
        <button
          onClick={() => {
            const status = params.get("status") || "completed";
            router.push(`/terapis/asessment?type=wicara&status=${status}`);
          }}
          className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-3 py-2 rounded-xl text-xs transition-all duration-300 shadow-[0_4px_12px_rgba(30,92,88,0.15)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.25)] hover:-translate-y-0.5 self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar</span>
        </button>
      </div>

      {/* TABS CAPSULES */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-[#EAF4F2]/50 border border-teal-100/30 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setOpenSection(0);
            }}
            className={`cursor-pointer px-3 py-1.5 text-[10px] md:text-xs font-bold rounded-lg transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#1E5C58] text-white shadow-sm"
                : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ACCORDION LIST */}
      <div className="space-y-3">
        {data.map((section, i) => {
          const isCurrentOpen = openSection === i;

          return (
            <div
              key={i}
              className="bg-white rounded-xl border border-teal-50 shadow-[0_4px_24px_rgba(30,92,88,0.02)] overflow-hidden transition-all duration-300"
            >
              {/* ACCORDION HEADER */}
              <button
                onClick={() => setOpenSection(isCurrentOpen ? null : i)}
                className={`w-full flex justify-between items-center px-4 py-3 text-left transition-all ${
                  isCurrentOpen
                    ? "bg-[#1E5C58] text-white"
                    : "bg-[#EAF4F2]/30 text-[#1E5C58] hover:bg-[#EAF4F2]/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <FileText className={`w-4 h-4 ${isCurrentOpen ? "text-[#81B7A9]" : "text-[#1E5C58]/70"}`} />
                  <span className="font-extrabold text-xs md:text-sm tracking-wide">
                    {section.title}
                  </span>
                </div>
                <motion.div
                  animate={{ rotate: isCurrentOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 shrink-0" />
                </motion.div>
              </button>

              {/* ACCORDION CONTENT */}
              <AnimatePresence initial={false}>
                {isCurrentOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                  >
                    <div className="p-4 space-y-4 border-t border-teal-50 bg-white">
                      {/* ===== BAHASA (CHECKLIST MILESTONES) ===== */}
                      {activeTab === "Kemampuan Bahasa" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {section.questions.map((q: any) => {
                            const isChecked = !!q.answer?.value;
                            return (
                              <div
                                key={q.question_id}
                                className={`flex items-start gap-2.5 p-3 rounded-lg border transition-all ${
                                  isChecked
                                    ? "bg-emerald-50/35 border-emerald-100 text-emerald-800"
                                    : "bg-gray-50/50 border-gray-100 text-gray-500"
                                }`}
                              >
                                <div
                                  className={`w-4.5 h-4.5 rounded flex items-center justify-center shrink-0 border mt-0.5 ${
                                    isChecked
                                      ? "bg-emerald-500 border-emerald-500 text-white"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                </div>
                                <span className="text-[11px] md:text-xs font-bold leading-relaxed">
                                  {q.question_text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* ===== ORAL FASIAL ===== */}
                      {activeTab === "Oral Fasial" && (
                        <div className="space-y-4">
                          {/* Sub Aspek (Lidah has nested groups) */}
                          {section.aspek?.map((a: any, idx: number) => (
                            <div key={idx} className="space-y-3 bg-gray-50/40 p-4 rounded-xl border border-gray-100">
                              <h4 className="font-extrabold text-xs text-[#1E5C58] tracking-wider uppercase border-b border-gray-100 pb-1.5">
                                {a.title}
                              </h4>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {a.questions.map((q: any) => {
                                  const val = String(q.answer?.value ?? "-");
                                  return (
                                    <div
                                      key={q.question_id}
                                      className="bg-white p-3 rounded-lg border border-teal-50/60 shadow-sm flex flex-col justify-between gap-2.5"
                                    >
                                      <div>
                                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Pertanyaan</p>
                                        <p className="text-[11px] md:text-xs font-bold text-[#1E5C58] leading-relaxed">
                                          {q.question_text}
                                        </p>
                                      </div>

                                      <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-gray-50 pt-2">
                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${getAnswerBadgeStyle(val)}`}>
                                          {val}
                                        </span>
                                        {q.note && (
                                          <div className="flex items-center gap-1 text-[9px] text-gray-500 font-medium max-w-[65%] truncate" title={q.note}>
                                            <MessageSquare className="w-3 h-3 text-[#81B7A9] shrink-0" />
                                            <span className="truncate">{q.note}</span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          ))}

                          {/* Normal questions directly in section */}
                          {section.questions && section.questions.length > 0 && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {section.questions.map((q: any) => {
                                const val = String(q.answer?.value ?? "-");
                                return (
                                  <div
                                    key={q.question_id}
                                    className="bg-white p-3 rounded-lg border border-teal-50/60 shadow-sm flex flex-col justify-between gap-2.5"
                                  >
                                    <div>
                                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Aspek</p>
                                      <p className="text-[11px] md:text-xs font-bold text-[#1E5C58] leading-relaxed">
                                        {q.question_text}
                                      </p>
                                    </div>

                                    <div className="flex flex-wrap items-center justify-between gap-1.5 border-t border-gray-50 pt-2">
                                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold border capitalize ${getAnswerBadgeStyle(val)}`}>
                                        {val}
                                      </span>
                                      {q.note && (
                                        <div className="flex items-center gap-1 text-[9px] text-gray-500 font-medium max-w-[65%] truncate" title={q.note}>
                                          <MessageSquare className="w-3 h-3 text-[#81B7A9] shrink-0" />
                                          <span className="truncate">{q.note}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, Suspense } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

/* ================= TAB ================= */
const tabs = ["Oral Fasial", "Kemampuan Bahasa"] as const;
type TabType = (typeof tabs)[number];

/* ================= LIDAH ASPEK ================= */
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

/* ================= SAFE PARSE ================= */
const parseOptions = (opt: any): string[] => {
  if (Array.isArray(opt)) return opt;
  if (typeof opt === "string") {
    try {
      const parsed = JSON.parse(opt);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// --- KOMPONEN UTAMA (Wrapper dengan Suspense) ---
export default function AsesmenWicaraPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#F8FBFB] text-[#1E5C58]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#81B7A9] border-t-transparent"></div>
          <p className="text-sm font-semibold">Memuat Halaman Asesmen...</p>
        </div>
      </div>
    }>
      <AsesmenWicaraContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN ---
function AsesmenWicaraContent() {
  const params = useSearchParams();
  const router = useRouter();
  const assessmentId = params.get("assessment_id") || "";

  const [activeTab, setActiveTab] = useState<TabType>("Oral Fasial");
  const [openSection, setOpenSection] = useState<number | null>(0);
  const [sections, setSections] = useState<any[]>([]);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchData = async () => {
      const apiType =
        activeTab === "Oral Fasial" ? "wicara_oral" : "wicara_bahasa";

      const res = await getAssessmentQuestions(apiType);
      const groups = res?.groups ?? [];

      const mapped = groups.map((g: any) => {
        if (g.group_key === "tongue_eval") {
          return {
            title: g.title,
            group_key: g.group_key,
            aspek: LIDAH_ASPEK.map((a) => ({
              title: a.title,
              questions: g.questions
                .filter((q: any) => q.id >= a.range[0] && q.id <= a.range[1])
                .map((q: any) => ({
                  id: q.id,
                  label: q.question_text,
                  options: parseOptions(q.answer_options),
                })),
            })).filter((a) => a.questions.length > 0),
          };
        }

        return {
          title: g.title,
          group_key: g.group_key,
          questions: g.questions.map((q: any) => ({
            id: q.id,
            label: q.question_text,
            options: parseOptions(q.answer_options),
            age_category: q.age_category,
          })),
        };
      });

      setSections(mapped);

      /* ===== INIT RESPONSE ===== */
      if (activeTab === "Kemampuan Bahasa") {
        const init: Record<string, boolean> = {};
        mapped.forEach((s: any) => {
          s.questions?.forEach((q: any) => {
            init[`${s.group_key}-${q.id}`] = false;
          });
        });
        setResponses(init);
      } else {
        setResponses({});
        setNotes({});
      }

      setOpenSection(0);
    };

    fetchData();
  }, [activeTab]);

  /* ================= HANDLER ================= */
  const handleRadio = (key: string, value: string) =>
    setResponses((p) => ({ ...p, [key]: value }));

  const handleCheckbox = (key: string) =>
    setResponses((p) => ({ ...p, [key]: !p[key] }));

  const handleNote = (key: string, value: string) =>
    setNotes((p) => ({ ...p, [key]: value }));

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!assessmentId) {
      handleApiError(null, "assessment_id tidak ditemukan ❌");
      return;
    }

    const answers: any[] = [];

    sections.forEach((s) => {
      // ===== LIDAH ASPEK =====
      s.aspek?.forEach((a: any) =>
        a.questions.forEach((q: any) => {
          const k = `${s.group_key}-${q.id}`;

          const hasAnswer = responses[k] !== undefined && responses[k] !== null;
          const hasNote = notes[k] && notes[k].trim() !== "";

          if (hasAnswer || hasNote) {
            answers.push({
              question_id: q.id,
              answer: { value: hasAnswer ? responses[k] : null },
              note: hasNote ? notes[k] : "",
            });
          }
        })
      );

      // ===== GROUP NORMAL =====
      s.questions?.forEach((q: any) => {
        const k = `${s.group_key}-${q.id}`;

        if (activeTab === "Oral Fasial") {
          const hasAnswer = responses[k] !== undefined && responses[k] !== null;
          const hasNote = notes[k] && notes[k].trim() !== "";

          if (hasAnswer || hasNote) {
            answers.push({
              question_id: q.id,
              answer: { value: hasAnswer ? responses[k] : null },
              note: hasNote ? notes[k] : "",
            });
          }
        } else {
          // Bahasa
          if (responses[k] === true) {
            answers.push({
              question_id: q.id,
              answer: { value: true },
            });
          }
        }
      });
    });

    const payload = { answers };

    try {
      setLoading(true);
      await submitAssessment(assessmentId, "wicara", payload);

      if (activeTab === "Oral Fasial") {
        showSuccessToast("Jawaban Oral Fasial berhasil disimpan ✅");
        setActiveTab("Kemampuan Bahasa");
      } else {
        showSuccessToast("Jawaban Kemampuan Bahasa berhasil disimpan ✅");
        router.push("/terapis/asessment?type=wicara&status=completed");
      }
    } catch (err: any) {
      console.error("❌ Submit Wicara Assessment error:", err);

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan";

      if (status === 403) {
        handleApiError(err, "Anda tidak memiliki izin untuk menyimpan assessment ini. Pastikan login sebagai Asesor sesuai jenis terapi.");
        return;
      }

      if (status === 401) {
        handleApiError(err, "Sesi Anda telah berakhir. Silakan login kembali.");
        router.push("/auth/login");
        return;
      }

      handleApiError(err, "Gagal menyimpan: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Form Asesmen Terapi Wicara
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Lengkapi penilaian fungsi artikulasi dan kemampuan bahasa pasien.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/asessment")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {/* ================= TAB NAVIGATION ================= */}
      <div className="flex gap-2 p-1.5 bg-[#EAF4F2]/50 border border-teal-50/50 rounded-2xl w-fit">
        {tabs.map((t) => {
          const isActive = activeTab === t;
          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`cursor-pointer px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-[#1E5C58] text-white shadow-sm"
                  : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
              }`}
            >
              {t}
            </button>
          );
        })}
      </div>

      {/* ================= SECTIONS ACCORDION ================= */}
      <div className="space-y-3">
        {sections.map((s, i) => (
          <div 
            key={i} 
            className="bg-white rounded-xl border border-teal-100 shadow-[0_2px_12px_rgba(30,92,88,0.01)] overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenSection(openSection === i ? null : i)}
              className="cursor-pointer w-full px-4 py-2.5 bg-teal-50/30 text-[#1E5C58] flex justify-between items-center font-bold text-xs sm:text-sm border-b border-teal-100/50"
            >
              <span>{s.title}</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${openSection === i ? "rotate-180" : ""}`} />
            </button>

            {openSection === i && (
              <div className="p-4 space-y-4">
                
                {/* Evaluasi Lidah (Nested Sub-sections) */}
                {s.aspek?.map((a: any) => (
                  <div key={a.title} className="space-y-2.5">
                    <h4 className="font-extrabold text-xs text-[#1E5C58] border-l-4 border-[#81B7A9] pl-2.5">
                      {a.title}
                    </h4>
                    
                    <div className="grid grid-cols-1 gap-2">
                      {a.questions.map((q: any) => {
                        const k = `${s.group_key}-${q.id}`;
                        return (
                          <div 
                            key={q.id} 
                            className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs sm:text-sm"
                          >
                            <p className="font-bold text-gray-700 lg:w-2/5 shrink-0">{q.label}</p>
                            
                            <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center justify-end w-full">
                              <div className="flex flex-wrap gap-1">
                                {q.options.map((o: string) => {
                                  const isSelected = responses[k] === o;
                                  return (
                                    <button
                                      key={o}
                                      type="button"
                                      onClick={() => handleRadio(k, o)}
                                      className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                                        isSelected
                                          ? "bg-[#1E5C58] text-white border-[#1E5C58]"
                                          : "bg-white text-gray-500 border-teal-100 hover:bg-teal-50/40"
                                      }`}
                                    >
                                      {o}
                                    </button>
                                  );
                                })}
                              </div>
                              
                              <input
                                className="w-full sm:flex-1 border border-teal-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] bg-white"
                                placeholder="Catatan tambahan..."
                                value={notes[k] || ""}
                                onChange={(e) => handleNote(k, e.target.value)}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                {/* Normal Section Questions */}
                {s.questions && s.questions.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {s.questions.map((q: any) => {
                      const k = `${s.group_key}-${q.id}`;
                      return (
                        <div 
                          key={q.id} 
                          className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs sm:text-sm"
                        >
                          {activeTab === "Oral Fasial" ? (
                            <>
                              <p className="font-bold text-gray-700 lg:w-2/5 shrink-0">{q.label}</p>
                              
                              <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center justify-end w-full">
                                <div className="flex flex-wrap gap-1">
                                  {q.options.map((o: string) => {
                                    const isSelected = responses[k] === o;
                                    return (
                                      <button
                                        key={o}
                                        type="button"
                                        onClick={() => handleRadio(k, o)}
                                        className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                                          isSelected
                                            ? "bg-[#1E5C58] text-white border-[#1E5C58]"
                                            : "bg-white text-gray-500 border-teal-100 hover:bg-teal-50/40"
                                        }`}
                                      >
                                        {o}
                                      </button>
                                    );
                                  })}
                                </div>
                                
                                <input
                                  className="w-full sm:flex-1 border border-teal-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] bg-white"
                                  placeholder="Catatan tambahan..."
                                  value={notes[k] || ""}
                                  onChange={(e) => handleNote(k, e.target.value)}
                                />
                              </div>
                            </>
                          ) : (
                            <label className="flex gap-3 items-center cursor-pointer w-full py-0.5">
                              <input
                                type="checkbox"
                                checked={Boolean(responses[k])}
                                onChange={() => handleCheckbox(k)}
                                className="accent-[#1E5C58] w-4.5 h-4.5 shrink-0 rounded-md"
                              />
                              <span className="font-bold text-gray-700 text-sm">{q.label}</span>
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}
          </div>
        ))}
      </div>

      {/* ================= ACTION BUTTONS ================= */}
      <div className="flex justify-end pt-6 border-t border-gray-100">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
        >
          {loading ? (
            <span>Menyimpan...</span>
          ) : (
            <>
              <span>Simpan & Selesai</span>
              <Check className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
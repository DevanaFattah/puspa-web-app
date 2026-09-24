/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronDown, Check } from "lucide-react";

import { getAssessmentQuestions, submitAssessment } from "@/lib/api/asesment";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

export default function Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const assessmentId = searchParams.get("assessment_id");

  const [step, setStep] = useState(1);
  const [activeTab, setActiveTab] = useState("Pemeriksaan Umum");

  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [responses, setResponses] = useState<{ [key: string]: any }>({});

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
    { key: "diagnosa_fisioterapi", label: "Diagnosa Fisioterapi" },
  ];
  const [selectedKhusus, setSelectedKhusus] = useState(
    pemeriksaanKhususList[0].key
  );

  const khususIndex = pemeriksaanKhususList.findIndex(
    (i) => i.key === selectedKhusus
  );

  const tabs = ["Pemeriksaan Umum", "Anamnesis Sistem", "Pemeriksaan Khusus"];

  // ==========================
  // DEFINISI SUBKATEGORI GROSS MOTOR
  // ==========================
  const GM_PREFIX_MAP: Record<string, string> = {
    "gm_telentang": "Telentang",
    "gm_rolling": "Berguling",
    "gm_prone": "Posisi Telungkup",
    "gm_sitting": "Posisi Duduk",
    "gm_standing": "Posisi Berdiri",
    "gm_walk": "Berjalan",
  };

  useEffect(() => {
    if (!assessmentId) return;

    const load = async () => {
      setLoading(true);

      const data = await getAssessmentQuestions("fisio");
      const allGroups = data.groups || [];

      const baseGMGroup = allGroups.find(
        (g: any) => g.group_key === "gross_motor_pola_gerak"
      );

      let gmSubGroups: any[] = [];
      if (baseGMGroup) {
        gmSubGroups = Object.entries(GM_PREFIX_MAP).map(([prefix, title]) => {
          const questions = baseGMGroup.questions.filter((q: any) =>
            q.question_code.includes(prefix)
          );

          return {
            group_id: `${baseGMGroup.group_id}_${prefix}`,
            parent_group_key: "gross_motor_pola_gerak",
            group_key: prefix,
            title,
            questions,
          };
        });
      }

      const cleanedGroups = allGroups.filter(
        (g: any) => g.group_key !== "gross_motor_pola_gerak"
      );

      const finalGroups = [...cleanedGroups, ...gmSubGroups];

      setGroups(finalGroups);
      setLoading(false);
    };

    load();
  }, [assessmentId]);

  // ==============================
  // FILTER GROUPS PER TAB
  // ==============================
  const filteredGroups =
    activeTab === "Pemeriksaan Khusus"
      ? groups.filter(
          (g) =>
            g.group_key === selectedKhusus ||
            g.parent_group_key === selectedKhusus
        )
      : activeTab === "Pemeriksaan Umum"
      ? groups.filter((g) => g.group_key === "pemeriksaan_umum")
      : groups.filter((g) => g.group_key === "anamnesis_sistem");

  // ==============================
  // HANDLER INPUT
  // ==============================
  const getQKey = (q: any) => `q_${q.id}`;

  const handleCheck = (key: string, value: string) => {
    setResponses((prev) => {
      const arr = Array.isArray(prev[key]?.value)
        ? prev[key].value
        : [];
      const newArr = arr.includes(value)
        ? arr.filter((x: string) => x !== value)
        : [...arr, value];
      return { ...prev, [key]: { value: newArr } };
    });
  };

  const handleRadio = (key: string, value: string) => {
    setResponses((prev) => ({ ...prev, [key]: { value } }));
  };

  const handleText = (key: string, v: string) => {
    setResponses((prev) => ({ ...prev, [key]: { value: v } }));
  };

  const handleRadioWithText = (key: string, value: string, text?: string) => {
    setResponses((prev) => ({
      ...prev,
      [key]: { value, note: text || "" },
    }));
  };

  const handleMultiSegment = (key: string, segment: string, value: string) => {
    setResponses((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || {}), [segment]: value },
    }));
  };

  // ==============================
  // SUBMIT
  // ==============================
  const handleSubmit = async () => {
    if (!assessmentId) {
      handleApiError(null, "assessment_id tidak ditemukan ❌");
      return;
    }

    const answers = Object.keys(responses).map((key) => ({
      question_id: Number(key.replace("q_", "")),
      answer: responses[key],
    }));

    const payload = { answers };

    try {
      await submitAssessment(assessmentId, "fisio", payload);
      showSuccessToast("Assessment Fisioterapi berhasil disimpan! ✅");
      router.push(`/terapis/asessment?type=fisio&status=completed`);
    } catch (err: any) {
      console.error("❌ Submit Fisio Assessment error:", err);

      const status = err?.response?.status;
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Terjadi kesalahan";

      if (status === 403) {
        handleApiError(err, "Anda tidak memiliki izin untuk menyimpan assessment ini. Pastikan Anda login sebagai Asesor sesuai jenis terapi.");
        return;
      }

      if (status === 401) {
        handleApiError(err, "Sesi Anda telah berakhir. Silakan login kembali.");
        window.location.href = "/auth/login";
        return;
      }

      handleApiError(err, "Gagal menyimpan: " + message);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
        <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
        <span className="text-sm font-medium">Memuat pertanyaan fisioterapi...</span>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Form Asesmen Fisioterapi
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Lengkapi lembar pemeriksaan fisik, refleks, dan perkembangan motorik kasar anak.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/asessment")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-teal-100 shadow-[0_4px_24px_rgba(30,92,88,0.03)] hover:shadow-[0_8px_32px_rgba(30,92,88,0.06)] transition-shadow duration-300 space-y-6">
          <h2 className="text-lg font-bold text-[#1E5C58] border-b border-gray-100 pb-3">Pemeriksaan</h2>

          {/* Tabs */}
          <div className="flex gap-2 p-1.5 bg-[#EAF4F2]/50 border border-teal-50/50 rounded-2xl w-fit">
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`cursor-pointer px-5 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all duration-300 ${
                    isActive
                      ? "bg-[#1E5C58] text-white shadow-sm"
                      : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Pemeriksaan Khusus Selector */}
          {activeTab === "Pemeriksaan Khusus" && (
            <div className="mb-6 p-5 bg-teal-50/60 border border-teal-100 rounded-2xl space-y-2">
              <label className="text-xs font-extrabold text-[#1E5C58] uppercase tracking-wider block">
                Aspek Pemeriksaan Khusus
              </label>
              <div className="relative w-full">
                <select
                  value={selectedKhusus}
                  onChange={(e) => setSelectedKhusus(e.target.value)}
                  className="cursor-pointer appearance-none border border-teal-100 rounded-xl px-4 py-3 bg-white text-sm font-semibold text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-[#81B7A9] transition-all pr-10"
                >
                  {pemeriksaanKhususList.map((item) => (
                    <option key={item.key} value={item.key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-600 pointer-events-none" />
              </div>
            </div>
          )}

          {/* Pertanyaan */}
          {filteredGroups.length === 0 && (
            <div className="text-gray-400 py-6 text-center font-medium">Tidak ada pertanyaan pada grup ini.</div>
          )}

          {filteredGroups.map((section: any) => (
            <div key={section.group_id} className="space-y-4">
              <div className="px-5 py-3.5 bg-teal-50 border border-teal-100/80 rounded-xl text-[#1E5C58] font-bold text-sm md:text-base">
                {section.title}
              </div>

              <div className="space-y-4">
                {(section.questions ?? []).map((q: any) => {
                  const qKey = getQKey(q);
                  const options: string[] = q.answer_options
                    ? JSON.parse(q.answer_options)
                    : [];

                  return (
                    <div 
                      key={qKey} 
                      className="p-3 bg-teal-50/20 rounded-xl border border-teal-100/60 flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs sm:text-sm"
                    >
                      {section.group_key !== "palpasi_otot" && (
                        <div className="font-bold text-gray-700 lg:w-2/5 shrink-0 leading-relaxed">
                          {q.question_text}
                        </div>
                      )}

                      <div className="flex-1 flex flex-col sm:flex-row gap-3 items-center justify-end w-full">
                        {/* Checkbox */}
                        {q.answer_type === "checkbox" && (
                          <div className="flex gap-1.5 flex-wrap justify-end">
                            {options.map((opt) => {
                              const isChecked = responses[qKey]?.value?.includes(opt) || false;
                              return (
                                <label
                                  key={opt}
                                  className={`cursor-pointer flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                                    isChecked
                                      ? "bg-[#1E5C58] text-white border-[#1E5C58]"
                                      : "bg-white text-gray-500 border-teal-100 hover:bg-teal-50/40"
                                  }`}
                                >
                                  <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isChecked}
                                    onChange={() => handleCheck(qKey, opt)}
                                  />
                                  <span>{opt}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {/* Radio */}
                        {q.answer_type === "radio" && (
                          <div className="flex gap-1.5 flex-wrap justify-end">
                            {options.map((opt) => {
                              const isSelected = responses[qKey]?.value === opt;
                              return (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => handleRadio(qKey, opt)}
                                  className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                                    isSelected
                                      ? "bg-[#1E5C58] text-white border-[#1E5C58]"
                                      : "bg-white text-gray-500 border-teal-100 hover:bg-teal-50/40"
                                  }`}
                                >
                                  {opt}
                                </button>
                              );
                            })}
                          </div>
                        )}

                        {/* Radio with Text */}
                        {q.answer_type === "radio_with_text" && (
                          <div className="flex flex-col sm:flex-row gap-2 w-full justify-end items-center">
                            <div className="flex gap-1.5 flex-wrap justify-end shrink-0">
                              {options.map((opt) => {
                                const isSelected = responses[qKey]?.value === opt;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handleRadioWithText(qKey, opt, "")}
                                    className={`cursor-pointer px-3 py-1.5 rounded-lg text-xs font-bold border transition-all duration-200 ${
                                      isSelected
                                        ? "bg-[#1E5C58] text-white border-[#1E5C58]"
                                        : "bg-white text-gray-500 border-teal-100 hover:bg-teal-50/40"
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            <input
                              type="text"
                              className="w-full sm:flex-1 border border-teal-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] bg-white"
                              placeholder={
                                q.extra_schema
                                  ? JSON.parse(q.extra_schema).text_placeholder
                                  : "Catatan..."
                              }
                              value={responses[qKey]?.note || ""}
                              onChange={(e) =>
                                handleRadioWithText(
                                  qKey,
                                  responses[qKey]?.value || "",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        )}

                        {/* Text */}
                        {q.answer_type === "text" && (
                          <input
                            type="text"
                            className="w-full border border-teal-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] bg-white"
                            value={responses[qKey]?.value || ""}
                            placeholder="Keterangan..."
                            onChange={(e) => handleText(qKey, e.target.value)}
                          />
                        )}

                        {/* Textarea */}
                        {q.answer_type === "textarea" && (
                          <textarea
                            className="w-full border border-teal-100 rounded-lg p-3 text-xs focus:outline-none focus:ring-2 focus:ring-[#81B7A9] bg-white"
                            placeholder={
                              q.extra_schema
                                ? JSON.parse(q.extra_schema).placeholder
                                : "Detail..."
                            }
                            rows={
                              q.extra_schema
                                ? Math.min(3, JSON.parse(q.extra_schema).rows)
                                : 3
                            }
                            value={responses[qKey]?.value || ""}
                            onChange={(e) => handleText(qKey, e.target.value)}
                          />
                        )}
                      </div>

                      {/* Multi Segment – Palpasi Otot */}
                      {q.answer_type === "multi_segment" &&
                        q.extra_schema &&
                        section.group_key === "palpasi_otot" &&
                        q.id === section.questions[0].id && (() => {
                          const rows = [
                            { key: "hypertonus", label: "Hypertonus (spastic / rigid)" },
                            { key: "hypotonus", label: "Hypotonus" },
                            { key: "fluktuatif", label: "Fluktuatif" },
                            { key: "normal", label: "Normal" },
                          ];

                          const renderDS = (rowKey: string, prefix: "aga" | "agb") => (
                            <div className="flex flex-col gap-2">
                              {["d", "s"].map((side) => {
                                const segmentKey = `${rowKey}_${prefix}_${side}`;
                                return (
                                  <div key={segmentKey} className="flex items-center gap-2">
                                    <span className="w-5 text-right text-xs font-bold text-gray-400">
                                      {side.toUpperCase()}:
                                    </span>
                                    <input
                                      type="text"
                                      className="border border-teal-100 rounded-lg px-2.5 py-1 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-[#81B7A9] bg-white"
                                      value={responses[qKey]?.[segmentKey] || ""}
                                      onChange={(e) =>
                                        handleMultiSegment(qKey, segmentKey, e.target.value)
                                      }
                                    />
                                  </div>
                                );
                              })}
                            </div>
                          );

                          return (
                            <div className="bg-white rounded-xl border border-teal-100/80 overflow-x-auto shadow-sm w-full">
                              <div className="min-w-[500px]">
                                {/* HEADER */}
                                <div className="grid grid-cols-[2fr_1fr_1fr_2fr] font-bold text-xs uppercase tracking-wider text-teal-800 bg-teal-50 p-3 border-b border-teal-100">
                                  <div>Abnormalitas Tonus Otot</div>
                                  <div className="text-center">AGA</div>
                                  <div className="text-center">AGB</div>
                                  <div className="text-center">Perut</div>
                                </div>

                                {/* ISI */}
                                <div className="divide-y divide-teal-50">
                                  {rows.map((row) => (
                                    <div
                                      key={row.key}
                                      className="grid grid-cols-[2fr_1fr_1fr_2fr] gap-3 p-3 items-center"
                                    >
                                      <div className="font-semibold text-gray-700 text-xs">
                                        {row.label}
                                      </div>

                                      {/* AGA */}
                                      {renderDS(row.key, "aga")}

                                      {/* AGB */}
                                      {renderDS(row.key, "agb")}

                                      {/* PERUT */}
                                      <textarea
                                        className="border border-teal-100 rounded-lg px-2 py-1 w-full text-xs min-h-[40px] focus:outline-none focus:ring-1 focus:ring-[#81B7A9] bg-white"
                                        placeholder="Keterangan perut..."
                                        value={responses[qKey]?.[`${row.key}_perut`] || ""}
                                        onChange={(e) =>
                                          handleMultiSegment(qKey, `${row.key}_perut`, e.target.value)
                                        }
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}

                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* NAV BUTTON */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-100">
            <button
              onClick={() => {
                if (activeTab === "Pemeriksaan Khusus") {
                  if (khususIndex > 0) {
                    setSelectedKhusus(pemeriksaanKhususList[khususIndex - 1].key);
                    return;
                  }
                  setActiveTab("Anamnesis Sistem");
                  return;
                }
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex > 0) {
                  setActiveTab(tabs[currentIndex - 1]);
                }
              }}
              disabled={activeTab === tabs[0]}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#1E5C58] px-5 py-2.5 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>← Sebelumnya</span>
            </button>

            <button
              onClick={() => {
                if (activeTab === "Pemeriksaan Khusus") {
                  if (khususIndex < pemeriksaanKhususList.length - 1) {
                    setSelectedKhusus(pemeriksaanKhususList[khususIndex + 1].key);
                    return;
                  }
                  setStep(2);
                  return;
                }
                const currentIndex = tabs.indexOf(activeTab);
                if (currentIndex < tabs.length - 1) {
                  setActiveTab(tabs[currentIndex + 1]);
                } else {
                  setStep(2);
                }
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <span>Lanjutkan →</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-teal-100 shadow-[0_4px_24px_rgba(30,92,88,0.03)] hover:shadow-[0_8px_32px_rgba(30,92,88,0.06)] transition-shadow duration-300 space-y-6">
          <h2 className="text-xl font-bold text-[#1E5C58] border-b border-gray-100 pb-3">Diagnosa Fisioterapi</h2>
          <p className="text-sm text-gray-500 font-medium">
            Evaluasi parameter awal telah selesai. Klik tombol di bawah ini untuk menyimpan seluruh berkas rekam medis assessment.
          </p>

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={() => {
                setStep(1);
                setActiveTab(tabs[tabs.length - 1]);
              }}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-white text-[#1E5C58] px-5 py-2.5 rounded-xl border border-teal-100 hover:bg-teal-50/30 transition-all text-sm font-semibold"
            >
              <span>← Kembali</span>
            </button>

            <button
              onClick={handleSubmit}
              className="cursor-pointer inline-flex items-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white px-8 py-2.5 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
            >
              <span>Simpan & Selesai</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

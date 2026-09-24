/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  ChevronDown,
  X,
  User,
  Users,
  Baby,
  Calendar,
  MapPin,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  ClipboardList,
  Info
} from "lucide-react";

import {
  getParentAssessmentAnswers,
  ParentSubmitType,
} from "@/lib/api/asesmentTerapiOrtu";
import {
  getMyAssessments,
  getChildDetail,
} from "@/lib/api/childrenAsesment";

const parentGeneralRanges = [
  { group_key: "riwayat_psikososial", title: "Riwayat Psikososial", range: [430, 434] },
  { group_key: "riwayat_kehamilan", title: "Riwayat Kehamilan", range: [435, 442] },
  { group_key: "riwayat_kelahiran", title: "Riwayat Kelahiran", range: [443, 455] },
  { group_key: "riwayat_setelah_kelahiran", title: "Riwayat Setelah Kelahiran", range: [456, 468] },
  { group_key: "riwayat_kesehatan", title: "Riwayat Kesehatan", range: [469, 476] },
  { group_key: "riwayat_pendidikan", title: "Riwayat Pendidikan", range: [477, 485] },
];

function RiwayatJawabanOrangtuaContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get("assessment_id");
  const type = (searchParams.get("type") || "umum_parent") as ParentSubmitType;

  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [activeCategory, setActiveCategory] = useState<string>(
    parentGeneralRanges[0].group_key
  );
  const [familyInfo, setFamilyInfo] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const [aRes, myAssessments] = await Promise.all([
          getParentAssessmentAnswers(assessmentId, type),
          getMyAssessments(),
        ]);

        const answerMap: Record<string, any> = {};
        (aRes?.data || []).forEach((item: any) => {
          answerMap[item.question_id] = {
            value: item.answer?.value ?? item.answer ?? null,
            note: item.note ?? null,
            question_text: item.question_text,
            question_number: item.question_number,
          };
        });
        setAnswers(answerMap);

        const found = (myAssessments?.data || []).find(
          (x: any) => String(x.assessment_id) === String(assessmentId)
        );

        if (found?.child_id) {
          const detail = await getChildDetail(found.child_id);
          setFamilyInfo(detail);
        }
      } catch (err) {
        console.error("❌ Gagal memuat data riwayat:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [assessmentId, type]);

  const currentQuestions = Object.entries(answers)
    .filter(([id]) => {
      const numId = parseInt(id);
      const rangeObj = parentGeneralRanges.find(
        (g) => g.group_key === activeCategory
      );
      return rangeObj
        ? numId >= rangeObj.range[0] && numId <= rangeObj.range[1]
        : true;
    })
    .map(([id, val]) => ({ question_id: id, ...val }));

  const steps = [
    { label: "Data Umum", path: "/orangtua/assessment/kategori/data-umum" },
    { label: "Data Fisioterapi", path: "/orangtua/assessment/kategori/fisioterapi" },
    { label: "Data Terapi Okupasi", path: "/orangtua/assessment/kategori/okupasi" },
    { label: "Data Terapi Wicara", path: "/orangtua/assessment/kategori/wicara" },
    { label: "Data Paedagog", path: "/orangtua/assessment/kategori/paedagog" },
  ];
  const activeStep = 0;

  const categoryOrder = parentGeneralRanges.map((g) => g.group_key);
  const currentIndex = categoryOrder.indexOf(activeCategory);

  const goPrevCategory = () => {
    if (currentIndex > 0) {
      setActiveCategory(categoryOrder[currentIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goNextCategory = () => {
    if (currentIndex < categoryOrder.length - 1) {
      setActiveCategory(categoryOrder[currentIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderCellValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      const allNull = Object.values(value).every((v) => !v);
      return allNull ? "-" : JSON.stringify(value);
    }
    return value ?? "-";
  };

  const renderAnswer = (answer: any) => {
    if (!answer) return <span className="text-gray-400 italic">Belum diisi</span>;
    if (typeof answer === "string" || typeof answer === "number")
      return <span className="text-[#1E5C58] font-bold text-xs md:text-sm">{answer}</span>;

    if (Array.isArray(answer)) {
      if (!answer.length) return <span className="text-gray-400">-</span>;
      if (typeof answer[0] === "object") {
        const headers = Object.keys(answer[0]);
        return (
          <div className="overflow-x-auto my-2 rounded-2xl border border-gray-100">
            <table className="w-full text-xs text-left">
              <thead className="bg-gray-50/50 text-[#1E5C58] uppercase text-[10px] tracking-wider">
                <tr>
                  {headers.map((h) => (
                    <th key={h} className="px-4 py-3 font-extrabold border-b border-gray-100">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {answer.map((row, idx) => (
                  <tr key={idx} className="bg-white hover:bg-teal-50/10 transition-colors">
                    {headers.map((h) => (
                      <td key={h} className="px-4 py-3 text-gray-650 font-semibold">{renderCellValue(row[h])}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
      return (
        <ul className="list-disc pl-5 space-y-1 text-[#1E5C58] font-bold text-xs md:text-sm">
          {answer.map((v, i) => (
            <li key={i}>{v ?? "-"}</li>
          ))}
        </ul>
      );
    }

    if (typeof answer === "object") {
      const allNull = Object.values(answer).every((v) => !v);
      if (allNull) return <span className="text-gray-400">-</span>;
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-1">
          {Object.entries(answer).map(([k, v]) => (
            <div key={k} className="flex flex-col p-3 bg-white rounded-xl border border-gray-100/80 shadow-sm">
              <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-0.5">{k}</span>
              <span className="text-xs md:text-sm font-bold text-[#1E5C58]">{renderCellValue(v)}</span>
            </div>
          ))}
        </div>
      );
    }

    return <span className="text-xs md:text-sm font-semibold">{String(answer)}</span>;
  };

  const InfoRow = ({ label, value, icon: Icon }: any) => (
    <div className="flex flex-col space-y-1 p-3.5 bg-gray-50/30 rounded-2xl border border-gray-100/50 hover:bg-white hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] transition-all">
      <div className="flex items-center gap-2 text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">
        {Icon && <Icon size={12} className="text-[#2B7A75]" />}
        {label}
      </div>
      <div className="text-xs md:text-sm font-bold text-[#1E5C58] leading-tight">
        {value || "-"}
      </div>
    </div>
  );

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      {/* Header section with back & close actions */}
      <div className="flex flex-row items-center justify-between gap-4 mb-6 text-[#1E5C58]">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">Riwayat: I. Data Umum</h1>
          <p className="text-xs text-gray-400 font-semibold mt-0.5">Melihat kembali riwayat pengisian data umum dan identitas keluarga Anda.</p>
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
                  onClick={() => router.push(`/orangtua/assessment/kategori/${step.path.split("/").pop()}Riwayat?assessment_id=${assessmentId}`)}
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

      {/* IDENTITAS CARD */}
      <div className="bg-white p-6 md:p-8 rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] mb-8 overflow-hidden relative group">
        <div className="absolute top-0 left-0 w-2 h-full bg-[#2B7A75]" />

        <h3 className="font-extrabold text-[#1E5C58] mb-6 flex items-center gap-2 text-base md:text-lg">
          <Baby size={20} className="text-[#2B7A75]" />
          Identitas Anak & Keluarga
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <InfoRow label="Nama Anak" value={familyInfo.child_name} icon={User} />
          <InfoRow label="Tempat, Tgl Lahir" value={familyInfo.child_birth_info} icon={MapPin} />
          <InfoRow label="Usia / Gender" value={`${familyInfo.child_age || '-'} / ${familyInfo.child_gender === 'perempuan' ? 'P' : 'L'}`} icon={Calendar} />
          <InfoRow label="Agama" value={familyInfo.child_religion} icon={Users} />
          <InfoRow label="Sekolah" value={familyInfo.child_school} icon={BookOpen} />
          <div className="sm:col-span-2 lg:col-span-1">
            <InfoRow label="Alamat" value={familyInfo.child_address} icon={MapPin} />
          </div>
        </div>

        <h4 className="text-xs font-black text-[#2B7A75] uppercase tracking-widest border-l-4 border-[#2B7A75] pl-2 mb-4">Data Ayah</h4>
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <InfoRow label="Nama Ayah" value={familyInfo.father_name} />
          <InfoRow label="Pekerjaan" value={familyInfo.father_occupation} />
          <InfoRow label="Hubungan Dengan Anak" value={familyInfo.father_relationship} />
          <InfoRow label="Tanggal Lahir" value={familyInfo.father_birth_date} />
          <InfoRow label="Nomor Telepon" value={familyInfo.father_phone} />
          <InfoRow label="NIK" value={familyInfo.father_identity_number} />
        </div>

        <h4 className="text-xs font-black text-[#2B7A75] uppercase tracking-widest border-l-4 border-[#2B7A75] pl-2 mb-4">Data Ibu</h4>
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <InfoRow label="Nama Ibu" value={familyInfo.mother_name} />
          <InfoRow label="Pekerjaan" value={familyInfo.mother_occupation} />
          <InfoRow label="Hubungan Dengan Anak" value={familyInfo.mother_relationship} />
          <InfoRow label="Tanggal Lahir" value={familyInfo.mother_birth_date} />
          <InfoRow label="Nomor Telepon" value={familyInfo.mother_phone} />
          <InfoRow label="NIK" value={familyInfo.mother_identity_number} />
        </div>

        <h4 className="text-xs font-black text-[#2B7A75] uppercase tracking-widest border-l-4 border-[#2B7A75] pl-2 mb-4">Data Wali</h4>
        <div className="col-span-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoRow label="Nama Wali" value={familyInfo.guardian_name} />
          <InfoRow label="Pekerjaan" value={familyInfo.guardian_occupation} />
          <InfoRow label="Hubungan Dengan Anak" value={familyInfo.guardian_relationship} />
          <InfoRow label="Tanggal Lahir" value={familyInfo.guardian_birth_date} />
          <InfoRow label="Nomor Telepon" value={familyInfo.guardian_phone} />
          <InfoRow label="NIK" value={familyInfo.guardian_identity_number} />
        </div>
      </div>

      {/* FILTER KATEGORI */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h3 className="font-extrabold text-[#1E5C58]">Kategori Pertanyaan</h3>
        <div className="relative w-full sm:w-64">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-xs md:text-sm font-bold text-[#1E5C58] focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none w-full transition-all shadow-sm cursor-pointer"
          >
            {parentGeneralRanges.map((g) => (
              <option key={g.group_key} value={g.group_key}>{g.title}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#2B7A75] pointer-events-none" />
        </div>
      </div>

      {/* QUESTIONS LIST */}
      <section className="bg-white rounded-3xl border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] p-5 md:p-8 w-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-[#2B7A75] border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400 text-sm font-medium">Sinkronisasi data...</p>
          </div>
        ) : currentQuestions.length === 0 ? (
          <p className="py-12 text-center text-gray-400 font-semibold text-sm">Tidak ada jawaban di kategori ini.</p>
        ) : (
          <div className="space-y-6">
            {currentQuestions.map((q) => (
              <div key={q.question_id} className="p-5 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] group">
                <label className="block font-bold text-[#1E5C58] text-xs md:text-sm mb-3 leading-relaxed">
                  <span className="text-[#2B7A75] mr-1">{q.question_number ? `${q.question_number}. ` : ""}</span>
                  {q.question_text}
                </label>
                <div className="bg-gray-50/50 border border-gray-100 rounded-xl p-4 transition-colors group-hover:bg-white group-hover:border-teal-50 group-hover:shadow-sm">
                  {renderAnswer(q.value)}
                </div>
                {q.note && (
                  <div className="mt-2.5 flex items-start gap-2 text-xs italic text-gray-400 ml-2">
                    <Info size={14} className="mt-0.5 shrink-0 text-[#2B7A75]" />
                    <span>Catatan: {q.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* NAVIGATION BUTTONS */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 border-t border-gray-50 pt-6">
        <button
          onClick={goPrevCategory}
          disabled={currentIndex === 0}
          className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-xs transition-all w-full sm:w-auto
            disabled:opacity-0 disabled:pointer-events-none bg-gray-100 text-gray-500 hover:bg-gray-250 cursor-pointer active:scale-95"
        >
          <ArrowLeft size={16} />
          Sebelumnya
        </button>

        <button
          onClick={goNextCategory}
          disabled={currentIndex === categoryOrder.length - 1}
          className="flex items-center justify-center gap-2 px-10 py-3.5 rounded-2xl font-bold text-xs transition-all w-full sm:w-auto
            disabled:opacity-0 disabled:pointer-events-none bg-[#2B7A75] text-white hover:bg-[#1E5C58] shadow-md shadow-teal-500/10 active:scale-95 cursor-pointer"
        >
          Selanjutnya
          <ArrowRight size={16} />
        </button>
      </div>
    </ResponsiveOrangtuaLayout >
  );
}

export default function RiwayatJawabanOrangtua() {
  return (
    <Suspense fallback={
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-4">
        <div className="h-10 w-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
        <p className="text-gray-400 font-semibold animate-pulse text-sm">Memuat Halaman...</p>
      </div>
    }>
      <RiwayatJawabanOrangtuaContent />
    </Suspense>
  );
}
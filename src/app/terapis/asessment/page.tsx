/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, Suspense, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  Play, 
  Clock, 
  Search, 
  Calendar, 
  ClipboardList,
  Settings,
  AlertTriangle
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssessments } from "@/lib/api/asesment";
import { useTherapistProfile } from "@/context/ProfileTerapisContext";

// --- INTERFACES ---
type TerapiTab =
  | "PLB (Paedagog)"
  | "Terapi Okupasi"
  | "Terapi Wicara"
  | "Fisioterapi";

type StatusFilter = "Terjadwal" | "Selesai";

interface Assessment {
  id: number;
  assessment_id: number;
  child_id: string;
  child_name: string;
  guardian_name: string;
  guardian_phone: string;
  type: string;
  administrator: string;
  assessor: string | null;
  scheduled_date?: string;
  scheduled_time?: string;
  completed_at?: string; 
  status: string;
}

// --- KOMPONEN UTAMA (Wrapper dengan Suspense) ---
export default function AssessmentPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-[#F8FBFB] text-[#1E5C58]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#81B7A9] border-t-transparent"></div>
          <p className="text-sm font-semibold">Memuat Halaman Asesmen...</p>
        </div>
      </div>
    }>
      <AssessmentContent />
    </Suspense>
  );
}

// --- SUB-KOMPONEN KONTEN ---
function AssessmentContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { profile } = useTherapistProfile();

  const urlType = params.get("type");
  const urlStatus = params.get("status");

  const [activeTab, setActiveTab] = useState<TerapiTab>(() => {
    switch (urlType) {
      case "okupasi":
        return "Terapi Okupasi";
      case "wicara":
        return "Terapi Wicara";
      case "fisio":
        return "Fisioterapi";
      default:
        return "PLB (Paedagog)";
    }
  });
  const [activeFilter, setActiveFilter] = useState<StatusFilter>(
    urlStatus === "completed" ? "Selesai" : "Terjadwal"
  );
  const [dateFilter, setDateFilter] = useState("");
  const [searchName, setSearchName] = useState("");
  
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number } | null>(null);

  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [loading, setLoading] = useState(false);

  // Warning modal states
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pendingAssessmentId, setPendingAssessmentId] = useState<number | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const mappedStatus = activeFilter === "Terjadwal" ? "scheduled" : "completed";

  const getType = () => {
    switch (activeTab) {
      case "Terapi Okupasi":
        return "okupasi";
      case "Terapi Wicara":
        return "wicara";
      case "Fisioterapi":
        return "fisio";
      default:
        return "paedagog";
    }
  };

  useEffect(() => {
    router.replace(`?type=${getType()}&status=${mappedStatus}`);
  }, [activeFilter, activeTab]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, activeFilter, dateFilter, searchName]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        let data = await getAssessments(
          getType(),
          mappedStatus,
          dateFilter || undefined
        );

        if (Array.isArray(data)) {
          if (searchName.trim()) {
            const lower = searchName.toLowerCase();
            data = data.filter((item) =>
              String(item.child_name || "").toLowerCase().includes(lower)
            );
          }
          setAssessments(data);
        } else {
          setAssessments([]);
        }
      } catch (err) {
        console.error("❌ Error fetching assessments:", err);
        setAssessments([]);
      }

      setOpenDropdown(null);
      setLoading(false);
    };

    fetchData();
  }, [activeTab, activeFilter, dateFilter, searchName]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = () => setOpenDropdown(null);
    window.addEventListener("click", handleOutsideClick);
    return () => window.removeEventListener("click", handleOutsideClick);
  }, []);

  const handleStartAssessment = (id: number) => {
    const type = getType();

    // Check if therapist specialization matches the assessment type
    if (profile && profile.therapist_section) {
      const userSection = profile.therapist_section.toLowerCase(); // e.g. "okupasi"
      if (userSection !== type.toLowerCase()) {
        setPendingAssessmentId(id);
        setShowWarningModal(true);
        return;
      }
    }

    proceedToAssessment(id);
  };

  const proceedToAssessment = (id: number) => {
    const type = getType();
    router.push(
      `/terapis/asessment/${type}Asesment?assessment_id=${id}&status=${mappedStatus}`
    );
  };

  // Pagination logic
  const totalPages = Math.ceil(assessments.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    return assessments.slice(
      (page - 1) * itemsPerPage,
      page * itemsPerPage
    );
  }, [assessments, page]);

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">


      {/* ================= TAB TERAPI ================= */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 p-1.5 bg-[#EAF4F2]/50 border border-teal-50/50 rounded-2xl w-full lg:w-fit">
        {(
          [
            "PLB (Paedagog)",
            "Terapi Okupasi",
            "Terapi Wicara",
            "Fisioterapi",
          ] as TerapiTab[]
        ).map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`cursor-pointer px-3 py-2.5 lg:px-4 text-[11px] lg:text-sm font-semibold rounded-xl text-center transition-all duration-300 w-full lg:w-auto ${
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

      {/* ================= FILTERS ================= */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative w-full sm:w-64">
          <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81B7A9]" />
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-teal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] shadow-[0_2px_8px_rgba(30,92,88,0.02)] hover:border-teal-200 transition-colors"
          />
        </div>

        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81B7A9]" />
          <input
            type="text"
            placeholder="Cari nama anak..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-teal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] shadow-[0_2px_8px_rgba(30,92,88,0.02)] hover:border-teal-200 transition-colors"
          />
        </div>
      </div>

      {/* ================= STATUS FILTER ================= */}
      <div className="flex border-b border-teal-100/50">
        {(["Terjadwal", "Selesai"] as StatusFilter[]).map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`cursor-pointer pb-3 px-6 text-sm font-bold transition-all relative ${
                isActive ? "text-[#1E5C58]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <span>{filter}</span>
              {isActive && (
                <motion.div
                  layoutId="activeStatusLine"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1E5C58]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ================= TABLE LIST ================= */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Memuat data asesmen...</span>
        </div>
      ) : assessments.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.03)] flex flex-col items-center justify-center gap-3 text-gray-400">
          <ClipboardList className="w-10 h-10 text-gray-300" />
          <span className="text-sm font-medium">Tidak ada data asesmen</span>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}|${activeFilter}|${dateFilter}|${searchName}|${page}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-2xl p-6 md:p-8 border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.03)] hover:shadow-[0_8px_32px_rgba(30,92,88,0.06)] transition-shadow duration-300"
          >
            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                    <th className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-wider">Nama Pasien</th>
                    <th className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-wider">Nama Orang Tua</th>
                    <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Telepon</th>
                    <th className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-wider">Tipe Assessment</th>
                    <th className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-wider">
                      {activeFilter === "Selesai" ? "Assessor" : "Administrator"}
                    </th>
                    <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Tanggal Asesmen</th>
                    <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Waktu</th>
                    <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedData.map((item) => (
                    <tr key={item.assessment_id} className="hover:bg-[#EAF4F2]/20 transition-colors">
                      <td className="py-4 px-4 font-bold text-gray-700">{item.child_name}</td>
                      <td className="py-4 px-4 text-gray-600 font-medium">{item.guardian_name}</td>
                      <td className="py-4 px-4 text-center text-gray-600 font-mono text-xs">{item.guardian_phone}</td>
                      <td className="py-4 px-4 text-gray-600 font-medium">{item.type}</td>
                      <td className="py-4 px-4 text-gray-600 font-medium">
                        {activeFilter === "Selesai" ? item.assessor : item.administrator}
                      </td>
                      <td className="py-4 px-4 text-center text-gray-500 font-medium">{item.scheduled_date}</td>
                      <td className="py-4 px-4 text-center text-gray-500 font-medium">
                        {activeFilter === "Selesai" ? item.completed_at : item.scheduled_time}
                      </td>
                      <td className="py-4 px-4 text-center relative">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            const rect = e.currentTarget.getBoundingClientRect();
                            setOpenDropdown(openDropdown === item.assessment_id ? null : item.assessment_id);
                            setDropdownPosition({
                              top: rect.bottom + 6 + window.scrollY,
                              left: rect.left - 120 + window.scrollX,
                            });
                          }}
                          className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 border border-teal-100 rounded-lg text-[#1E5C58] hover:bg-teal-50/40 text-xs font-semibold transition-colors"
                        >
                          <Settings size={14} />
                          <span>Aksi</span>
                          <ChevronDown size={12} />
                        </button>

                        {openDropdown === item.assessment_id && dropdownPosition && (
                          <div
                            onClick={(e) => e.stopPropagation()}
                            className="fixed z-[9999] mt-2 w-48 rounded-xl bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-teal-50/80 overflow-hidden py-1 text-[#1E5C58]"
                            style={{
                              top: dropdownPosition.top,
                              left: dropdownPosition.left,
                            }}
                          >
                            {activeFilter === "Terjadwal" ? (
                              <>
                                <button
                                  onClick={() => handleStartAssessment(item.assessment_id)}
                                  className="cursor-pointer flex items-center w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-teal-50/30 hover:text-[#1E5C58] transition-colors"
                                >
                                  <Play size={16} className="mr-2 text-[#81B7A9]" />
                                  Mulai
                                </button>
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/terapis/asessment/detailAsesment?assessment_id=${item.assessment_id}&type=${getType()}&status=${mappedStatus}`
                                    )
                                  }
                                  className="cursor-pointer flex items-center w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-teal-50/30 hover:text-[#1E5C58] transition-colors"
                                >
                                  <Clock size={16} className="mr-2 text-[#81B7A9]" />
                                  Detail
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() =>
                                  router.push(
                                    `/terapis/asessment/${getType()}Riwayat?assessment_id=${item.assessment_id}&status=${mappedStatus}`
                                  )
                                }
                                className="cursor-pointer flex items-center w-full px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-teal-50/30 hover:text-[#1E5C58] transition-colors"
                              >
                                <Clock size={16} className="mr-2 text-[#81B7A9]" />
                                Riwayat Jawaban
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="block lg:hidden space-y-4">
              {paginatedData.map((item) => (
                <div
                  key={item.assessment_id}
                  className="bg-[#F4F9F8]/40 border border-teal-50 rounded-2xl p-4 space-y-3 shadow-xs text-left"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-[#1E5C58]">{item.child_name}</p>
                      <p className="text-xs text-gray-400 mt-0.5">Wali: {item.guardian_name}</p>
                    </div>
                    <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#EAF4F2] text-[#1E5C58] border border-teal-100">
                      {item.type}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-teal-50/50 text-gray-500 font-medium">
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">WhatsApp</span>
                      <span className="font-mono text-gray-600">{item.guardian_phone || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">
                        {activeFilter === "Selesai" ? "Assessor" : "Administrator"}
                      </span>
                      <span className="text-gray-600">
                        {activeFilter === "Selesai" ? item.assessor : item.administrator}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Tanggal</span>
                      <span>{item.scheduled_date || "-"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 uppercase">Waktu</span>
                      <span>
                        {activeFilter === "Selesai" ? item.completed_at : item.scheduled_time}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-teal-50/50">
                    {activeFilter === "Terjadwal" ? (
                      <>
                        <button
                          onClick={() => handleStartAssessment(item.assessment_id)}
                          className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white text-xs font-semibold py-2 rounded-lg shadow-sm"
                        >
                          <Play size={14} />
                          Mulai
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/terapis/asessment/detailAsesment?assessment_id=${item.assessment_id}&type=${getType()}&status=${mappedStatus}`
                            )
                          }
                          className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 bg-white border border-teal-100 text-[#1E5C58] hover:bg-teal-50/20 text-xs font-semibold py-2 rounded-lg"
                        >
                          <Clock size={14} />
                          Detail
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() =>
                          router.push(
                            `/terapis/asessment/${getType()}Riwayat?assessment_id=${item.assessment_id}&status=${mappedStatus}`
                          )
                        }
                        className="cursor-pointer w-full flex items-center justify-center gap-1.5 bg-[#1E5C58] hover:bg-[#2E8B83] text-white text-xs font-semibold py-2 rounded-lg shadow-sm"
                      >
                        <Clock size={14} />
                        Riwayat Jawaban
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 pt-4 border-t border-gray-100">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    page === 1
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      : "bg-white border-teal-100 hover:bg-teal-50/20 text-[#1E5C58]"
                  }`}
                >
                  Sebelumnya
                </button>
                <span className="text-xs font-bold text-gray-500">
                  Halaman {page} / {totalPages}
                </span>
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                    page === totalPages
                      ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                      : "bg-white border-teal-100 hover:bg-teal-50/20 text-[#1E5C58]"
                  }`}
                >
                  Selanjutnya
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ================= CUSTOM WARNING MODAL ================= */}
      <AnimatePresence>
        {showWarningModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWarningModal(false)}
              className="absolute inset-0 bg-[#1E5C58]/35 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative max-w-md w-full bg-white rounded-3xl p-6 shadow-2xl border border-teal-50 space-y-5 text-center z-10"
            >
              {/* Icon */}
              <div className="mx-auto w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center border border-amber-100 animate-pulse">
                <AlertTriangle className="w-7 h-7 text-amber-500" />
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h3 className="text-lg font-extrabold text-[#1E5C58]">
                  Peringatan Akses Asesmen
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 font-medium leading-relaxed px-2">
                  Anda bisa melihat pertanyaan tapi anda tidak bisa menyimpan asesmen.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowWarningModal(false)}
                  className="cursor-pointer flex-1 py-2.5 rounded-xl border border-teal-100 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowWarningModal(false);
                    if (pendingAssessmentId !== null) {
                      proceedToAssessment(pendingAssessmentId);
                    }
                  }}
                  className="cursor-pointer flex-1 py-2.5 rounded-xl bg-[#1E5C58] hover:bg-[#2E8B83] text-white text-xs font-bold shadow-md hover:shadow-lg transition-colors"
                >
                  Lanjutkan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
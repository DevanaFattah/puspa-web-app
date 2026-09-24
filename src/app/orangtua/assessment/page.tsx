"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  User,
  ChevronRight,
  ClipboardList,
  Mars,
  Clock4,
  CheckCircle2,
  Timer,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getMyAssessments,
  AssessmentItem,
  getMyAssessmentDetail,
} from "@/lib/api/childrenAsesment";

export default function DataUmumPage() {
  const router = useRouter();
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getMyAssessments();
        setAssessments(res.data || []);
      } catch (error) {
        console.error("Failed to load assessments:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSelect = async (assessment_id: string) => {
    if (!assessment_id || loadingId) return;
    setLoadingId(assessment_id);
    try {
      await getMyAssessmentDetail(assessment_id);
      router.push(`/orangtua/assessment/kategori?assessment_id=${assessment_id}`);
    } catch {
      alert("Gagal memuat detail assessment. Silakan coba lagi.");
    } finally {
      setLoadingId(null);
    }
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const isDone = status !== "scheduled";
    return isDone ? (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 uppercase tracking-wider whitespace-nowrap">
        <CheckCircle2 className="w-3 h-3" /> Selesai
      </span>
    ) : (
      <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 uppercase tracking-wider whitespace-nowrap">
        <Timer className="w-3 h-3" /> Terjadwal
      </span>
    );
  };

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">

      {/* Loading overlay */}
      <AnimatePresence>
        {loadingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-[60]"
          >
            <div className="h-12 w-12 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
            <p className="text-[#1E5C58] font-bold text-sm">Membuka Assessment...</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-5 text-[#1E5C58]">
        {/* Page Header */}
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-[#2B7A75]" />
            Pilih Assessment Anak
          </h1>
          <p className="text-gray-400 text-xs font-semibold mt-1">
            Pilih jadwal assessment untuk melihat detail dan riwayat data
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse text-sm">Memuat data...</p>
          </div>
        ) : assessments.length === 0 ? (
          <div className="bg-white rounded-3xl border border-teal-50 flex flex-col items-center justify-center py-24 space-y-3 text-gray-400">
            <ClipboardList className="w-12 h-12 opacity-30" />
            <p className="font-semibold text-sm">Tidak ada assessment ditemukan</p>
          </div>
        ) : (
          <>
            {/* ── MOBILE: Card List (< md) ── */}
            <div className="flex flex-col gap-3 md:hidden">
              {assessments.map((item, index) => {
                const isLoading = loadingId === item.assessment_id;
                return (
                  <motion.div
                    key={item.assessment_id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-white rounded-2xl border border-teal-50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4"
                  >
                    {/* Top row: avatar + name + status */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-2xl shrink-0">
                        👶
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[#1E5C58] text-sm truncate">{item.child_name}</p>
                        <div className="flex items-center gap-2 mt-0.5 text-gray-400 text-[11px] font-semibold">
                          <User className="w-3 h-3 shrink-0" />
                          <span>{item.child_age}</span>
                          <span>·</span>
                          <Mars className="w-3 h-3 shrink-0" />
                          <span className="capitalize">{item.child_gender}</span>
                        </div>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>

                    {/* Info row: date + time */}
                    <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 font-semibold">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5 text-[#2B7A75]" />
                        {item.scheduled_date}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock4 className="w-3.5 h-3.5 text-[#2B7A75]" />
                        {item.scheduled_time}
                      </div>
                    </div>

                    {/* CTA button full-width */}
                    <button
                      onClick={() => handleSelect(item.assessment_id)}
                      disabled={!!loadingId}
                      className="w-full cursor-pointer flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#2B7A75] hover:bg-[#1E5C58] text-white text-sm font-bold shadow-sm transition-all active:scale-95 disabled:opacity-60"
                    >
                      {isLoading
                        ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        : <ChevronRight className="w-4 h-4" />
                      }
                      Lihat Detail
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* ── DESKTOP: Table (≥ md) ── */}
            <div className="hidden md:block bg-white rounded-3xl border border-teal-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F4F9F8]">
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70 w-12">NO</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">INFO ANAK</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">JADWAL</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">WAKTU</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">STATUS</th>
                      <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {assessments.map((item, index) => {
                      const isLoading = loadingId === item.assessment_id;
                      return (
                        <motion.tr
                          key={item.assessment_id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className="hover:bg-[#F4F9F8]/60 transition-colors duration-150 group"
                        >
                          <td className="px-6 py-4 text-gray-400 font-semibold">{index + 1}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-200">👶</div>
                              <div>
                                <p className="font-bold text-[#1E5C58]">{item.child_name}</p>
                                <div className="flex items-center gap-1.5 mt-0.5 text-gray-400 text-[11px] font-semibold">
                                  <User className="w-3 h-3" />{item.child_age}
                                  <span className="text-gray-200">·</span>
                                  <Mars className="w-3 h-3" />
                                  <span className="capitalize">{item.child_gender}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-500 font-semibold text-xs">
                              <CalendarDays className="w-3.5 h-3.5 text-[#2B7A75] shrink-0" />
                              {item.scheduled_date}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2 text-gray-500 font-semibold text-xs">
                              <Clock4 className="w-3.5 h-3.5 text-[#2B7A75] shrink-0" />
                              {item.scheduled_time}
                            </div>
                          </td>
                          <td className="px-6 py-4"><StatusBadge status={item.status} /></td>
                          <td className="px-6 py-4">
                            <div className="flex justify-end">
                              <button
                                onClick={() => handleSelect(item.assessment_id)}
                                disabled={!!loadingId}
                                className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2B7A75] hover:bg-[#1E5C58] text-white text-xs font-bold shadow-sm transition-all active:scale-95 disabled:opacity-60"
                              >
                                {isLoading
                                  ? <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                  : <ChevronRight className="w-3.5 h-3.5" />
                                }
                                Lihat Detail
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

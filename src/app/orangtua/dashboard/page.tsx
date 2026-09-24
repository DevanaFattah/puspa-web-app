/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
} from "recharts";
import { Search, Calendar, Clock, Activity, User, Baby, Eye, Brain, ChevronRight, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

// Import Layout
import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import { useProfile } from "@/context/ProfileContext";

import {
  getOrtuDashboardStats,
  getOrtuUpcomingSchedules,
} from "@/lib/api/dashboardOrtu";

/* ================= TYPES ================= */
type ScheduleItem = {
  id: number | string;
  jenis: "observation" | "assessment";
  service_type?: string;
  nama_pasien: string;
  observer?: string;
  assessor?: string;
  status: string;
  tanggal: string;
  waktu: string;
};

export default function DashboardOrtuPage() {
  const { profile } = useProfile();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_children: { count: 0 },
    total_observations: { count: 0 },
    total_assessments: { count: 0 },
  });
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activeTab, setActiveTab] = useState<"Semua" | "Observasi" | "Assessment">("Semua");
  const [q, setQ] = useState("");

  const guardianName = profile?.guardian_name || "Orang Tua";

  /* ================= MAPPING DATA UNTUK CHART ================= */
  const customChartData = useMemo(() => [
    { name: "Awal", value: 0 }, 
    { name: "Total Anak", value: stats.total_children.count || 0 },
    { name: "Total Observasi", value: stats.total_observations.count || 0 },
    { name: "Total Assessment", value: stats.total_assessments.count || 0 },
    { name: "Akhir", value: stats.total_assessments.count || 0 }, 
  ], [stats]);

  useEffect(() => {
    async function load() {
      try {
        const ST = (await getOrtuDashboardStats())?.data ?? {};
        setStats({
          total_children: ST.total_children ?? { count: 0 },
          total_observations: ST.total_observations ?? { count: 0 },
          total_assessments: ST.total_assessments ?? { count: 0 },
        });

        const SC = (await getOrtuUpcomingSchedules("all"))?.data ?? [];
        const mappedSchedule: ScheduleItem[] = SC.map((r: any) => {
          const isAssessment = String(r.service_type).toLowerCase().includes("assessment");
          return {
            id: r.id,
            jenis: isAssessment ? "assessment" : "observation",
            service_type: r.service_type,
            nama_pasien: r.child_name ?? "-",
            observer: !isAssessment ? (r.therapist ?? "-") : undefined,
            assessor: isAssessment ? (r.therapist ?? "-") : undefined,
            status: r.status ?? "-",
            tanggal: r.date ?? "-",
            waktu: r.time ?? "-",
          };
        });
        setSchedule(mappedSchedule);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredSchedule = useMemo(() => {
    return schedule
      .filter((s) => {
        if (activeTab === "Observasi") return s.jenis === "observation";
        if (activeTab === "Assessment") return s.jenis === "assessment";
        return true;
      })
      .filter((s) => s.nama_pasien.toLowerCase().includes(q.toLowerCase()));
  }, [schedule, q, activeTab]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white space-y-4">
      <div className="w-10 h-10 border-4 border-teal-150 border-t-[#2B7A75] rounded-full animate-spin" />
      <p className="text-gray-400 font-medium text-sm animate-pulse">Menyiapkan Dashboard...</p>
    </div>
  );

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-7xl">
      <div className="space-y-8 text-[#1E5C58]">

        {/* Banner Selamat Datang */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-linear-to-br from-[#1E5C58] to-[#2B7A75] rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden w-full"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-40 h-40 bg-[#A2E4D3]/20 rounded-full blur-2xl transform translate-y-1/2 pointer-events-none" />

          <div className="relative z-10">
            <h1 className="text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight">
              Selamat Datang, {guardianName}!
            </h1>
            <p className="text-teal-50/90 text-sm lg:text-base max-w-xl leading-relaxed">
              Pantau jadwal observasi, riwayat asesmen, dan data perkembangan anak Anda secara berkala.
            </p>
          </div>
        </motion.div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <MetricCard 
            title="Total Anak / Pasien" 
            count={stats.total_children.count} 
            icon={Baby} 
            colorClass="bg-teal-50 text-[#2B7A75]" 
            shadowClass="group-hover:shadow-teal-500/10"
          />
          <MetricCard 
            title="Total Observasi" 
            count={stats.total_observations.count} 
            icon={Eye} 
            colorClass="bg-blue-50 text-blue-600" 
            shadowClass="group-hover:shadow-blue-500/10"
          />
          <MetricCard 
            title="Total Assessment" 
            count={stats.total_assessments.count} 
            icon={Brain} 
            colorClass="bg-amber-50 text-amber-600" 
            shadowClass="group-hover:shadow-amber-500/10"
          />
        </div>

        {/* CHART SECTION */}
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-extrabold text-[#1E5C58] text-base md:text-lg flex items-center gap-2">
              <Activity size={20} className="text-[#2B7A75]" />
              Ringkasan Aktivitas
            </h3>
          </div>

          <div className="h-70 sm:h-80 md:h-87.5 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={customChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2B7A75" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2B7A75" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E6F3F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748B', fontWeight: 500 }} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94A3B8', fontWeight: 500 }} />
                <ReTooltip 
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: '1px solid #E6F3F0', 
                    boxShadow: '0 10px 30px -10px rgba(0,0,0,0.05)',
                    backgroundColor: '#ffffff'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#2B7A75" 
                  strokeWidth={3} 
                  fill="url(#colorValue)" 
                  dot={{ r: 5, fill: '#ffffff', stroke: '#2B7A75', strokeWidth: 2 }} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* JADWAL SECTION */}
        <div className="bg-white rounded-3xl p-5 md:p-8 border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 mb-8">
            <h3 className="font-extrabold text-[#1E5C58] text-base md:text-lg flex items-center gap-2">
              <Calendar size={20} className="text-[#2B7A75]" />
              Jadwal Mendatang
            </h3>

            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
              <div className="relative group flex-1 sm:flex-initial">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#2B7A75]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Cari nama anak..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-teal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] transition-all shadow-sm text-gray-700"
                />
              </div>

              <div className="flex bg-[#F4F9F8] p-1 rounded-xl">
                {["Semua", "Observasi", "Assessment"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveTab(t as any)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t ? "bg-[#2B7A75] text-white shadow-md shadow-teal-500/10" : "text-gray-500 hover:text-[#2B7A75] hover:bg-[#2B7A75]/5"} cursor-pointer`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE VIEW */}
          <div className="hidden sm:block overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#F4F9F8] border-b border-teal-100">
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">Nama Pasien</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">Layanan</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">Petugas</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">Status</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">Tanggal</th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider text-right">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredSchedule.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-medium">Belum ada jadwal yang terdaftar</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSchedule.map((r, index) => (
                    <tr key={`desktop-${r.jenis}-${r.id}-${index}`} className="group hover:bg-[#F4F9F8]/50 transition-colors">
                      <td className="py-4 px-6 font-bold text-gray-700 group-hover:text-[#2B7A75]">{r.nama_pasien}</td>
                      <td className="py-4 px-6 text-sm text-gray-600 font-semibold">{r.service_type || "-"}</td>
                      <td className="py-4 px-6 text-sm text-[#1E5C58] font-bold">
                        {r.observer || r.assessor || "-"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-green-150 text-green-700">{r.status}</span>
                      </td>
                      <td className="py-4 px-6 text-gray-650 font-semibold text-sm">{r.tanggal}</td>
                      <td className="py-4 px-6 text-right">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 rounded-lg text-xs font-bold text-gray-600">
                          <Clock size={12} /> {r.waktu}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MOBILE VIEW */}
          <div className="block sm:hidden space-y-4">
            {filteredSchedule.length === 0 ? (
              <div className="py-10 text-center text-gray-400 text-sm">Belum ada jadwal</div>
            ) : (
              filteredSchedule.map((r, index) => (
                <div key={`mobile-${r.jenis}-${r.id}-${index}`} className="bg-[#F4F9F8]/30 border border-teal-50 p-5 rounded-3xl space-y-3 shadow-xs">
                  <div className="flex justify-between items-start">
                    <div className="font-extrabold text-[#1E5C58] text-sm">{r.nama_pasien}</div>
                    <span className="px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase bg-green-100 text-green-700">{r.status}</span>
                  </div>
                  <div className="text-xs text-gray-500 font-semibold">{r.service_type || "-"}</div>
                  
                  <div className="flex items-center gap-2 text-[11px] text-[#2B7A75] font-bold py-1 bg-teal-50/50 rounded-lg px-2 w-fit">
                    <User size={12} />
                    <span>{r.observer || r.assessor || "-"}</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100/60">
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold">
                      <Calendar size={13} className="text-[#2B7A75]" />
                      {r.tanggal}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold">
                      <Clock size={13} className="text-[#2B7A75]" />
                      {r.waktu}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ResponsiveOrangtuaLayout>
  );
}

function MetricCard({ title, count, icon: Icon, colorClass, shadowClass }: any) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-teal-50 flex justify-between items-center transition-all shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(43,122,117,0.12)] group hover:-translate-y-1 duration-300">
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">{title}</p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-extrabold text-[#1E5C58] tracking-tight">{count}</h4>
          <span className="text-xs font-semibold text-gray-400">Terdaftar</span>
        </div>
      </div>
      <div className={`w-14 h-14 flex items-center justify-center rounded-2xl transition-all duration-300 ${colorClass} ${shadowClass} group-hover:scale-110`}>
        <Icon className="w-7 h-7" />
      </div>
    </div>
  );
}
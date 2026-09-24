/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";
import {
  Sparkles,
  TrendingUp,
  FileText,
  ClipboardCheck,
  CheckCircle,
  HelpCircle,
  CalendarRange,
} from "lucide-react";
import PasienChart from "@/components/dashboard/pasien_chart";
import { getOwnerDashboard } from "@/lib/api/dashboardOwner";

export default function DashboardOwnerPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(String(now.getMonth() + 1));
  const [selectedYear, setSelectedYear] = useState(String(now.getFullYear()));

  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  const years = ["2024", "2025", "2026"];

  async function loadDashboard(month: number, year: number) {
    try {
      setLoading(true);
      const res = await getOwnerDashboard(month, year);
      const d = res.data;

      setMetrics(d.metrics ?? null);

      setCategories(
        Array.isArray(d.patient_categories)
          ? d.patient_categories.map((c: any) => ({
              name: c.type ?? "-",
              value: Number(c.percentage ?? 0),
              count: Number(c.count),
            }))
          : []
      );

      if (Array.isArray(d.historical_trend)) {
        const periods =
          d.historical_trend[0]?.data.map((p: any) => p.period) ?? [];

        const trendData = periods.map((period: string, index: number) => {
          const obj: any = { period };
          d.historical_trend.forEach((stage: any) => {
            obj[stage.stage] = Number(stage.data[index]?.value ?? 0);
          });
          return obj;
        });

        setTrend(trendData);
      } else {
        setTrend([]);
      }
    } catch (err) {
      console.error("Error loading owner dashboard:", err);
      setTrend([]);
      setCategories([]);
      setMetrics(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(Number(selectedMonth), Number(selectedYear));
  }, [selectedMonth, selectedYear]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] w-full">
        <div className="w-10 h-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
        <p className="text-gray-400 font-medium text-sm animate-pulse">
          Memuat dasbor owner...
        </p>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden selection:bg-[#2B7A75] selection:text-white bg-transparent w-full">
      {/* Decorative Blur Blobs */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#b8e8db30] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#68b2a015] rounded-full blur-[100px] pointer-events-none z-0" />

      <main className="relative z-10 w-full flex flex-col p-4 sm:p-6 lg:p-8 gap-8 pb-12">
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
              Dasbor Owner
            </h1>
            <p className="text-teal-50/90 text-sm lg:text-base max-w-xl leading-relaxed">
              Pantau laporan bulanan, statistik pendaftaran pasien, serta tren grafik
              seluruh asesmen klinik secara komprehensif.
            </p>
          </div>
        </motion.div>

        {/* Filter Periode */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white p-4 rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] border border-teal-50/60 w-full sm:w-fit"
        >
          <div className="flex items-center gap-2 text-[#1E5C58] font-bold text-sm">
            <CalendarRange className="w-4.5 h-4.5 text-[#2B7A75]" />
            <span>Pilih Periode:</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-gray-50/70 border border-teal-100/80 rounded-xl px-3 py-2 text-sm text-[#1E5C58] focus:ring-2 focus:ring-teal-100 outline-none cursor-pointer font-semibold"
            >
              {months.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-gray-50/70 border border-teal-100/80 rounded-xl px-3 py-2 text-sm text-[#1E5C58] focus:ring-2 focus:ring-teal-100 outline-none cursor-pointer font-semibold"
            >
              {years.map((y, i) => (
                <option key={i} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Metrics Cards */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <MetricCard
              label="Total Pendaftaran"
              current={metrics.total_observations?.current ?? 0}
              change={metrics.total_observations?.formatted_change ?? "0%"}
              icon={FileText}
              bgClass="bg-teal-50/50"
              colorClass="text-[#2B7A75]"
              borderClass="border-teal-100/50"
            />
            <MetricCard
              label="Total Assessment"
              current={metrics.total_assessments?.current ?? 0}
              change={metrics.total_assessments?.formatted_change ?? "0%"}
              icon={ClipboardCheck}
              bgClass="bg-indigo-50/50"
              colorClass="text-[#5F52BF]"
              borderClass="border-indigo-100/50"
            />
            <MetricCard
              label="Tingkat Penyelesaian"
              current={`${metrics.completion_rate?.current ?? 0}%`}
              change={metrics.completion_rate?.formatted_change ?? "0%"}
              icon={CheckCircle}
              bgClass="bg-[#F4F9F8]"
              colorClass="text-[#1E5C58]"
              borderClass="border-teal-100/30"
            />
            <MetricCard
              label="Pertanyaan Belum Dijawab"
              current={`${metrics.unanswered_questions?.current ?? 0}%`}
              change={metrics.unanswered_questions?.formatted_change ?? "0%"}
              icon={HelpCircle}
              bgClass="bg-rose-50/50"
              colorClass="text-rose-500"
              borderClass="border-rose-100/50"
            />
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Trend Bulanan (Recharts AreaChart) */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="xl:col-span-2 bg-white rounded-3xl p-6 border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] w-full"
          >
            <div className="flex items-center justify-between mb-6 border-b border-gray-50 pb-4">
              <div>
                <h3 className="text-lg font-extrabold text-[#1E5C58] tracking-tight">
                  Tren Pendaftaran & Asesmen
                </h3>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">
                  Visualisasi performa dalam 6 bulan terakhir
                </p>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-500">
                <span className="w-1.5 h-1.5 bg-[#2B7A75] rounded-full animate-ping" />
                {months[Number(selectedMonth) - 1]} {selectedYear}
              </div>
            </div>

            <div className="w-full h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="observasiGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E5C58" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#1E5C58" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="assessmentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2B7A75" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2B7A75" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="penyelesaianGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                  <XAxis
                    dataKey="period"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                  />
                  <YAxis
                    domain={[0, 100]}
                    ticks={[0, 25, 50, 75, 100]}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 11, fontWeight: "bold" }}
                  />
                  <ReTooltip
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      border: "1px solid #f0fdfa",
                      borderRadius: "16px",
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", fontWeight: "bold", paddingTop: "15px" }} />

                  <Area
                    type="monotone"
                    dataKey="Observasi"
                    stroke="#1E5C58"
                    strokeWidth={3}
                    fill="url(#observasiGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Assessment"
                    stroke="#2B7A75"
                    strokeWidth={3}
                    fill="url(#assessmentGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="Penyelesaian"
                    stroke="#10B981"
                    strokeWidth={3}
                    fill="url(#penyelesaianGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Patient Categories (PasienChart) */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-3xl p-6 border border-teal-50 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] w-full flex flex-col justify-between"
          >
            <div className="border-b border-gray-50 pb-4 mb-4">
              <h3 className="text-lg font-extrabold text-[#1E5C58] tracking-tight">
                Kategori Pasien
              </h3>
              <p className="text-xs text-gray-400 font-semibold mt-0.5">
                Persentase tipe layanan terapi pasien aktif
              </p>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <PasienChart apiData={categories} />
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function MetricCard({ label, current, change, icon: Icon, colorClass, borderClass, bgClass }: any) {
  const isPositive = !change.startsWith("-") && change !== "0%";
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-3xl p-6 border border-teal-50/60 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.03)] flex justify-between items-start transition-all duration-300 w-full"
    >
      <div className="flex-1 min-w-0">
        <span className="text-[11px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">
          {label}
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-[#1E5C58] tracking-tight truncate mt-1">
          {current}
        </h3>
        <div className="flex items-center gap-1 mt-2">
          <span className={`inline-flex items-center text-xs font-bold ${isPositive ? "text-emerald-500" : "text-rose-500"}`}>
            {isPositive ? "+" : ""}{change}
          </span>
          <span className="text-[10px] text-gray-400 font-medium">vs bulan lalu</span>
        </div>
      </div>

      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ml-4 border ${bgClass} ${colorClass} ${borderClass}`}>
        <Icon className="w-6 h-6" />
      </div>
    </motion.div>
  );
}

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
} from "recharts";
import {
  ClipboardCheck,
  FileSpreadsheet,
  CheckCircle2,
  UserCheck,
  Calendar,
  Clock,
} from "lucide-react";

import PasienChart from "@/components/dashboard/pasien_chart";

import {
  getDashboardMetrics,
  getUpcomingSchedules,
} from "@/lib/api/dashboardTerapis";

/* ================= CUSTOM X AXIS TICK ================= */
const CustomXAxisTick = ({ x, y, payload }: any) => {
  const words = payload.value.split(" ");

  return (
    <g transform={`translate(${x},${y + 8})`}>
      <text textAnchor="middle" fill="#1E5C58" fontSize={10} fontWeight={500}>
        {words.map((word: string, index: number) => (
          <tspan key={index} x="0" dy={index === 0 ? 0 : 12}>
            {word}
          </tspan>
        ))}
      </text>
    </g>
  );
};

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [trend, setTrend] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState("");
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  useEffect(() => {
    async function load() {
      try {
        const dashboardRes = await getDashboardMetrics();
        const upcomingRes = await getUpcomingSchedules();

        const d = dashboardRes.data;

        setMetrics(d.metrics);

        setCategories(
          (d.patient_categories ?? []).map((c: any) => ({
            name: c.type,
            value: Number(c.percentage),
            count: Number(c.count),
          })),
        );

        setTrend(
          (d.trend_chart ?? []).map((t: any) => ({
            name: t.label,
            value: Number(t.value),
          })),
        );

        setSchedule(upcomingRes.data ?? []);

        if (d.period) {
          setCurrentPeriod(d.period.month_name);
        }
      } catch (error) {
        console.error("Dashboard error:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const filteredSchedule = schedule.filter((s: any) => {
    if (role === "terapis") {
      if (Array.isArray(s.types)) {
        return !s.types.some((t: string) =>
          t.toLowerCase().includes("assessment"),
        );
      }
      return true;
    }
    return true;
  });

  if (loading || !role) {
    return (
      <div className="min-h-screen flex items-center justify-center text-lg font-medium text-[#1E5C58] bg-[#F8FBFB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#1E5C58] border-t-transparent rounded-full animate-spin"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= GREETING BANNER ================= */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1E5C58] to-[#2E8B83] p-6 md:p-8 text-white shadow-[0_10px_30px_rgba(30,92,88,0.15)]">
        <div className="relative z-10 space-y-2">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Selamat Datang Kembali, {role === "terapis" ? "Terapis" : "Asesor"}{" "}
            PUSPA!
          </h1>
          <p className="text-teal-50 max-w-xl text-sm md:text-base font-light">
            Mari pantau perkembangan anak-anak dan kelola aktivitas hari ini
            dengan efisien dan penuh kepedulian.
          </p>
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
      </div>

      {/* ================= METRIC CARDS ================= */}
      <div
        className={`grid gap-6 ${role === "terapis" ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"}`}
      >
        <MetricCard
          label="Total Observasi"
          value={metrics?.total_observations?.current}
          percent={metrics?.total_observations?.change_percent}
          icon={ClipboardCheck}
        />

        {role === "asesor" && (
          <MetricCard
            label="Total Assessment"
            value={metrics?.total_assessments?.current}
            percent={metrics?.total_assessments?.change_percent}
            icon={FileSpreadsheet}
          />
        )}

        <MetricCard
          label="Tingkat Penyelesaian"
          value={metrics?.completion_rate?.current}
          percent={metrics?.completion_rate?.change_percent}
          icon={CheckCircle2}
        />

        {role === "terapis" ? (
          <MetricCard
            label="Total Terapis"
            value={metrics?.total_therapists?.current}
            percent={metrics?.total_therapists?.change_percent}
            icon={UserCheck}
          />
        ) : (
          <MetricCard
            label="Total Asesor"
            value={metrics?.total_assessors?.current}
            percent={metrics?.total_assessors?.change_percent}
            icon={UserCheck}
          />
        )}
      </div>

      {/* ================= CHART SECTION ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-teal-50/50 shadow-[0_4px_20px_rgba(30,92,88,0.04)] hover:shadow-[0_10px_30px_rgba(30,92,88,0.08)] transition-all duration-300">
          <PasienChart apiData={categories} />
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-teal-50/50 shadow-[0_4px_20px_rgba(30,92,88,0.04)] hover:shadow-[0_10px_30px_rgba(30,92,88,0.08)] transition-all duration-300">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-lg text-[#1E5C58]">
                Trend Bulanan
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Jumlah pasien terdaftar per bulan
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-teal-50 text-xs font-semibold text-[#1E5C58]">
              {currentPeriod}
            </span>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={trend}
                margin={{ top: 10, right: 10, left: -20, bottom: 10 }}
              >
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1E5C58" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#1E5C58" stopOpacity={0.01} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#E2E8F0"
                />
                <XAxis
                  dataKey="name"
                  interval={0}
                  height={44}
                  tick={<CustomXAxisTick />}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 20, 40, 60, 80, 100]}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "#718096", fontSize: 11 }}
                />
                <ReTooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    borderRadius: "12px",
                    border: "1px solid #E6F2F0",
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                    fontFamily: "inherit",
                    color: "#1E5C58",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#1E5C58"
                  strokeWidth={3}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ================= UPCOMING SCHEDULE ================= */}
      <div className="bg-white rounded-2xl p-6 border border-teal-50/50 shadow-[0_4px_20px_rgba(30,92,88,0.04)] hover:shadow-[0_10px_30px_rgba(30,92,88,0.08)] transition-all duration-300">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-lg text-[#1E5C58]">
              Jadwal Mendatang
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Daftar agenda janji temu pasien yang akan datang
            </p>
          </div>
          <span className="flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full bg-teal-50 text-[#1E5C58]">
            <span>{filteredSchedule.length}</span>
            <span> Agenda</span>
          </span>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                <th className="py-4 text-left font-semibold text-xs uppercase tracking-wider w-[25%] pb-3">
                  Nama Pasien
                </th>
                <th className="py-4 text-left font-semibold text-xs uppercase tracking-wider w-[30%] pb-3">
                  Jenis Layanan
                </th>
                <th className="py-4 text-center font-semibold text-xs uppercase tracking-wider w-[15%] pb-3">
                  Status
                </th>
                <th className="py-4 text-center font-semibold text-xs uppercase tracking-wider w-[15%] pb-3">
                  Tanggal
                </th>
                <th className="py-4 text-center font-semibold text-xs uppercase tracking-wider w-[15%] pb-3">
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {/* EMPTY STATE */}
              {filteredSchedule.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    <div className="flex flex-col items-center gap-2">
                      <Calendar className="w-8 h-8 text-gray-300" />
                      <span className="text-sm font-medium">
                        Tidak ada jadwal mendatang untuk saat ini
                      </span>
                    </div>
                  </td>
                </tr>
              )}

              {filteredSchedule.map((s: any, index: number) => (
                <tr
                  key={`${s.id}-${s.date}-${s.time}-${index}`}
                  className="hover:bg-teal-50/10 transition-colors"
                >
                  <td className="py-4 font-semibold text-gray-700">
                    {s.child_name}
                  </td>
                  <td className="py-4">
                    {Array.isArray(s.types) && s.types.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5">
                        {s.types.map((type: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#EAF4F2] text-[#1E5C58]"
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        s.status.toLowerCase() === "selesai"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td className="py-4 text-center text-gray-500 font-medium">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{s.date}</span>
                    </div>
                  </td>
                  <td className="py-4 text-center text-gray-500 font-medium">
                    <div className="inline-flex items-center gap-1.5 justify-center">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span>{s.time}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4">
          {filteredSchedule.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-gray-50/55 rounded-2xl border border-dashed border-teal-100/60">
              <div className="flex flex-col items-center gap-2">
                <Calendar className="w-8 h-8 text-gray-300" />
                <span className="text-sm font-medium">
                  Tidak ada jadwal mendatang untuk saat ini
                </span>
              </div>
            </div>
          ) : (
            filteredSchedule.map((s: any, index: number) => (
              <div
                key={`${s.id}-${s.date}-${s.time}-${index}`}
                className="bg-[#F8FBFB] border border-teal-100/50 rounded-2xl p-4 space-y-3.5 shadow-xs text-left"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-[#1E5C58] capitalize">
                      {s.child_name}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {Array.isArray(s.types) && s.types.length > 0 ? (
                        s.types.map((type: string, i: number) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#EAF4F2] text-[#1E5C58] border border-teal-100/30"
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                      s.status.toLowerCase() === "selesai"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        : "bg-amber-50 text-amber-700 border border-amber-100"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-teal-50/50 text-[11px] text-[#81B7A9] font-semibold">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#81B7A9]" />
                    <span className="text-gray-600">{s.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#81B7A9]" />
                    <span className="text-gray-600">{s.time}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

/* ================= METRIC CARD ================= */
function MetricCard({
  label,
  value,
  percent,
  icon: Icon,
}: {
  label: string;
  value: any;
  percent: number;
  icon: React.ComponentType<any>;
}) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl p-6 border border-teal-50/55 shadow-[0_4px_20px_rgba(30,92,88,0.03)] hover:shadow-[0_10px_30px_rgba(30,92,88,0.09)] transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            {label}
          </span>
          <div className="text-3xl font-extrabold text-[#1E5C58] tracking-tight">
            {value ?? 0}
          </div>
        </div>
        <div className="p-3 bg-teal-50/60 rounded-xl text-[#1E5C58]">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center">
        <span
          className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold ${
            percent >= 0
              ? "bg-emerald-50 text-emerald-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {percent >= 0 ? "↑" : "↓"} {Math.abs(percent)}%
        </span>
        <span className="text-xs text-gray-400 ml-2">vs bulan lalu</span>
      </div>
    </div>
  );
}

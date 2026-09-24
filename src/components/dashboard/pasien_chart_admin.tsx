/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { useMemo, useState } from "react";
import { Users, PieChart as ChartIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChartItem {
  name: string;
  value: number;
  percentage: number;
  [key: string]: any;
}

interface PasienChartProps {
  data: any[];
  loading: boolean;
}

type PieLabelProps = {
  name?: string;
  payload?: {
    percentage?: number;
  };
};

export default function PasienChartAdmin({ data, loading }: PasienChartProps) {
  // A sophisticated, calming palette for the health/therapy theme
  const COLORS = [
    "#1E5C58", // Umum
    "#38A3A5", // Terapi Wicara
    "#4ADE80", // Terapi Okupasi (Warna Terang - Hijau Cerah)
    "#FFB703", // Fisioterapi
    "#F472B6", // Paedagog (Warna Terang - Merah Muda Cerah)
    "#F4A261", // Cadangan
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const CATEGORY_LABEL_MAP: Record<string, string> = {
    fisio: "Fisioterapi",
    okupasi: "Terapi Okupasi",
    wicara: "Terapi Wicara",
    psikologis: "Psikologis",
    ortho: "Ortopedagog",
  };

  const chartData: ChartItem[] = useMemo(() => {
    if (!data || data.length === 0) return [];

    return data.map((item: any) => {
      const key = item.type_key?.toLowerCase();

      return {
        name: CATEGORY_LABEL_MAP[key] || item.type || "Unknown",
        value: Number(item.count) || 0,
        percentage: Number(item.percentage) || 0,
      };
    });
  }, [data]);

  const hasData = chartData.length > 0 && chartData.some((d) => d.value > 0);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 flex flex-col h-full relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-[#F4F9F8] flex items-center justify-center border border-teal-100">
          <ChartIcon className="w-5 h-5 text-[#1E5C58]" />
        </div>
        <div>
          <h3 className="font-extrabold text-[#1E5C58] tracking-tight text-xl">
            Sebaran Medis
          </h3>
          <p className="text-xs text-gray-500 font-medium">
            Berdasarkan Kategori Layanan
          </p>
        </div>
      </div>

      <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50 flex flex-col items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-chart"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-64 flex flex-col items-center justify-center w-full"
            >
              <div className="w-10 h-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-gray-400 animate-pulse">
                Menyusun data diagram...
              </p>
            </motion.div>
          ) : !hasData ? (
            <motion.div
              key="empty-chart"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-64 flex flex-col items-center justify-center w-full text-center px-4"
            >
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <Users className="w-10 h-10 text-teal-300" />
              </div>
              <p className="text-lg font-bold text-gray-700 mb-1">
                Belum ada penyebaran logis
              </p>
              <p className="text-sm font-medium text-gray-400">
                Pendaftaran baru atau asesmen pasien akan direkap di sini.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="chart-content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full flex-1 flex flex-col items-center justify-between"
            >
              <div className="w-full h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={85}
                      innerRadius={50}
                      paddingAngle={4}
                      stroke="none"
                      label={(props) => {
                        const {
                          cx,
                          cy,
                          midAngle,
                          innerRadius,
                          outerRadius,
                          percent,
                        } = props as any;

                        if (!percent || percent === 0) return null;

                        const RADIAN = Math.PI / 180;
                        const radius =
                          (innerRadius as number) +
                          ((outerRadius as number) - (innerRadius as number)) *
                            0.5;
                        const x =
                          (cx as number) +
                          radius * Math.cos(-midAngle * RADIAN);
                        const y =
                          (cy as number) +
                          radius * Math.sin(-midAngle * RADIAN);

                        return (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor="middle"
                            dominantBaseline="central"
                            fontSize={11}
                            fontWeight="bold"
                            style={{ pointerEvents: "none" }}
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        );
                      }}
                      labelLine={false}
                    >
                      {chartData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          className="outline-none"
                          style={{
                            opacity:
                              activeIndex === null || activeIndex === index
                                ? 1
                                : 0.6,
                            transform:
                              activeIndex === index
                                ? "scale(1.05)"
                                : "scale(1)",
                            transformOrigin: "center",
                            transition: "all 150ms ease",
                          }}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 20px -5px rgba(0,0,0,0.1)",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                      itemStyle={{ color: "#1E5C58" }}
                      formatter={(value, name, props) => {
                        const percentage = props?.payload?.percentage;
                        return [
                          `${value} Klien (${percentage?.toFixed?.(1) ?? 0}%)`,
                          name as string,
                        ];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Clean Legend Below */}
              <div className="w-full mt-2 grid grid-cols-2 gap-x-2 gap-y-3 px-2">
                {chartData.map((item, index) => (
                  <div
                    key={item.name}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onClick={() =>
                      setActiveIndex(activeIndex === index ? null : index)
                    }
                    className={`flex items-center gap-2 group cursor-pointer p-2 rounded-lg transition-all duration-150 ${
                      activeIndex === index
                        ? "bg-teal-50 shadow-sm translate-x-1"
                        : "hover:bg-teal-50/50"
                    }`}
                  >
                    <div
                      className={`w-3.5 h-3.5 rounded-full shrink-0 shadow-sm transition-all duration-150 ${
                        activeIndex === index
                          ? "scale-150"
                          : "group-hover:scale-125"
                      }`}
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-bold text-gray-700 leading-tight line-clamp-1">
                        {item.name}
                      </span>
                      <span className="text-[10px] text-gray-400 font-semibold uppercase">
                        {item.value} Anak
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

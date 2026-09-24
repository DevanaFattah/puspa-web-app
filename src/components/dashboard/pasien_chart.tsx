/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

type CategoryItem = {
  name: string;
  value: number;
  count?: number;
};

export default function PasienChart({ apiData }: { apiData: CategoryItem[] }) {
  const COLORS = [
    "#06B6D4", // Vibrant Cyan
    "#6366F1", // Indigo / Blue-Purple
    "#F43F5E", // Rose / Red-Pink
    "#F59E0B", // Amber / Warm Orange
    "#10B981", // Emerald Green
  ];

  const hasData = apiData && apiData.length > 0;

  const dataToUse = hasData
    ? apiData
    : [{ name: "Tidak ada data", value: 100, count: 0 }];

  const totalPatients = hasData
    ? apiData.reduce((sum, item) => sum + (item.count || 0), 0)
    : 0;

  return (
    <div className="text-[#1E5C58]">
      <div className="mb-4">
        <h3 className="font-bold text-lg">Kategori Pasien</h3>
        <p className="text-xs text-gray-400 mt-0.5">Distribusi jenis terapi pasien aktif</p>
      </div>

      <div className="relative w-full h-48 flex items-center justify-center">
        {/* DONUT CHART */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dataToUse}
              dataKey="value"
              nameKey="name"
              outerRadius="90%"
              innerRadius="72%"
              paddingAngle={hasData ? 4 : 0}
              startAngle={90}
              endAngle={-270}
            >
              {dataToUse.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={hasData ? COLORS[index % COLORS.length] : "#E2E8F0"}
                  className="outline-none focus:outline-none"
                />
              ))}
            </Pie>

            {hasData && (
              <Tooltip
                formatter={(value: any, name: any, props: any) => [
                  `${value}% (${props.payload.count} pasien)`,
                  name,
                ]}
                contentStyle={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "12px",
                  border: "1px solid #E6F2F0",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)",
                  fontFamily: "inherit",
                  color: "#1E5C58",
                  fontSize: "12px"
                }}
              />
            )}
          </PieChart>
        </ResponsiveContainer>

        {/* CENTER LABELS */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold text-[#1E5C58] tracking-tight">
            {totalPatients}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">
            Pasien
          </span>
        </div>
      </div>

      {/* CUSTOM LEGEND */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
        {hasData ? (
          apiData.map((entry, index) => (
            <div 
              key={entry.name} 
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-teal-50/30 transition-colors"
            >
              <span 
                className="w-2.5 h-2.5 rounded-full shrink-0" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }} 
              />
              <div className="min-w-0">
                <p className="font-semibold text-gray-700 truncate text-[11px]">{entry.name}</p>
                <p className="text-[10px] text-gray-400 font-medium">
                  {entry.value}% ({entry.count || 0} Anak)
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 text-center text-xs text-gray-400 py-2">
            Belum ada data kategori pasien
          </div>
        )}
      </div>
    </div>
  );
}

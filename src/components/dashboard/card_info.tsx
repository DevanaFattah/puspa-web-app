"use client";

import {
  CalendarDays,
  Users,
  ClipboardCheck,
  TrendingUp,
  Activity,
} from "lucide-react";
import { motion } from "framer-motion";

interface CardInfoProps {
  stats: any;
  loading: boolean;
  date?: string;
}

export default function CardInfo({ stats, loading, date }: CardInfoProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-3xl shadow-sm border border-teal-50 animate-pulse"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-teal-50 rounded-2xl shrink-0" />
              <div className="w-full">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: "Observasi Harian",
      value: stats?.metrics?.observation_today || 0,
      icon: <Activity className="w-7 h-7 text-[#1E5C58]" />,
      bg: "bg-teal-50",
      border: "border-teal-100",
      trend: "+2 dari kemarin", // Optional mock data line, could be dynamic
    },
    {
      title: "Asesmen Harian",
      value: stats?.metrics?.assessment_today || 0,
      icon: <ClipboardCheck className="w-7 h-7 text-amber-600" />,
      bg: "bg-amber-50",
      border: "border-amber-100",
      trend: "Sesuai jadwal",
    },
    {
      title: "Total Pasien Aktif",
      value: stats?.metrics?.active_patients || 0,
      icon: <Users className="w-7 h-7 text-indigo-600" />,
      bg: "bg-indigo-50",
      border: "border-indigo-100",
      trend: "Terus bertumbuh",
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((card, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className={`relative overflow-hidden p-6 bg-white rounded-3xl shadow-[0_8px_30px_-15px_rgba(0,0,0,0.05)] border ${card.border} hover:shadow-md transition-shadow group`}
          >
            {/* Background Blob */}
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${card.bg} opacity-50 group-hover:scale-150 transition-transform duration-500`}
            />

            <div className="relative z-10 flex items-start gap-5">
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-2xl ${card.bg} border ${card.border} shrink-0 shadow-sm`}
              >
                {card.icon}
              </div>

              <div className="flex-1">
                <p className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-1">
                  {card.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-black text-gray-800 tracking-tight">
                    {card.value}
                  </h3>
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-gray-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {card.trend}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {date && (
        <div className="flex items-center justify-end gap-2 mt-4 text-xs font-semibold text-gray-400">
          <CalendarDays className="w-4 h-4" />
          Data per {date}
        </div>
      )}
    </div>
  );
}

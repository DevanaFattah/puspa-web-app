"use client";

import { Clock, CalendarX, User, HeartPulse } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Jadwal {
  id?: string | number;
  nama_pasien?: string;
  jenis_terapi?: string;
  waktu?: string;
  nama_terapis?: string;
}

interface JadwalTableProps {
  jadwal: Jadwal[];
  loading: boolean;
  emptyMessage?: string;
}

export default function JadwalTable({
  jadwal,
  loading,
  emptyMessage = "Belum ada jadwal hari ini",
}: JadwalTableProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-[#F4F9F8] flex items-center justify-center border border-teal-100">
          <Clock className="w-5 h-5 text-[#1E5C58]" />
        </div>
        <h3 className="font-extrabold text-[#1E5C58] tracking-tight text-xl">
          Jadwal Terapi Hari Ini
        </h3>
      </div>

      <div className="flex-1 bg-gray-50/50 rounded-2xl p-4 border border-gray-100/50">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-64 flex flex-col items-center justify-center pt-8"
            >
              <div className="w-10 h-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
              <p className="text-sm font-semibold text-gray-400 animate-pulse">
                Memuat jadwal terapi...
              </p>
            </motion.div>
          ) : jadwal.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-64 flex flex-col items-center justify-center text-center px-4"
            >
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                <CalendarX className="w-10 h-10 text-teal-300" />
              </div>
              <p className="text-lg font-bold text-gray-700 mb-1">
                {emptyMessage}
              </p>
              <p className="text-sm font-medium text-gray-400">
                Waktunya bersih-bersih atau menjadwalkan ulang!
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3 pr-2 overflow-y-auto max-h-80 custom-scrollbar"
            >
              <style
                dangerouslySetInnerHTML={{
                  __html: `
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #a2e4d3; }
              `,
                }}
              />

              {jadwal.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  key={item.id ?? index}
                  className="group p-4 bg-white rounded-2xl border border-gray-100 hover:border-teal-200 transition-all hover:shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] relative overflow-hidden"
                >
                  {/* Left accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-linear-to-b from-[#1E5C58] to-[#6aaea0] rounded-l-2xl group-hover:w-2 transition-all" />

                  <div className="flex justify-between items-start mb-2 pl-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <h4 className="font-bold text-gray-800 tracking-tight">
                        {item.nama_pasien ?? "Anonim"}
                      </h4>
                    </div>
                    <span className="text-xs font-bold font-mono bg-[#E0F2FE] px-2.5 py-1 rounded-full text-[#0284C7] shadow-sm border border-sky-100">
                      {item.waktu ?? "-"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pl-3 mt-3 pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-3.5 h-3.5 text-rose-400" />
                      <p className="text-xs font-semibold text-gray-500">
                        {item.jenis_terapi ?? "Pemeriksaan"}
                      </p>
                    </div>
                    {item.nama_terapis && (
                      <div className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-1 rounded-lg">
                        {item.nama_terapis}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

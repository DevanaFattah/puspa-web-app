"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar as CalendarIcon, Clock, X, CheckCircle2 } from "lucide-react";

import { handleApiError } from "@/lib/api-error";

interface FormAturAsesmenProps {
  onClose: () => void;
  onSave?: (date: string, time: string) => void | Promise<void>;
  initialDate?: string;
  initialTime?: string;
  pasienName?: string;
  title?: string;
}

export default function FormAturAsesmen({
  onClose,
  onSave,
  initialDate = "",
  initialTime = "",
  pasienName,
  title,
}: FormAturAsesmenProps) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDate(initialDate);
    setTime(initialTime);
  }, [initialDate, initialTime]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSave) return;

    if (!date || !time) {
      handleApiError(null, "Tanggal dan Waktu tidak boleh kosong!");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(date, time);
      onClose();
    } catch (err) {
      console.error("onSave error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTitle = pasienName
    ? `Atur Jadwal Asesmen untuk ${pasienName}`
    : "Atur Jadwal Asesmen";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="bg-linear-to-br from-[#2B7A75] to-[#1E5C58] p-5 text-white relative overflow-hidden shrinkage-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <button
              onClick={onClose}
              type="button"
              className="cursor-pointer absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors z-20"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="relative z-10 pr-6">
              <h2 className="text-lg font-bold leading-tight drop-shadow-sm">
                {title || defaultTitle}
              </h2>
              {title && pasienName && (
                <p className="text-sm font-semibold text-teal-100/90 mt-1 line-clamp-1">
                  Pasien: {pasienName}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4 text-[#2B7A75]" /> Tanggal
                  Pelaksanaan
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-700"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#2B7A75]" /> Waktu (Jam)
                </label>
                <input
                  type="time"
                  required
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] outline-none transition-all font-medium text-gray-700"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-8 border-t border-gray-100 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="cursor-pointer px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B7A75] text-white font-bold text-sm hover:bg-[#1E5C58] shadow-md shadow-teal-500/20 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                Simpan Jadwal
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

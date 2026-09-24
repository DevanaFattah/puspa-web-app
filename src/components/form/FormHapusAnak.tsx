"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface FormHapusAnakProps {
  open: boolean;
  onClose: () => void;
  childId?: string;
  onConfirm: (id: string) => void;
}

export default function FormHapusAnak({
  open,
  onClose,
  childId,
  onConfirm,
}: FormHapusAnakProps) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative border border-red-50/50"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-8 flex flex-col items-center text-center">
              {/* Warning Icon */}
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-5 shrink-0">
                <AlertTriangle className="w-8 h-8" />
              </div>

              {/* Title & Body */}
              <h3 className="text-lg font-extrabold text-[#1E5C58]">Hapus Data Anak?</h3>
              <p className="text-xs font-semibold text-gray-400 mt-2 leading-relaxed max-w-xs">
                Tindakan ini tidak dapat dibatalkan. Semua data riwayat dan profil anak ini akan dihapus secara permanen dari sistem.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 w-full mt-6">
                <button
                  onClick={onClose}
                  className="cursor-pointer w-full sm:flex-1 py-3 border border-gray-200 text-gray-500 hover:text-gray-700 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all active:scale-95 text-center"
                >
                  Batal
                </button>
                <button
                  onClick={() => childId && onConfirm(childId)}
                  className="cursor-pointer w-full sm:flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs shadow-md shadow-red-500/10 transition-all active:scale-95 text-center"
                >
                  Hapus Permanen
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

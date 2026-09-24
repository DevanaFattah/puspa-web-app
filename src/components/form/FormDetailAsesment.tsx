"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  X,
  Baby,
  Phone,
  FileText,
  School,
  Clock,
  Activity,
  BriefcaseMedical,
} from "lucide-react";

export default function FormDetailAsesment({
  open,
  onClose,
  pasien,
}: {
  open: boolean;
  onClose: () => void;
  pasien: any | null;
}) {
  if (!open || !pasien) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .scrollable-body::-webkit-scrollbar { width: 5px; }
            .scrollable-body::-webkit-scrollbar-track { background: transparent; }
            .scrollable-body::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
            .scrollable-body::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
          `,
            }}
          />

          {/* Header */}
          <div className="bg-linear-to-br from-[#1E5C58] to-[#2B7A75] p-6 text-white relative overflow-hidden shrinkage-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <button
              onClick={onClose}
              className="cursor-pointer absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white shrink-0">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Rincian Data Asesmen</h2>
                <div className="text-sm font-medium text-white/80 flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {pasien.scheduled_date || "Belum Terjadwal"} &bull;{" "}
                  {pasien.scheduled_time || "-"}
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto scrollable-body space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Anak */}
              <div className="col-span-1 md:col-span-2 flex items-start gap-3 bg-[#F4F9F8] p-4 rounded-2xl border border-teal-50">
                <Baby className="w-5 h-5 text-[#2B7A75] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-[#1E5C58] uppercase tracking-wider mb-2">
                    Informasi Pasien Anak
                  </h3>
                  <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Nama Lengkap
                      </span>
                      <span className="font-bold text-gray-800">
                        {pasien.child_name || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Jenis Kelamin
                      </span>
                      <span className="font-bold text-gray-800 capitalize">
                        {pasien.child_gender || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">Usia</span>
                      <span className="font-bold text-gray-800">
                        {pasien.child_age || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Tanggal Lahir
                      </span>
                      <span className="font-bold text-gray-800">
                        {pasien.child_birth_date || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Asal Sekolah
                      </span>
                      <span className="font-bold text-gray-800">
                        {pasien.child_school || "-"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs block">
                        Alamat
                      </span>
                      <span className="font-bold text-gray-800">
                        {pasien.child_address || "-"}
                      </span>
                    </div>
                    <div className="col-span-2 mt-2 pt-2 border-t border-teal-100">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-[#E6F3F0] text-[#1E5C58]">
                        Tipe Asesmen: {pasien.type || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orangtua & Admin */}
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex-1">
                  <User className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Orangtua / Wali
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center bg-gray-50 p-2 border border-gray-100 rounded-lg">
                        <span className="font-bold text-gray-800 text-sm">
                          {pasien.parent_name || "-"}
                        </span>
                        <span className="text-xs font-bold text-gray-500 px-2 bg-white rounded shadow-sm border border-gray-100">
                          {pasien.parent_type || "Wali"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-2">
                        <Activity className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600 font-medium">
                          Hubungan:{" "}
                          <span className="font-bold text-gray-800">
                            {pasien.relationship || "-"}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-gray-600 font-bold">
                          {pasien.parent_phone || "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-50 shadow-sm">
                <BriefcaseMedical className="w-5 h-5 text-[#5F52BF] shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-[#5F52BF] uppercase tracking-wider mb-2">
                    Tim Penanganan Asesmen
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-indigo-400 text-xs block">
                        Administrator Bertugas
                      </span>
                      <span className="font-bold text-[#36315B]">
                        {pasien.admin_name || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 shrink-0 text-right">
            <button
              onClick={onClose}
              className="cursor-pointer px-5 py-2.5 rounded-xl text-sm font-bold bg-white border border-gray-200 text-gray-700 shadow-sm hover:bg-gray-50 transition-colors"
            >
              Tutup Rincian
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

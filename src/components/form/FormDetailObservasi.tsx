"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  MapPin,
  X,
  Baby,
  Phone,
  FileText,
  School,
  Clock,
  Activity,
  BriefcaseMedical,
  Briefcase,
} from "lucide-react";

export default function FormDetailObservasi({
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
          <div className="bg-linear-to-br from-[#1E5C58] to-[#2B7A75] p-6 text-white relative overflow-hidden shrink-0">
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
                <h2 className="text-xl font-bold">Detail Jadwal Observasi</h2>
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
            {/* Anak */}
            <div className="flex items-start gap-3 bg-[#F4F9F8] p-4 rounded-2xl border border-teal-50">
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
                      {pasien.child_age || "-"} Tahun
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
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs block">
                      Asal Sekolah
                    </span>
                    <span className="font-bold text-gray-800">
                      {pasien.child_school || "-"}
                    </span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500 text-xs block">Alamat</span>
                    <span className="font-bold text-gray-800">
                      {pasien.child_address || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Orangtua & Admin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <User className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Orangtua / Wali
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs block">
                        Nama Pendaftar
                      </span>
                      <span className="font-bold text-gray-800">
                        {pasien.parent_name || "-"}
                        <span className="ml-2 text-[10px] bg-gray-100 px-2 py-0.5 rounded-full capitalize">
                          {pasien.parent_type || "-"}
                        </span>
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 text-xs block">
                        Nomor WhatsApp
                      </span>
                      <span className="font-bold text-gray-800">
                        {pasien.parent_phone || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <Briefcase className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Ditangani Oleh
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400 text-xs block">
                        Administrator
                      </span>
                      <span className="font-bold text-gray-800">
                        {pasien.admin_name || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Keluhan & Layanan */}
            <div className="space-y-3">
              {(pasien.child_complaint || pasien.child_service_choice) && (
                <div className="flex items-center gap-2 mb-1 border-b border-gray-100 pb-2 mt-2">
                  <BriefcaseMedical className="w-4 h-4 text-[#2B7A75]" />
                  <h3 className="font-bold text-[#1E5C58] text-[13px] uppercase tracking-wider">
                    Rekam Layanan & Keluhan
                  </h3>
                </div>
              )}

              {pasien.child_complaint && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 relative overflow-hidden">
                  <Activity className="absolute -right-4 -bottom-4 w-20 h-20 text-amber-500/10 pointer-events-none" />
                  <span className="text-xs font-bold text-amber-700/80 block mb-1">
                    Rincian Keluhan Awal
                  </span>
                  <p className="text-sm text-amber-900 font-medium leading-relaxed">
                    {pasien.child_complaint}
                  </p>
                </div>
              )}

              {pasien.child_service_choice && (
                <div>
                  <span className="text-xs font-bold text-gray-500 block mb-2">
                    Layanan yang Diajukan
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(pasien.child_service_choice) ? (
                      pasien.child_service_choice.map(
                        (service: string, i: number) => (
                          <span
                            key={i}
                            className="bg-gray-100 border border-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs"
                          >
                            {service}
                          </span>
                        ),
                      )
                    ) : (
                      <span className="bg-gray-100 border border-gray-200 text-gray-700 font-semibold px-3 py-1.5 rounded-lg text-xs">
                        {pasien.child_service_choice}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

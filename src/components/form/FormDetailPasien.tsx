/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { X, Baby, Users, Heart, ClipboardList, Info, Phone, Calendar, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface FormDetailPasienProps {
  open: boolean;
  onClose: () => void;
  pasien: any | null;
}

export default function FormDetailPasien({ open, onClose, pasien }: FormDetailPasienProps) {
  if (!open || !pasien) return null;

  const renderOrangTua = (title: string, data: any) => {
    if (!data?.name) return null;

    return (
      <div className="bg-[#F4F9F8]/60 border border-teal-50/50 p-4 rounded-2xl space-y-3">
        <h4 className="text-xs font-bold text-[#1E5C58] flex items-center gap-1.5 uppercase tracking-wider">
          <Users className="w-3.5 h-3.5 text-[#2B7A75]" />
          {title}
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
          <div>
            <p className="text-gray-400 font-semibold">Nama Lengkap</p>
            <p className="font-bold text-[#1E5C58] mt-0.5">{data.name || "-"}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold">NIK</p>
            <p className="font-bold text-[#1E5C58] mt-0.5">{data.identity_number || "-"}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold">Tanggal Lahir</p>
            <p className="font-bold text-[#1E5C58] mt-0.5">{data.birth_date || "-"}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold">Usia</p>
            <p className="font-bold text-[#1E5C58] mt-0.5">{data.age || "-"}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold">Pekerjaan</p>
            <p className="font-bold text-[#1E5C58] mt-0.5">{data.occupation || "-"}</p>
          </div>
          <div>
            <p className="text-gray-400 font-semibold">Hubungan</p>
            <p className="font-bold text-[#1E5C58] mt-0.5">{data.relationship || "-"}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-gray-400 font-semibold">Nomor Telepon</p>
            <p className="font-bold text-[#1E5C58] mt-0.5 flex items-center gap-1.5">
              <Phone className="w-3 h-3 text-[#2B7A75]" />
              {data.phone || "-"}
            </p>
          </div>
        </div>
      </div>
    );
  };

  const ayah = {
    identity_number: pasien.father_identity_number,
    name: pasien.father_name,
    phone: pasien.father_phone,
    birth_date: pasien.father_birth_date,
    age: pasien.father_age,
    occupation: pasien.father_occupation,
    relationship: pasien.father_relationship || "Ayah",
  };

  const ibu = {
    identity_number: pasien.mother_identity_number,
    name: pasien.mother_name,
    phone: pasien.mother_phone,
    birth_date: pasien.mother_birth_date,
    age: pasien.mother_age,
    occupation: pasien.mother_occupation,
    relationship: pasien.mother_relationship || "Ibu",
  };

  const wali = {
    identity_number: pasien.guardian_identity_number,
    name: pasien.guardian_name,
    phone: pasien.guardian_phone,
    birth_date: pasien.guardian_birth_date,
    age: pasien.guardian_age,
    occupation: pasien.guardian_occupation,
    relationship: pasien.guardian_relationship,
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white w-full h-full sm:h-auto sm:max-w-3xl rounded-none sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[90vh]"
        >
          {/* HEADER */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl text-[#2B7A75]">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#1E5C58]">Detail Profil Anak</h2>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Rincian informasi pasien & penanggung jawab</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 cursor-pointer hover:bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 custom-scrollbar">
            {/* SECTION 1: DATA ANAK */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#2B7A75]" />
                Informasi Anak
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F4F9F8]/40 border border-teal-50/50 p-5 rounded-2xl text-xs">
                <div>
                  <p className="text-gray-400 font-semibold">Nama Lengkap</p>
                  <p className="font-extrabold text-[#1E5C58] text-sm mt-0.5">{pasien.child_name || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Tempat, Tanggal Lahir</p>
                  <p className="font-bold text-[#1E5C58] mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#2B7A75]" />
                    {pasien.child_birth_info || pasien.child_birth_date ? `${pasien.child_birth_place || ""}, ${pasien.child_birth_date || ""}` : "-"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Usia</p>
                  <p className="font-bold text-[#1E5C58] mt-0.5">{pasien.child_age || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Jenis Kelamin</p>
                  <p className="font-bold text-[#1E5C58] mt-0.5 capitalize">{pasien.child_gender || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Agama</p>
                  <p className="font-bold text-[#1E5C58] mt-0.5">{pasien.child_religion || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-400 font-semibold">Asal Sekolah</p>
                  <p className="font-bold text-[#1E5C58] mt-0.5">{pasien.child_school || "-"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-gray-400 font-semibold">Alamat</p>
                  <p className="font-bold text-[#1E5C58] mt-0.5 leading-relaxed">{pasien.child_address || "-"}</p>
                </div>
              </div>
            </div>

            {/* SECTION 2: ORANG TUA / WALI */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#2B7A75]" />
                Informasi Orangtua / Wali
              </h3>
              <div className="grid grid-cols-1 gap-4">
                {renderOrangTua("Ayah", ayah)}
                {renderOrangTua("Ibu", ibu)}
                {renderOrangTua("Wali", wali)}
              </div>
            </div>

            {/* SECTION 3: KELUHAN */}
            {pasien.child_complaint && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-red-500" />
                  Keluhan
                </h3>
                <div className="bg-red-50/20 border border-red-50/50 p-4 rounded-2xl text-xs text-[#1E5C58] leading-relaxed">
                  {pasien.child_complaint}
                </div>
              </div>
            )}

            {/* SECTION 4: LAYANAN */}
            {pasien.child_service_choice && (
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <ClipboardList className="w-3.5 h-3.5 text-[#2B7A75]" />
                  Layanan Terpilih
                </h3>
                <div className="bg-[#F4F9F8]/60 border border-teal-50/50 p-4 rounded-2xl text-xs text-[#1E5C58] font-bold">
                  {pasien.child_service_choice}
                </div>
              </div>
            )}
          </div>

          {/* FOOTER */}
          <div className="px-6 py-4 border-t border-gray-100 flex justify-end bg-gray-50/50 shrink-0">
            <button
              onClick={onClose}
              className="cursor-pointer w-full sm:w-auto px-6 py-2.5 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-xl font-bold text-xs shadow-sm transition-all active:scale-95 text-center"
            >
              Tutup
            </button>
          </div>
        </motion.div>
        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar { width: 5px; }
          .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; }
          .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        `}</style>
      </div>
    </AnimatePresence>
  );
}

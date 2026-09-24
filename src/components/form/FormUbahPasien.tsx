/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { X, Baby, Users, Heart, ClipboardList, Info, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sinkronkan interface ini agar cocok dengan ChildDetail dari API
interface BackendDetailAnak {
  child_id?: string;
  child_name: string;

  child_age: string;
  child_gender: string;
  child_religion?: string | null;
  child_birth_place?: string | null;
  child_birth_date?: string | null;
  child_school?: string | null;
  child_address?: string | null;

  father_identity_number?: string | null;
  father_name?: string | null;
  father_birth_date?: string | null;
  father_occupation?: string | null;
  father_phone?: string | null;
  father_relationship?: string | null;

  mother_identity_number?: string | null;
  mother_name?: string | null;
  mother_birth_date?: string | null;
  mother_occupation?: string | null;
  mother_phone?: string | null;
  mother_relationship?: string | null;

  guardian_identity_number?: string | null;
  guardian_name?: string | null;
  guardian_birth_date?: string | null;
  guardian_occupation?: string | null;
  guardian_phone?: string | null;
  guardian_relationship?: string | null;

  child_complaint?: string | null;
  child_service_choice?: string | null;
}

const toLocalISODate = (value?: string | null) => {
  if (!value || value === "-" || value === "0000-00-00") return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const monthMap: { [key: string]: string } = {
    januari: "01", pebruari: "02", februari: "02", maret: "03", april: "04",
    mei: "05", juni: "06", juli: "07", agustus: "08",
    september: "09", oktober: "10", november: "11", desember: "12",
    january: "01", february: "02", march: "03", may: "05",
    june: "06", july: "07", august: "08", october: "10", december: "12"
  };

  const parts = value.split(" ");
  if (parts.length === 3) {
    const day = parts[0].padStart(2, "0");
    const monthStr = parts[1].toLowerCase();
    const year = parts[2];

    if (monthMap[monthStr]) {
      return `${year}-${monthMap[monthStr]}-${day}`;
    }
  }

  const d = new Date(value);
  if (isNaN(d.getTime())) return "";

  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
};

interface FormProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  initialData?: BackendDetailAnak;
}

export default function FormUbahPasien({
  open,
  onClose,
  onUpdate,
  initialData,
}: FormProps) {
  const [formData, setFormData] = useState({
    child_name: "",
    child_age: "",
    child_religion: "",
    child_birth_place: "",
    child_birth_date: "",
    child_gender: "",
    child_school: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: "",

    father_name: "",
    father_birth_date: "",
    father_occupation: "",
    father_phone: "",
    father_relationship: "",
    father_identity_number: "",

    mother_name: "",
    mother_birth_date: "",
    mother_occupation: "",
    mother_phone: "",
    mother_relationship: "",
    mother_identity_number: "",

    guardian_name: "",
    guardian_birth_date: "",
    guardian_occupation: "",
    guardian_phone: "",
    guardian_relationship: "",
    guardian_identity_number: "",
  });

  useEffect(() => {
    if (!initialData) return;

    setFormData({
      child_name: initialData.child_name || "",
      child_birth_place: initialData.child_birth_place || "",
      child_birth_date: toLocalISODate(initialData.child_birth_date),
      child_age: initialData.child_age || "",
      child_religion: initialData.child_religion || "",
      child_gender: initialData.child_gender || "",
      child_school: initialData.child_school || "",
      child_address: initialData.child_address || "",
      child_complaint: initialData.child_complaint || "",
      child_service_choice: initialData.child_service_choice || "",

      father_name: initialData.father_name || "",
      father_birth_date: toLocalISODate(initialData.father_birth_date),
      father_occupation: initialData.father_occupation || "",
      father_phone: initialData.father_phone || "",
      father_relationship: initialData.father_relationship || "Ayah",
      father_identity_number: initialData.father_identity_number || "",

      mother_name: initialData.mother_name || "",
      mother_birth_date: toLocalISODate(initialData.mother_birth_date),
      mother_occupation: initialData.mother_occupation || "",
      mother_phone: initialData.mother_phone || "",
      mother_relationship: initialData.mother_relationship || "Ibu",
      mother_identity_number: initialData.mother_identity_number || "",

      guardian_name: initialData.guardian_name || "",
      guardian_birth_date: toLocalISODate(initialData.guardian_birth_date),
      guardian_occupation: initialData.guardian_occupation || "",
      guardian_phone: initialData.guardian_phone || "",
      guardian_relationship: initialData.guardian_relationship || "",
      guardian_identity_number: initialData.guardian_identity_number || "",
    });
  }, [initialData, open]);

  if (!open) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      // === CHILD ===
      child_name: formData.child_name,
      child_birth_place: formData.child_birth_place,
      child_birth_date: formData.child_birth_date,
      child_age: formData.child_age,
      child_gender: formData.child_gender,
      child_religion: formData.child_religion,
      child_school: formData.child_school,
      child_address: formData.child_address,
      child_complaint: formData.child_complaint,
      child_service_choice: formData.child_service_choice,

      // === AYAH ===
      father_identity_number: formData.father_identity_number?.trim() || null,
      father_name: formData.father_name,
      father_phone: formData.father_phone,
      father_birth_date: formData.father_birth_date || null,
      father_occupation: formData.father_occupation,
      father_relationship: formData.father_relationship,

      // === IBU ===
      mother_identity_number: formData.mother_identity_number?.trim() || null,
      mother_name: formData.mother_name,
      mother_phone: formData.mother_phone,
      mother_birth_date: formData.mother_birth_date || null,
      mother_occupation: formData.mother_occupation,
      mother_relationship: formData.mother_relationship,

      // === WALI ===
      guardian_identity_number: formData.guardian_identity_number?.trim() || null,
      guardian_name: formData.guardian_name || null,
      guardian_phone: formData.guardian_phone || null,
      guardian_birth_date: formData.guardian_birth_date || null,
      guardian_occupation: formData.guardian_occupation || null,
      guardian_relationship: formData.guardian_relationship || null,

      _method: "PUT",
    };

    onUpdate(payload);
  };

  const inputClass = "w-full border border-gray-200 rounded-xl px-4 py-2.5 mt-1 text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] outline-none transition-all bg-[#F4F9F8]/20";
  const labelClass = "block text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm p-0 sm:p-4 transition-all">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="bg-white w-full h-full sm:h-auto sm:max-w-4xl rounded-none sm:rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-screen sm:max-h-[92vh]"
        >
          {/* HEADER */}
          <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl text-[#2B7A75]">
                <Baby className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-extrabold text-[#1E5C58]">Ubah Data Pasien Anak</h2>
                <p className="text-xs text-gray-400 font-semibold mt-0.5">Ubah rincian informasi dan wali penanggung jawab</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 cursor-pointer hover:bg-gray-50 rounded-xl transition-colors text-gray-400">
              <X size={20} />
            </button>
          </div>

          {/* BODY */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 md:p-8 space-y-8 custom-scrollbar">
            {/* SECTION 1: INFORMASI ANAK */}
            <div className="space-y-4">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-[#2B7A75]" />
                Informasi Anak
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Nama Lengkap</label>
                  <input name="child_name" value={formData.child_name} onChange={handleChange} className={inputClass} placeholder="Nama Lengkap" />
                </div>
                <div>
                  <label className={labelClass}>Agama</label>
                  <input name="child_religion" value={formData.child_religion} onChange={handleChange} className={inputClass} placeholder="Islam" />
                </div>
                <div>
                  <label className={labelClass}>Tempat Lahir</label>
                  <input name="child_birth_place" value={formData.child_birth_place} onChange={handleChange} className={inputClass} placeholder="Surakarta" />
                </div>
                <div>
                  <label className={labelClass}>Tanggal Lahir</label>
                  <input type="date" name="child_birth_date" value={formData.child_birth_date} onChange={handleChange} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Usia</label>
                  <input name="child_age" value={formData.child_age} onChange={handleChange} className={inputClass} placeholder="6 Tahun 1 Bulan" />
                </div>
                <div>
                  <label className={labelClass}>Sekolah</label>
                  <input name="child_school" value={formData.child_school} onChange={handleChange} className={inputClass} placeholder="TK Aisyiyah" />
                </div>
                <div>
                  <label className={labelClass}>Jenis Kelamin</label>
                  <select name="child_gender" value={formData.child_gender} onChange={handleChange} className={inputClass}>
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="Laki-Laki">Laki-Laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Alamat</label>
                  <input name="child_address" value={formData.child_address} onChange={handleChange} className={inputClass} placeholder="Jl. Malabar" />
                </div>
              </div>
            </div>

            {/* SECTION 2: INFORMASI ORANGTUA */}
            <div className="space-y-6">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-[#2B7A75]" />
                Informasi Orangtua / Wali
              </h3>

              {/* AYAH */}
              <div className="p-5 border border-teal-50/50 rounded-2xl bg-[#F4F9F8]/20 space-y-4">
                <h4 className="text-xs font-extrabold text-[#1E5C58] tracking-wider uppercase">Ayah</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Nama Ayah</label><input name="father_name" value={formData.father_name} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Hubungan</label><input name="father_relationship" value={formData.father_relationship} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Tanggal Lahir</label><input type="date" name="father_birth_date" value={formData.father_birth_date} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Pekerjaan</label><input name="father_occupation" value={formData.father_occupation} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Nomor Telpon</label><input name="father_phone" value={formData.father_phone} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>NIK</label><input name="father_identity_number" value={formData.father_identity_number} onChange={handleChange} className={inputClass} /></div>
                </div>
              </div>

              {/* IBU */}
              <div className="p-5 border border-teal-50/50 rounded-2xl bg-[#F4F9F8]/20 space-y-4">
                <h4 className="text-xs font-extrabold text-[#1E5C58] tracking-wider uppercase">Ibu</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Nama Ibu</label><input name="mother_name" value={formData.mother_name} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Hubungan</label><input name="mother_relationship" value={formData.mother_relationship} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Tanggal Lahir</label><input type="date" name="mother_birth_date" value={formData.mother_birth_date} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Pekerjaan</label><input name="mother_occupation" value={formData.mother_occupation} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Nomor Telpon</label><input name="mother_phone" value={formData.mother_phone} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>NIK</label><input name="mother_identity_number" value={formData.mother_identity_number} onChange={handleChange} className={inputClass} /></div>
                </div>
              </div>

              {/* WALI */}
              <div className="p-5 border border-teal-50/50 rounded-2xl bg-[#F4F9F8]/20 space-y-4">
                <h4 className="text-xs font-extrabold text-[#1E5C58] tracking-wider uppercase flex items-center gap-1.5">
                  Wali <span className="text-[10px] font-medium text-gray-400 italic font-semibold">(Opsional)</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div><label className={labelClass}>Nama Wali</label><input name="guardian_name" value={formData.guardian_name} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Hubungan</label><input name="guardian_relationship" value={formData.guardian_relationship} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Tanggal Lahir</label><input type="date" name="guardian_birth_date" value={formData.guardian_birth_date} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Pekerjaan</label><input name="guardian_occupation" value={formData.guardian_occupation} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>Nomor Telpon</label><input name="guardian_phone" value={formData.guardian_phone} onChange={handleChange} className={inputClass} /></div>
                  <div><label className={labelClass}>NIK</label><input name="guardian_identity_number" value={formData.guardian_identity_number} onChange={handleChange} className={inputClass} /></div>
                </div>
              </div>
            </div>

            {/* SECTION 3: KELUHAN */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <Heart className="w-3.5 h-3.5 text-red-500" />
                Keluhan Utama
              </h3>
              <textarea name="child_complaint" value={formData.child_complaint} onChange={handleChange} rows={3} className={`${inputClass} resize-none`} placeholder="Tuliskan keluhan di sini..." />
            </div>

            {/* SECTION 4: LAYANAN */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                <ClipboardList className="w-3.5 h-3.5 text-[#2B7A75]" />
                Layanan Terpilih
              </h3>
              <div className="bg-[#F4F9F8]/60 p-4 rounded-xl border border-teal-50/50">
                <ul className="list-disc list-inside text-xs font-bold text-[#1E5C58] space-y-1">
                  {formData.child_service_choice?.split(",").map((s, i) => (
                    <li key={i}>{s.trim()}</li>
                  ))}
                </ul>
              </div>
            </div>
          </form>

          {/* FOOTER */}
          <div className="p-5 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 bg-gray-50/50 shrink-0">
            <button type="button" onClick={onClose} className="cursor-pointer w-full sm:flex-1 py-3 border border-[#2B7A75] text-[#2B7A75] rounded-xl font-bold text-xs hover:bg-teal-50/20 transition-all order-2 sm:order-1">
              Batal
            </button>
            <button onClick={handleSubmit} className="cursor-pointer w-full sm:flex-1 py-3 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-xl font-bold text-xs shadow-md shadow-teal-500/10 transition-all order-1 sm:order-2">
              Perbarui Data
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
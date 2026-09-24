"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PatientDetail } from "@/lib/api/data_patient";
import { handleApiError } from "@/lib/api-error";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  X,
  Baby,
  School,
  Users,
  BriefcaseMedical,
  Edit3,
  HeartPulse,
} from "lucide-react";

export interface FormUbahPatientProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  initialData?: PatientDetail | null;
}

const toISODate = (value?: string) => {
  if (!value || value === "-") return "";
  const d = new Date(value);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const parseBirthInfo = (str?: string) => {
  if (!str) return { place: "", date: "" };
  const [place, date] = str.split(", ");
  return { place: place || "", date: date || "" };
};

export default function FormUbahPatient({
  open,
  onClose,
  onUpdate,
  initialData,
}: FormUbahPatientProps) {
  const [form, setForm] = useState({
    child_name: "",
    child_birth_date: "",
    child_gender: "",
    child_school: "",
    child_address: "",
    father_identity_number: "",
    father_name: "",
    father_phone: "",
    father_birth_date: "",
    father_occupation: "",
    father_relationship: "",
    mother_identity_number: "",
    mother_name: "",
    mother_phone: "",
    mother_birth_date: "",
    mother_occupation: "",
    mother_relationship: "",
    guardian_identity_number: "",
    guardian_name: "",
    guardian_phone: "",
    guardian_birth_date: "",
    guardian_occupation: "",
    guardian_relationship: "",
    child_complaint: "",
    child_service_choice: "",
  });

  useEffect(() => {
    if (!initialData) return;
    const parsed = parseBirthInfo(initialData.child_birth_info);

    setForm({
      child_name: initialData.child_name ?? "",
      child_birth_date: toISODate(parsed.date),
      child_gender: initialData.child_gender ?? "",
      child_school: initialData.child_school ?? "",
      child_address: initialData.child_address ?? "",
      father_identity_number: initialData.father_identity_number ?? "",
      father_name: initialData.father_name ?? "",
      father_phone: initialData.father_phone ?? "",
      father_birth_date: toISODate(initialData.father_birth_date),
      father_occupation: initialData.father_occupation ?? "",
      father_relationship: initialData.father_relationship ?? "",
      mother_identity_number: initialData.mother_identity_number ?? "",
      mother_name: initialData.mother_name ?? "",
      mother_phone: initialData.mother_phone ?? "",
      mother_birth_date: toISODate(initialData.mother_birth_date),
      mother_occupation: initialData.mother_occupation ?? "",
      mother_relationship: initialData.mother_relationship ?? "",
      guardian_identity_number: initialData.guardian_identity_number ?? "",
      guardian_name: initialData.guardian_name ?? "",
      guardian_phone: initialData.guardian_phone ?? "",
      guardian_birth_date: toISODate(initialData.guardian_birth_date ?? ""),
      guardian_occupation: initialData.guardian_occupation ?? "",
      guardian_relationship: initialData.guardian_relationship ?? "",
      child_complaint: initialData.child_complaint ?? "",
      child_service_choice: initialData.child_service_choice ?? "",
    });
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const emptyToNull = (v?: string) => {
    if (!v) return null;
    const trimmed = v.trim();
    if (trimmed === "" || trimmed === "-") return null;
    return trimmed;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.child_birth_date.trim()) {
      handleApiError(null, "Tanggal lahir anak wajib diisi");
      return;
    }

    onUpdate({
      child_name: form.child_name.trim(),
      child_birth_date: form.child_birth_date,
      child_gender: emptyToNull(form.child_gender),
      child_school: emptyToNull(form.child_school) ?? "",
      child_address: emptyToNull(form.child_address) ?? "",
      father_identity_number: emptyToNull(form.father_identity_number),
      father_name: emptyToNull(form.father_name),
      father_phone: emptyToNull(form.father_phone),
      father_birth_date: emptyToNull(form.father_birth_date),
      father_occupation: emptyToNull(form.father_occupation),
      father_relationship: emptyToNull(form.father_relationship),
      mother_identity_number: emptyToNull(form.mother_identity_number),
      mother_name: emptyToNull(form.mother_name),
      mother_phone: emptyToNull(form.mother_phone),
      mother_birth_date: emptyToNull(form.mother_birth_date),
      mother_occupation: emptyToNull(form.mother_occupation),
      mother_relationship: emptyToNull(form.mother_relationship),
      guardian_identity_number: emptyToNull(form.guardian_identity_number),
      guardian_name: emptyToNull(form.guardian_name),
      guardian_phone: emptyToNull(form.guardian_phone),
      guardian_birth_date: emptyToNull(form.guardian_birth_date),
      guardian_occupation: emptyToNull(form.guardian_occupation),
      guardian_relationship: emptyToNull(form.guardian_relationship),
      child_complaint: emptyToNull(form.child_complaint) ?? "",
      child_service_choice: form.child_service_choice ?? "",
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
            .scrollable-body::-webkit-scrollbar { width: 5px; }
            .scrollable-body::-webkit-scrollbar-track { background: transparent; }
            .scrollable-body::-webkit-scrollbar-thumb { background: #f59e0b; border-radius: 10px; }
            .scrollable-body::-webkit-scrollbar-thumb:hover { background: #d97706; }
          `,
            }}
          />

          {/* Header */}
          <div className="bg-linear-to-br from-amber-500 to-amber-600 p-6 text-white relative overflow-hidden shrink-0">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <button
              onClick={onClose}
              className="cursor-pointer absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors z-20"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white shrink-0">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Ubah Data Pasien Anak</h2>
                <div className="text-xs font-semibold text-white/80 mt-1">
                  Pembaruan data medis, orangtua, dan rekam layanan.
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 overflow-y-auto scrollable-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Anak */}
              <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                <div className="flex items-center gap-2 mb-3 border-b border-amber-100 pb-2">
                  <Baby className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-amber-700 text-sm uppercase tracking-wider">
                    Identitas Pasien Anak
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Nama
                    </label>
                    <input
                      type="text"
                      name="child_name"
                      value={form.child_name}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="child_birth_date"
                      value={form.child_birth_date}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-500/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Jenis Kelamin
                    </label>
                    <select
                      name="child_gender"
                      value={form.child_gender}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-500/20"
                    >
                      <option value="">Pilih Gender</option>
                      <option value="laki-laki">Laki-Laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Asal Sekolah
                    </label>
                    <input
                      type="text"
                      name="child_school"
                      value={form.child_school}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Usia Anak (Saat Ini)
                    </label>
                    <input
                      type="text"
                      value={initialData?.child_age ?? "-"}
                      readOnly
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-500"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Alamat
                    </label>
                    <textarea
                      name="child_address"
                      rows={2}
                      value={form.child_address}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                </div>
              </div>

              {/* Data Orang Tua */}
              <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                <div className="flex items-center gap-2 mb-3 border-b border-amber-100 pb-2">
                  <Users className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-amber-700 text-sm uppercase tracking-wider">
                    Informasi Orangtua / Wali
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Ayah */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <h4 className="font-bold text-gray-700 border-b pb-1 text-sm border-gray-100">
                      Profile Ayah
                    </h4>
                    <div>
                      <label className="text-xs text-gray-500">Nama</label>
                      <input
                        name="father_name"
                        value={form.father_name}
                        onChange={handleChange}
                        className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">
                          Tgl Lahir
                        </label>
                        <input
                          type="date"
                          name="father_birth_date"
                          value={form.father_birth_date}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Kerja</label>
                        <input
                          name="father_occupation"
                          value={form.father_occupation}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">NIK</label>
                        <input
                          name="father_identity_number"
                          value={form.father_identity_number}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Telp</label>
                        <input
                          name="father_phone"
                          value={form.father_phone}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ibu */}
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                    <h4 className="font-bold text-gray-700 border-b pb-1 text-sm border-gray-100">
                      Profile Ibu
                    </h4>
                    <div>
                      <label className="text-xs text-gray-500">Nama</label>
                      <input
                        name="mother_name"
                        value={form.mother_name}
                        onChange={handleChange}
                        className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">
                          Tgl Lahir
                        </label>
                        <input
                          type="date"
                          name="mother_birth_date"
                          value={form.mother_birth_date}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Kerja</label>
                        <input
                          name="mother_occupation"
                          value={form.mother_occupation}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs text-gray-500">NIK</label>
                        <input
                          name="mother_identity_number"
                          value={form.mother_identity_number}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">Telp</label>
                        <input
                          name="mother_phone"
                          value={form.mother_phone}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3 col-span-1 md:col-span-2">
                    <h4 className="font-bold text-gray-700 border-b pb-1 text-sm border-gray-100">
                      Wali (Opsional)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">Nama</label>
                        <input
                          name="guardian_name"
                          value={form.guardian_name}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Hubungan
                        </label>
                        <input
                          name="guardian_relationship"
                          value={form.guardian_relationship}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs text-gray-500">
                          Tgl Lahir
                        </label>
                        <input
                          type="date"
                          name="guardian_birth_date"
                          value={form.guardian_birth_date}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">NIK</label>
                        <input
                          name="guardian_identity_number"
                          value={form.guardian_identity_number}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500">
                          Telp. Wali
                        </label>
                        <input
                          name="guardian_phone"
                          value={form.guardian_phone}
                          onChange={handleChange}
                          className="w-full p-2 border-b border-gray-200 focus:border-amber-500 outline-none text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Layanan & Keluhan */}
              <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50">
                <div className="flex items-center gap-2 mb-3 border-b border-amber-100 pb-2">
                  <BriefcaseMedical className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-amber-700 text-sm uppercase tracking-wider">
                    Layanan & Keluhan Medis
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Rincian Keluhan
                    </label>
                    <textarea
                      name="child_complaint"
                      rows={3}
                      value={form.child_complaint}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-white border border-amber-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-amber-500/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-amber-700/80 mb-1 block">
                      Layanan Terpilih Sistem
                    </label>
                    <div className="w-full p-3 bg-white border border-amber-100 rounded-xl text-sm font-medium text-amber-800">
                      {form.child_service_choice ||
                        "Belum ada layanan yang terpilih"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100 mt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="cursor-pointer px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold text-sm hover:bg-amber-600 shadow-md shadow-amber-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

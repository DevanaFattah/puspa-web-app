"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  HeartPulse,
} from "lucide-react";
import { addPatient } from "@/lib/api/data_patient";

interface FormTambahPasienProps {
  open: boolean;
  onClose: () => void;
}

export default function FormTambahPasien({
  open,
  onClose,
}: FormTambahPasienProps) {
  const [form, setForm] = useState({
    child_name: "",
    child_gender: "",
    child_birth_place: "",
    child_birth_date: "",
    child_school: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: [] as string[],
    email: "",
    guardian_name: "",
    guardian_phone: "",
    guardian_type: "ayah" as "ayah" | "ibu" | "wali",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const REQUIRED_MESSAGE = "Wajib diisi";

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (service: string) => {
    setForm((prev) => {
      const updated = prev.child_service_choice.includes(service)
        ? prev.child_service_choice.filter((s) => s !== service)
        : [...prev.child_service_choice, service];
      return { ...prev, child_service_choice: updated };
    });
    setErrors((prev) => ({ ...prev, child_service_choice: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!form.child_name.trim()) newErrors.child_name = REQUIRED_MESSAGE;
    if (!form.child_gender) newErrors.child_gender = REQUIRED_MESSAGE;
    if (!form.child_birth_place.trim())
      newErrors.child_birth_place = REQUIRED_MESSAGE;
    if (!form.child_birth_date) newErrors.child_birth_date = REQUIRED_MESSAGE;
    if (!form.child_address.trim()) newErrors.child_address = REQUIRED_MESSAGE;
    if (!form.child_complaint.trim())
      newErrors.child_complaint = REQUIRED_MESSAGE;
    if (!form.guardian_name.trim()) newErrors.guardian_name = REQUIRED_MESSAGE;
    if (!form.guardian_phone.trim())
      newErrors.guardian_phone = REQUIRED_MESSAGE;
    if (!form.email.trim()) newErrors.email = REQUIRED_MESSAGE;
    if (form.child_service_choice.length === 0)
      newErrors.child_service_choice = "Pilih minimal 1 layanan";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      child_name: form.child_name,
      child_gender: form.child_gender,
      child_birth_place: form.child_birth_place,
      child_birth_date: form.child_birth_date,
      child_school: form.child_school,
      child_address: form.child_address,
      child_complaint: form.child_complaint,
      child_service_choice: form.child_service_choice.join(", "),
      parent_name: form.guardian_name,
      parent_phone: form.guardian_phone,
      parent_email: form.email,
      guardian_type: form.guardian_type,
    };

    try {
      await addPatient(payload);
      onClose();
    } catch (err: any) {
      console.error("Gagal menambah pasien", err);
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative max-h-[90vh] flex flex-col"
        >
          {/* Custom Scrollbar */}
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
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white shrink-0">
                <Baby className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Pendaftaran Pasien Anak</h2>
                <div className="text-xs font-semibold text-white/80 mt-1">
                  Registrasi awal untuk pelayanan asesmen / terapi.
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto scrollable-body">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Seksi Data Anak */}
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <Baby className="w-4 h-4 text-[#2B7A75]" />
                  <h3 className="font-bold text-[#1E5C58] text-sm uppercase tracking-wider">
                    Identitas Pasien Anak
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Nama Lengkap Anak
                    </label>
                    <input
                      type="text"
                      name="child_name"
                      placeholder="cth. Budi Kecil"
                      value={form.child_name}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.child_name ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.child_name && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.child_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Tempat Lahir
                    </label>
                    <input
                      type="text"
                      name="child_birth_place"
                      placeholder="cth. Jakarta"
                      value={form.child_birth_place}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.child_birth_place ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.child_birth_place && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.child_birth_place}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      name="child_birth_date"
                      value={form.child_birth_date}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.child_birth_date ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.child_birth_date && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.child_birth_date}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Jenis Kelamin
                    </label>
                    <select
                      name="child_gender"
                      value={form.child_gender}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.child_gender ? "border-red-300" : "border-gray-200"}`}
                    >
                      <option value="">Pilih Gender</option>
                      <option value="laki-laki">Laki-Laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                    {errors.child_gender && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.child_gender}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Sekolah (Opsional)
                    </label>
                    <input
                      type="text"
                      name="child_school"
                      placeholder="cth. TK Pertiwi"
                      value={form.child_school}
                      onChange={handleChange}
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75]"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Alamat Lengkap
                    </label>
                    <textarea
                      name="child_address"
                      rows={2}
                      placeholder="Sertakan kecamatan & kota"
                      value={form.child_address}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.child_address ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.child_address && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.child_address}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seksi Orang Tua */}
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <Users className="w-4 h-4 text-[#2B7A75]" />
                  <h3 className="font-bold text-[#1E5C58] text-sm uppercase tracking-wider">
                    Informasi Pendaftar / Orangtua
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Tipe Penanggung Jawab
                    </label>
                    <div className="flex gap-4">
                      {["ayah", "ibu", "wali"].map((type) => (
                        <label
                          key={type}
                          className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="guardian_type"
                            value={type}
                            checked={form.guardian_type === type}
                            onChange={handleChange}
                            className="accent-[#2B7A75] w-4 h-4"
                          />
                          <span className="capitalize">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Nama Penanggung Jawab
                    </label>
                    <input
                      type="text"
                      name="guardian_name"
                      placeholder="Nama lengkap wali"
                      value={form.guardian_name}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.guardian_name ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.guardian_name && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.guardian_name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Nomor WhatsApp
                    </label>
                    <input
                      type="text"
                      name="guardian_phone"
                      placeholder="0812xxxxxx"
                      value={form.guardian_phone}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.guardian_phone ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.guardian_phone && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.guardian_phone}
                      </p>
                    )}
                  </div>

                  <div className="col-span-1 md:col-span-2">
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Email Aktif
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@contoh.com"
                      value={form.email}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.email ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.email && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seksi Layanan & Keluhan */}
              <div>
                <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-2">
                  <BriefcaseMedical className="w-4 h-4 text-[#2B7A75]" />
                  <h3 className="font-bold text-[#1E5C58] text-sm uppercase tracking-wider">
                    Layanan & Keluhan
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Pilihan Layanan (Bisa lebih dari 1)
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {[
                        "Asesmen Tumbuh Kembang",
                        "Asesmen Terpadu",
                        "Konsultasi Dokter",
                        "Konsultasi Psikolog",
                        "Konsultasi Keluarga",
                        "Test Psikolog",
                        "Layanan Minat Bakat",
                        "Daycare",
                        "Home Care",
                        "Hydrotherapy",
                        "Baby Spa",
                        "Lainnya",
                      ].map((item) => (
                        <label
                          key={item}
                          className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg border border-gray-100 cursor-pointer hover:bg-[#F4F9F8] transition-colors"
                        >
                          <input
                            type="checkbox"
                            checked={form.child_service_choice.includes(item)}
                            onChange={() => toggleService(item)}
                            className="accent-[#2B7A75] w-4 h-4 rounded"
                          />
                          <span className="text-[11px] font-medium text-gray-700 leading-tight">
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                    {errors.child_service_choice && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.child_service_choice}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-600 mb-1 block">
                      Keluhan Anak Permulaan
                    </label>
                    <textarea
                      name="child_complaint"
                      rows={3}
                      placeholder="Jelaskan secara singkat rujukan atau keluhan pertumbuhan anak"
                      value={form.child_complaint}
                      onChange={handleChange}
                      className={`w-full p-2.5 bg-gray-50 border rounded-xl outline-none text-sm transition-all focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] ${errors.child_complaint ? "border-red-300" : "border-gray-200"}`}
                    />
                    {errors.child_complaint && (
                      <p className="text-[10px] text-red-500 mt-1">
                        {errors.child_complaint}
                      </p>
                    )}
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
                  Batalkan
                </button>
                <button
                  type="submit"
                  className="cursor-pointer px-6 py-2.5 rounded-xl bg-[#2B7A75] text-white font-bold text-sm hover:bg-[#1E5C58] shadow-md shadow-teal-500/20 active:scale-95 transition-all flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Daftarkan Pasien
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

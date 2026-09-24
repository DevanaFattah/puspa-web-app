/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { X, Plus, Baby, Calendar, Users, Info, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ResponsiveOrangtuaLayout from "@/components/layout/ResponsiveOrangtuaLayout";
import {
  getChildren,
  getChildDetail,
  updateChild,
  deleteChild,
  createChild,
  ChildItem,
  ChildDetail,
} from "@/lib/api/childrenAsesment";

import FormDetailPasien from "@/components/form/FormDetailPasien";
import FormUbahPasien from "@/components/form/FormUbahPasien";
import FormHapusAnak from "@/components/form/FormHapusAnak";

import { FaEye, FaPen, FaTrash } from "react-icons/fa";

export default function ChildList() {
  const [children, setChildren] = useState<ChildItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildDetail | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Initial State Lengkap sesuai ChildDetail
  const [formAdd, setFormAdd] = useState({
    child_name: "",
    child_gender: "",
    child_birth_place: "",
    child_birth_date: "",
    child_school: "",
    child_religion: "",
    child_address: "",
    child_complaint: "",
    child_service_choice: [] as string[],

    // Father Info
    father_identity_number: "",
    father_name: "",
    father_phone: "",
    father_birth_date: "",
    father_occupation: "",
    father_relationship: "Ayah Kandung",

    // Mother Info
    mother_identity_number: "",
    mother_name: "",
    mother_phone: "",
    mother_birth_date: "",
    mother_occupation: "",
    mother_relationship: "Ibu Kandung",

    // Guardian Info
    guardian_identity_number: "",
    guardian_name: "",
    guardian_phone: "",
    guardian_birth_date: "",
    guardian_occupation: "",
    guardian_relationship: "",
  });

  const handleAddChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    if (
      name === "child_service_choice" &&
      e.target instanceof HTMLInputElement &&
      e.target.type === "checkbox"
    ) {
      const checked = e.target.checked;
      setFormAdd((prev) => {
        let newArray = [...prev.child_service_choice];
        if (checked) {
          newArray.push(value);
        } else {
          newArray = newArray.filter((v) => v !== value);
        }
        return { ...prev, child_service_choice: newArray };
      });
    } else {
      setFormAdd((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await getChildren();
        setChildren(res.data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleOpenDetail(id: string) {
    const data = await getChildDetail(id);
    setSelectedChild(data);
    setOpenDetail(true);
  }

  async function handleOpenEdit(id: string) {
    const data = await getChildDetail(id);
    setSelectedChild({ ...data, child_id: id });
    setOpenEdit(true);
  }

  const handleOpenDelete = (id: string) => {
    setDeleteId(id);
    setOpenDelete(true);
  };

  const handleHapus = async (id: string) => {
    await deleteChild(id);
    const refreshed = await getChildren();
    setChildren(refreshed.data || []);
    setOpenDelete(false);
  };

  const handleUbah = async (payload: Partial<ChildDetail>) => {
    if (!selectedChild) return;

    const cleanPayload: any = { ...payload };

    const guardianFields = [
      "guardian_identity_number",
      "guardian_name",
      "guardian_phone",
      "guardian_birth_date",
      "guardian_occupation",
      "guardian_relationship",
    ];

    guardianFields.forEach((field) => {
      const newValue = cleanPayload[field as keyof ChildDetail];
      const oldValue = selectedChild[field as keyof ChildDetail];

      // kalau kosong -> null
      if (newValue === "") {
        cleanPayload[field] = null;
      }

      // kalau tidak berubah -> hapus dari payload
      if (newValue === oldValue) {
        delete cleanPayload[field];
      }
    });

    await updateChild(selectedChild.child_id, cleanPayload);

    const updatedDetail = await getChildDetail(selectedChild.child_id);
    setSelectedChild(updatedDetail);

    const refreshed = await getChildren();
    setChildren(refreshed.data || []);

    setOpenEdit(false);
  };

  async function handleTambah() {
    const payload: any = {
      ...formAdd,
      child_service_choice: formAdd.child_service_choice.join(", "),
    };

    const guardianFields = [
      "guardian_identity_number",
      "guardian_name",
      "guardian_phone",
      "guardian_birth_date",
      "guardian_occupation",
      "guardian_relationship",
    ];

    guardianFields.forEach((field) => {
      if (!payload[field] || payload[field].trim() === "") {
        payload[field] = null;
      }
    });

    try {
      await createChild(payload);

      const refreshed = await getChildren();
      setChildren(refreshed.data || []);
      setOpenAdd(false);
    } catch (err: any) {
      if (err.response?.status === 422) {
        const errors = err.response?.data?.errors as
          | Record<string, string[]>
          | undefined;
        const firstError = errors ? Object.values(errors)[0]?.[0] : null;
        alert(firstError || "Validasi gagal");
        return;
      }
      alert("Terjadi kesalahan server");
    }
  }

  const filtered = children.filter((c) =>
    c.child_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ResponsiveOrangtuaLayout maxWidth="max-w-none">
      <div className="space-y-5 text-[#1E5C58]">
        {/* Header — Admin Style */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <Baby className="w-6 h-6 text-[#2B7A75]" />
              Manajemen Data Anak
            </h1>
            <p className="text-gray-400 text-xs font-semibold mt-1">
              Kelola informasi profil dan riwayat medis anak Anda
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 px-3 py-2.5 bg-white rounded-xl border border-teal-50 shadow-[0_2px_10px_rgba(43,122,117,0.05)] text-gray-400 focus-within:border-[#2B7A75] focus-within:ring-2 focus-within:ring-[#2B7A75]/10 transition-all flex-1 sm:w-52">
              <Search className="w-4 h-4 shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama anak..."
                className="bg-transparent border-none outline-none text-sm text-gray-600 w-full"
              />
            </div>
            <button
              onClick={() => setOpenAdd(true)}
              className="cursor-pointer flex items-center gap-2 bg-[#2B7A75] hover:bg-[#1E5C58] text-white px-4 py-2.5 rounded-xl font-bold shadow-md shadow-teal-500/10 transition-all active:scale-95 text-sm whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Tambah</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin" />
            <p className="text-gray-400 font-medium animate-pulse text-sm">Sinkronisasi data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-3xl border border-teal-50 flex flex-col items-center justify-center py-24 space-y-3 text-gray-400">
            <Baby className="w-12 h-12 opacity-30" />
            <p className="font-semibold text-sm">Belum ada data anak</p>
          </div>
        ) : (
          <>
            {/* ── MOBILE: Card List (< md) ── */}
            <div className="flex flex-col gap-3 md:hidden">
              {filtered.map((child, index) => (
                <motion.div
                  key={child.child_id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl border border-teal-50 shadow-[0_4px_20px_rgb(0,0,0,0.03)] p-4"
                >
                  {/* Top: avatar + name + status */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center text-2xl shrink-0">👶</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#1E5C58] text-sm truncate">{child.child_name}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-gray-400 text-[11px] font-semibold">
                        <Calendar size={11} className="text-[#2B7A75]" />
                        <span>{child.child_birth_date}</span>
                        <span>·</span>
                        <Users size={11} className="text-[#2B7A75]" />
                        <span className="capitalize">{child.child_gender}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-green-50 text-green-700 uppercase tracking-wider whitespace-nowrap">Aktif</span>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenDetail(child.child_id)}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 text-[#2B7A75] text-xs font-bold transition-all active:scale-95"
                    >
                      <FaEye size={12} /> Detail
                    </button>
                    <button
                      onClick={() => handleOpenEdit(child.child_id)}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-all active:scale-95"
                    >
                      <FaPen size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleOpenDelete(child.child_id)}
                      className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 text-xs font-bold transition-all active:scale-95"
                    >
                      <FaTrash size={11} /> Hapus
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── DESKTOP: Table (≥ md) ── */}
            <div className="hidden md:block bg-white rounded-3xl border border-teal-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-[#F4F9F8]">
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70 w-12">NO</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">INFO ANAK</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">TANGGAL LAHIR</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">JENIS KELAMIN</th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">STATUS</th>
                      <th className="text-right px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-[#2B7A75]/70">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((child, index) => (
                      <motion.tr
                        key={child.child_id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.04 }}
                        className="hover:bg-[#F4F9F8]/60 transition-colors duration-150 group"
                      >
                        <td className="px-6 py-4 text-gray-400 font-semibold">{index + 1}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition-transform duration-200">👶</div>
                            <p className="font-bold text-[#1E5C58]">{child.child_name}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-500 font-semibold text-xs">
                            <Calendar size={13} className="text-[#2B7A75] shrink-0" />
                            {child.child_birth_date}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-gray-500 font-semibold text-xs capitalize">
                            <Users size={13} className="text-[#2B7A75] shrink-0" />
                            {child.child_gender}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-green-50 text-green-700 uppercase tracking-wider">AKTIF</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-1">
                            <button onClick={() => handleOpenDetail(child.child_id)} className="p-2 cursor-pointer text-gray-400 hover:text-[#2B7A75] hover:bg-teal-50 rounded-lg transition-colors" title="Detail"><FaEye size={15} /></button>
                            <button onClick={() => handleOpenEdit(child.child_id)} className="p-2 cursor-pointer text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><FaPen size={13} /></button>
                            <button onClick={() => handleOpenDelete(child.child_id)} className="p-2 cursor-pointer text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus"><FaTrash size={13} /></button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================= MODALS ================= */}
      <FormDetailPasien
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        pasien={selectedChild}
      />
      <FormUbahPasien
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        initialData={selectedChild || undefined}
        onUpdate={handleUbah}
      />
      <FormHapusAnak
        open={openDelete}
        onClose={() => setOpenDelete(false)}
        childId={deleteId ?? undefined}
        onConfirm={(id) => handleHapus(id)}
      />

      {/* MODAL TAMBAH ANAK */}
      <AnimatePresence>
        {openAdd && (
          <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white w-full max-w-4xl rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-50 rounded-xl text-[#2B7A75]">
                    <Baby size={24} />
                  </div>
                  <h2 className="text-xl font-extrabold text-[#1E5C58]">
                    Pendaftaran Data Pasien Baru
                  </h2>
                </div>
                <button
                  onClick={() => setOpenAdd(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-405 cursor-pointer"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-10 custom-scrollbar">
                {/* SECTION INFORMASI ANAK */}
                <div className="space-y-6">
                  <h3 className="font-extrabold text-[#1E5C58] text-sm md:text-base border-l-4 border-[#2B7A75] pl-3">
                    Identitas Anak
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Nama Lengkap <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="child_name"
                        value={formAdd.child_name}
                        onChange={handleAddChange}
                        className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700"
                        placeholder="Contoh: Zahara Prameswari"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Tempat Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="child_birth_place"
                        value={formAdd.child_birth_place}
                        onChange={handleAddChange}
                        className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700"
                        placeholder="Kota lahir"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="child_birth_date"
                        value={formAdd.child_birth_date}
                        onChange={handleAddChange}
                        className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Agama
                      </label>
                      <select
                        name="child_religion"
                        value={formAdd.child_religion}
                        onChange={handleAddChange}
                        className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700 bg-white"
                      >
                        <option value="">Pilih Agama</option>
                        <option value="Islam">Islam</option>
                        <option value="Kristen">Kristen</option>
                        <option value="Katolik">Katolik</option>
                        <option value="Hindu">Hindu</option>
                        <option value="Budha">Budha</option>
                        <option value="Konghucu">Konghucu</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                        Sekolah
                      </label>
                      <input
                        name="child_school"
                        value={formAdd.child_school}
                        onChange={handleAddChange}
                        className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700"
                        placeholder="Nama sekolah saat ini"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["laki-laki", "perempuan"].map((g) => (
                        <label
                          key={g}
                          className="relative flex items-center justify-center gap-2 border-2 border-gray-100 rounded-2xl py-3.5 cursor-pointer transition-all has-[:checked]:bg-teal-50/60 has-[:checked]:border-[#2B7A75]"
                        >
                          <input
                            type="radio"
                            name="child_gender"
                            value={g}
                            checked={formAdd.child_gender === g}
                            onChange={handleAddChange}
                            className="hidden"
                          />
                          <span className="capitalize text-sm font-bold text-gray-600">
                            {g === "laki-laki"
                              ? "👦 Laki-laki"
                              : "👧 Perempuan"}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      Alamat Domisili <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="child_address"
                      value={formAdd.child_address}
                      onChange={handleAddChange}
                      rows={2}
                      className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700"
                      placeholder="Alamat lengkap sesuai KTP/Domisili"
                    />
                  </div>
                </div>

                {/* SECTION KELUHAN & LAYANAN */}
                <div className="space-y-6">
                  <h3 className="font-extrabold text-[#1E5C58] text-sm md:text-base border-l-4 border-[#2B7A75] pl-3">
                    Detail Keluhan & Layanan
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">
                      Keluhan Utama <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="child_complaint"
                      value={formAdd.child_complaint}
                      onChange={handleAddChange}
                      rows={3}
                      className="w-full border border-gray-200 rounded-2xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#2B7A75]/10 focus:border-[#2B7A75] transition-all text-sm font-semibold text-gray-700"
                      placeholder="Jelaskan alasan pemeriksaan atau keluhan anak saat ini"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-xs font-bold text-gray-500 uppercase ml-1 flex items-center gap-2">
                      <Info size={14} /> Layanan yang Dibutuhkan{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                          className="group flex items-center gap-3 p-4 border border-gray-100 rounded-2xl hover:bg-gray-50 cursor-pointer transition-colors has-[:checked]:bg-teal-50/60 has-[:checked]:border-[#2B7A75]"
                        >
                          <input
                            type="checkbox"
                            value={item}
                            onChange={handleAddChange}
                            name="child_service_choice"
                            checked={formAdd.child_service_choice.includes(
                              item,
                            )}
                            className="w-5 h-5 rounded accent-[#2B7A75] text-[#2B7A75]"
                          />
                          <span className="text-sm font-semibold text-gray-700">
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-gray-100 bg-[#F4F9F8]/50 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setOpenAdd(false)}
                  className="w-full sm:flex-1 py-4 border border-gray-250 rounded-2xl font-bold text-gray-600 hover:bg-white transition-all order-2 sm:order-1 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  onClick={handleTambah}
                  className="w-full sm:flex-1 py-4 bg-[#2B7A75] hover:bg-[#1E5C58] text-white rounded-2xl font-bold shadow-lg shadow-teal-500/10 transition-all active:scale-95 order-1 sm:order-2 cursor-pointer"
                >
                  Simpan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 5px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f8fafc;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
        `,
        }}
      />
    </ResponsiveOrangtuaLayout>
  );
}

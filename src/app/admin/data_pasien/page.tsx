"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Eye,
  Filter,
  Users,
  Baby,
  Activity,
  BookOpen,
  Stethoscope,
  UserCircle2,
  BriefcaseMedical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FormUbahPatient from "@/components/form/FormUbahPatient";
import FormHapusPatient from "@/components/form/FormHapusPatient";
import FormTambahPasien from "@/components/form/FormTambahPasien";
import {
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  PatientList,
  PatientDetail,
  PatientUpdatePayload,
} from "@/lib/api/data_patient";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function DetailPatient({
  open,
  onClose,
  patient,
}: {
  open: boolean;
  onClose: () => void;
  patient: PatientDetail | null;
}) {
  if (!open || !patient) return null;

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
              ✕
            </button>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white shrink-0">
                <Baby className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{patient.child_name}</h2>
                <div className="flex items-center gap-2 mt-1 text-sm font-medium text-white/80">
                  <span className="capitalize">
                    {patient.child_gender || "-"}
                  </span>{" "}
                  | {patient.child_age} Tahun
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto scrollable-body space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-teal-50 pb-2">
                <UserCircle2 className="w-5 h-5 text-[#2B7A75]" />
                <h3 className="font-bold text-[#1E5C58] uppercase tracking-wider text-sm">
                  Informasi Detail Anak
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-[#F4F9F8] p-4 rounded-xl border border-teal-50">
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    TTL
                  </p>
                  <p className="font-bold text-gray-800">
                    {patient.child_birth_info || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Asal Sekolah
                  </p>
                  <p className="font-bold text-gray-800">
                    {patient.child_school || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Agama
                  </p>
                  <p className="font-bold text-gray-800">
                    {patient.child_religion || "-"}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Alamat
                  </p>
                  <p className="font-bold text-gray-800">
                    {patient.child_address || "-"}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-teal-50 pb-2">
                <Users className="w-5 h-5 text-[#2B7A75]" />
                <h3 className="font-bold text-[#1E5C58] uppercase tracking-wider text-sm">
                  Data Orang Tua / Wali
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-[#F4F9F8] p-4 rounded-xl border border-teal-50 space-y-2">
                  <h4 className="font-bold text-teal-800 border-b border-teal-100 pb-1 mb-2">
                    Data Ayah
                  </h4>
                  <div>
                    <span className="text-xs text-gray-500 block">Nama</span>
                    <span className="font-semibold text-gray-800">
                      {patient.father_name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Pekerjaan
                    </span>
                    <span className="font-semibold text-gray-800">
                      {patient.father_occupation || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Kontak</span>
                    <span className="font-semibold text-gray-800">
                      {patient.father_phone || "-"}
                    </span>
                  </div>
                </div>

                <div className="bg-[#F4F9F8] p-4 rounded-xl border border-teal-50 space-y-2">
                  <h4 className="font-bold text-teal-800 border-b border-teal-100 pb-1 mb-2">
                    Data Ibu
                  </h4>
                  <div>
                    <span className="text-xs text-gray-500 block">Nama</span>
                    <span className="font-semibold text-gray-800">
                      {patient.mother_name || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">
                      Pekerjaan
                    </span>
                    <span className="font-semibold text-gray-800">
                      {patient.mother_occupation || "-"}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 block">Kontak</span>
                    <span className="font-semibold text-gray-800">
                      {patient.mother_phone || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3 border-b border-teal-50 pb-2">
                <BriefcaseMedical className="w-5 h-5 text-[#2B7A75]" />
                <h3 className="font-bold text-[#1E5C58] uppercase tracking-wider text-sm">
                  Layanan & Keluhan
                </h3>
              </div>
              <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-amber-700/80 mb-0.5">
                    Keluhan Awal Anak
                  </p>
                  <p className="font-bold text-amber-900 leading-relaxed text-sm">
                    {patient.child_complaint || "Belum ada catatan keluhan."}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-amber-700/80 mb-0.5">
                    Pilihan Rawat/Layanan
                  </p>
                  <p className="font-bold text-amber-900 leading-relaxed text-sm">
                    {patient.child_service_choice || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function PatientPage() {
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState<PatientList[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const [selectedPatient, setSelectedPatient] = useState<PatientDetail | null>(
    null,
  );

  const [showTambah, setShowTambah] = useState(false);
  const [showUbah, setShowUbah] = useState(false);
  const [showHapus, setShowHapus] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchPatients = async () => {
    setIsFetching(true);
    try {
      const res = await getPatients();
      setPatients(res);
    } catch (error) {
      console.error("Gagal mengambil data pasien:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDetail = async (child_id: string) => {
    try {
      const item = await getPatientById(child_id);
      setSelectedPatient(item);
      setShowDetail(true);
    } catch (error) {
      console.error("Gagal memuat detail pasien:", error);
    }
  };

  const handleUbah = async (data: PatientUpdatePayload) => {
    if (!selectedPatient) return;
    try {
      await updatePatient(selectedPatient.child_id, data);
      setShowUbah(false);
      setSelectedPatient(null);
      fetchPatients();
    } catch (error: any) {
      console.error("Update failed:", error.response?.data);
    }
  };

  const handleHapus = async (child_id: string) => {
    try {
      await deletePatient(child_id);
      setShowHapus(false);
      setDeleteId(null);
      fetchPatients();
    } catch (error) {
      console.error("Gagal menghapus pasien:", error);
    }
  };

  const filtered = patients.filter((a) =>
    (a.child_name ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = filtered.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <Baby className="w-7 h-7 text-[#2B7A75]" />
              Manajemen Data Pasien
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola direktori pasien anak dan rincian administratif mereka.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3">
            {/* Search */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama pasien..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-teal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] transition-all shadow-sm text-gray-700"
              />
            </div>

            <button
              onClick={() => setShowTambah(true)}
              className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2B7A75] hover:bg-[#1E5C58] text-white font-semibold text-sm transition-all shadow-md shadow-teal-500/20 active:scale-95"
            >
              <Plus size={18} />
              Tambah Pasien
            </button>
          </div>
        </div>

        {/* Table Container (Desktop) & Cards (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 overflow-hidden flex-1 flex flex-col"
        >
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto w-full flex-1">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-[#F4F9F8] border-b border-teal-100">
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider w-16 text-center">
                    No
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Informasi Pasien
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Usia / Tgl Lahir
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Asal Sekolah
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isFetching ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">
                          Memuat data pasien...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedPatients.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Filter className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-medium">
                          Tidak ada data pasien ditemukan.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedPatients.map((pasien, i) => (
                    <tr
                      key={pasien.child_id}
                      className="hover:bg-[#F4F9F8]/50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium text-center">
                        {startIndex + i + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 border border-white shadow-sm ${
                              pasien.child_gender?.toLowerCase() === "perempuan"
                                ? "bg-pink-100 text-pink-600"
                                : pasien.child_gender?.toLowerCase() ===
                                    "laki-laki"
                                  ? "bg-blue-100 text-blue-600"
                                  : "bg-teal-100 text-teal-600"
                            }`}
                          >
                            {pasien.child_name?.charAt(0).toUpperCase() || "A"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1E5C58] line-clamp-1">
                              {pasien.child_name}
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5 capitalize">
                              {pasien.child_gender || "-"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-0.5">
                          <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-amber-500" />{" "}
                            {pasien.child_age} Tahun
                          </div>
                          <div className="text-xs text-gray-500 font-medium">
                            {pasien.child_birth_date}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-bold whitespace-nowrap">
                            <BookOpen className="w-3.5 h-3.5 text-gray-400" />
                            {pasien.child_school || "Tidak ada data"}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDetail(pasien.child_id)}
                            className="cursor-pointer p-2 text-gray-400 hover:text-[#2B7A75] hover:bg-[#E6F3F0] rounded-lg transition-all"
                            title="Detail"
                          >
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={async () => {
                              try {
                                const detail = await getPatientById(
                                  pasien.child_id,
                                );
                                setSelectedPatient(detail);
                                setShowUbah(true);
                              } catch (err) {
                                console.error("Gagal memuat detail:", err);
                              }
                            }}
                            className="cursor-pointer p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Ubah"
                          >
                            <Pencil size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(pasien.child_id);
                              setShowHapus(true);
                            }}
                            className="cursor-pointer p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex-1 overflow-y-auto w-full p-4 space-y-4">
            {isFetching ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400">
                <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Memuat data pasien...</p>
              </div>
            ) : paginatedPatients.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400">
                <Filter className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-medium">Tidak ada data ditemukan.</p>
              </div>
            ) : (
              paginatedPatients.map((pasien) => (
                <div
                  key={pasien.child_id}
                  className="bg-[#F4F9F8]/30 border border-teal-50 rounded-2xl p-4 shadow-xs"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-sm shrink-0 border border-white shadow-sm ${
                          pasien.child_gender?.toLowerCase() === "perempuan"
                            ? "bg-pink-100 text-pink-600"
                            : pasien.child_gender?.toLowerCase() === "laki-laki"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-teal-100 text-teal-600"
                        }`}
                      >
                        {pasien.child_name?.charAt(0).toUpperCase() || "A"}
                      </div>
                      <div className="max-w-[150px]">
                        <p className="text-sm font-bold text-[#1E5C58] truncate">
                          {pasien.child_name}
                        </p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                          {pasien.child_gender || "-"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-5 bg-white/50 p-3 rounded-xl border border-white/50">
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Usia / TTL
                      </p>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                        <Activity className="w-3 h-3 text-amber-500" />
                        {pasien.child_age} Thn
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium ml-4.5">
                        {pasien.child_birth_date}
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                        Asal Sekolah
                      </p>
                      <div className="flex items-start gap-1.5 text-xs font-bold text-gray-700">
                        <BookOpen className="w-3 h-3 text-blue-400 mt-0.5" />
                        <span className="line-clamp-2 leading-tight">
                          {pasien.child_school || "-"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3 border-t border-teal-50/50">
                    <p className="text-[10px] font-bold text-gray-300">
                      ID: #{pasien.child_id.slice(-6).toUpperCase()}
                    </p>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleDetail(pasien.child_id)}
                        className="cursor-pointer p-1.5 bg-white border border-teal-50 text-[#2B7A75] rounded-lg shadow-xs active:scale-90 transition-transform"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            const detail = await getPatientById(
                              pasien.child_id,
                            );
                            setSelectedPatient(detail);
                            setShowUbah(true);
                          } catch (err) {
                            console.error("Gagal memuat detail:", err);
                          }
                        }}
                        className="cursor-pointer p-1.5 bg-white border border-teal-50 text-amber-600 rounded-lg shadow-xs active:scale-90 transition-transform"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(pasien.child_id);
                          setShowHapus(true);
                        }}
                        className="cursor-pointer p-1.5 bg-white border border-teal-50 text-red-500 rounded-lg shadow-xs active:scale-90 transition-transform"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="bg-white border-t border-gray-100 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Menampilkan{" "}
                <span className="font-bold text-[#1E5C58]">
                  {paginatedPatients.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-[#1E5C58]">
                  {Math.min(endIndex, filtered.length)}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-[#1E5C58]">
                  {filtered.length}
                </span>{" "}
                pasien
              </p>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                  className="cursor-pointer px-2 py-1.5 rounded-lg border border-gray-100 text-[10px] sm:text-xs font-bold text-gray-500 hover:bg-[#F4F9F8] disabled:opacity-30 transition-colors"
                >
                  Prev
                </button>
                <div className="flex items-center gap-1 overflow-x-auto max-w-[120px] sm:max-w-none no-scrollbar">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`cursor-pointer shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all ${
                        currentPage === i + 1
                          ? "bg-[#2B7A75] text-white shadow-sm scale-110"
                          : "text-gray-400 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages || totalPages === 0}
                  className="cursor-pointer px-2 py-1.5 rounded-lg border border-gray-100 text-[10px] sm:text-xs font-bold text-gray-500 hover:bg-[#F4F9F8] disabled:opacity-30 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      <FormTambahPasien
        open={showTambah}
        onClose={() => {
          setShowTambah(false);
          fetchPatients();
        }}
      />

      <FormUbahPatient
        open={showUbah}
        onClose={() => setShowUbah(false)}
        onUpdate={handleUbah}
        initialData={
          selectedPatient
            ? {
                ...selectedPatient,
                child_birth_date: formatDate(selectedPatient.child_birth_date),
                father_birth_date: formatDate(
                  selectedPatient.father_birth_date,
                ),
                mother_birth_date: formatDate(
                  selectedPatient.mother_birth_date,
                ),
                guardian_birth_date: formatDate(
                  selectedPatient.guardian_birth_date,
                ),
              }
            : undefined
        }
      />

      <FormHapusPatient
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />
      <DetailPatient
        open={showDetail}
        onClose={() => setShowDetail(false)}
        patient={selectedPatient}
      />
    </div>
  );
}

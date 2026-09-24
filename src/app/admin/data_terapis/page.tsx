/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Eye,
  Filter,
  Users,
  Mail,
  Phone,
  CalendarDays,
  Clock,
  UserCircle2,
  Stethoscope,
  BriefcaseMedical,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import FormUbahTerapis from "@/components/form/FormUbahTerapis";
import FormHapusTerapis from "@/components/form/FormHapusTerapis";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

import {
  getTerapis,
  addTerapis,
  updateTerapis,
  deleteTerapis,
  getDetailTerapis,
  Terapis,
} from "@/lib/api/data_terapis";

function DetailTerapis({
  open,
  onClose,
  terapis,
}: {
  open: boolean;
  onClose: () => void;
  terapis: Terapis | null;
}) {
  if (!open || !terapis) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative max-h-[90vh] overflow-y-auto"
        >
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
                <UserCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{terapis.nama}</h2>
                <div className="flex items-center gap-1.5 mt-1 opacity-90 text-[11px] uppercase tracking-wider font-bold">
                  <span className="px-2 py-0.5 rounded-full bg-white/20 border border-white/20 shadow-sm flex items-center gap-1">
                    <Stethoscope className="w-3 h-3" />
                    {terapis.bidang}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/20 border border-white/20 shadow-sm">
                    {terapis.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 bg-[#F4F9F8] p-3 rounded-xl border border-teal-50">
                <BriefcaseMedical className="w-5 h-5 text-[#2B7A75] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Nama Pengguna & Role
                  </p>
                  <p className="text-sm font-bold text-[#1E5C58]">
                    @{terapis.username} ({terapis.role})
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#F4F9F8] p-3 rounded-xl border border-teal-50">
                <Mail className="w-5 h-5 text-[#2B7A75] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Email
                  </p>
                  <p className="text-sm font-bold text-[#1E5C58]">
                    {terapis.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#F4F9F8] p-3 rounded-xl border border-teal-50">
                <Phone className="w-5 h-5 text-[#2B7A75] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Telepon
                  </p>
                  <p className="text-sm font-bold text-[#1E5C58]">
                    {terapis.telepon || "-"}
                  </p>
                </div>
              </div>
            </div>

            <hr className="border-teal-50" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                  <CalendarDays className="w-3.5 h-3.5" /> Ditambahkan
                </div>
                <p className="text-xs font-bold text-gray-700">
                  {terapis.ditambahkan}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Terakhir Ubah
                </div>
                <p className="text-xs font-bold text-gray-700">
                  {terapis.diubah || "-"}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function DataTerapisPage() {
  const getStatusBadgeClass = (status: string) => {
    const s = status?.toLowerCase() || "aktif";
    if (s === "aktif" || s === "terverifikasi") {
      return "bg-emerald-50 text-emerald-700 border border-emerald-100";
    }
    if (s === "tidak terverifikasi" || s === "nonaktif" || s === "tidak_aktif") {
      return "bg-rose-50 text-rose-700 border border-rose-100";
    }
    return "bg-amber-50 text-amber-700 border border-amber-100";
  };

  const [search, setSearch] = useState("");
  const [terapisList, setTerapisList] = useState<Terapis[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const [showTambah, setShowTambah] = useState(false);
  const [showUbah, setShowUbah] = useState(false);
  const [showHapus, setShowHapus] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const [selectedTerapis, setSelectedTerapis] = useState<Terapis | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchTerapis();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const fetchTerapis = async () => {
    setIsFetching(true);
    try {
      const data = await getTerapis();
      setTerapisList(data);
    } catch (err) {
      console.error("Gagal mengambil data terapis:", err);
    } finally {
      setIsFetching(false);
    }
  };

  const handleTambah = async (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
    password: string;
  }) => {
    try {
      const res = await addTerapis(data);
      if (res.data.success) {
        setShowTambah(false);
        fetchTerapis();
        showSuccessToast("Terapis berhasil ditambahkan!");
      } else {
        handleApiError(null, "Gagal menambah terapis");
      }
    } catch (err: any) {
      console.error(" Gagal menambah terapis:", err.response?.data || err);
      handleApiError(err, "Gagal menambah terapis");
    }
  };

  const handleUbah = async (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
  }) => {
    if (!selectedTerapis) return;
    try {
      const res = await updateTerapis(selectedTerapis.id, data);
      if (res.data.success) {
        setShowUbah(false);
        fetchTerapis();
        showSuccessToast("Terapis berhasil diperbarui!");
      } else {
        handleApiError(null, "Gagal memperbarui data terapis");
      }
    } catch (err: any) {
      console.error(" Gagal memperbarui terapis:", err.response?.data || err);
      handleApiError(err, "Gagal memperbarui data terapis");
    }
  };

  const handleHapus = async (id: string) => {
    try {
      const res = await deleteTerapis(id);
      if (res.data.success) {
        setShowHapus(false);
        fetchTerapis();
        showSuccessToast("Terapis berhasil dihapus!");
      } else {
        handleApiError(null, "Gagal menghapus terapis");
      }
    } catch (err: any) {
      console.error(" Gagal menghapus terapis:", err.response?.data || err);
      handleApiError(err, "Gagal menghapus terapis");
    }
  };

  const handleDetail = async (id: string) => {
    try {
      const data = await getDetailTerapis(id);
      if (data) {
        setSelectedTerapis(data);
        setShowDetail(true);
      }
    } catch (err) {
      console.error(" Gagal menampilkan detail:", err);
      handleApiError(err, "Gagal menampilkan detail terapis");
    }
  };

  const filtered = terapisList.filter(
    (t) =>
      (t.nama?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.username?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (t.bidang?.toLowerCase() || "").includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTerapis = filtered.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-[#2B7A75]" />
              Manajemen Terapis & Asesor
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data seluruh pihak terapis dan layanan asessment di sistem.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center gap-3">
            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama, bidang..."
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
              Tambah Terapis
            </button>
          </div>
        </div>

        {/* Table Container (Desktop) & Cards (Mobile) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-transparent md:bg-white rounded-3xl md:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] md:border md:border-teal-50 overflow-hidden flex-1 flex flex-col"
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
                    Info Terapis
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Spesialisasi
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Role
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Kontak
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {isFetching ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">Memuat data...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedTerapis.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Filter className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-medium">
                          Tidak ada data terapis ditemukan.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedTerapis.map((terapis, i) => (
                    <tr
                      key={terapis.id}
                      className="hover:bg-[#F4F9F8]/50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium text-center">
                        {startIndex + i + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E6F3F0] text-[#2B7A75] flex items-center justify-center font-bold text-sm shrink-0">
                            {terapis.nama.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1E5C58] line-clamp-1">
                              {terapis.nama}
                            </p>
                            <p className="text-xs text-gray-550 font-medium mt-0.5 line-clamp-1">
                              @{terapis.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#2B7A75] bg-[#E6F3F0] px-3 py-1.5 rounded-lg w-fit">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {terapis.bidang}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="capitalize text-xs font-bold text-teal-800 bg-teal-50 border border-teal-100/50 px-2.5 py-1.5 rounded-lg whitespace-nowrap">
                          {terapis.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium whitespace-nowrap">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {terapis.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-505 font-medium whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {terapis.telepon || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border
                          ${getStatusBadgeClass(terapis.status)}`}
                        >
                          {terapis.status || "Aktif"}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDetail(terapis.id)}
                            className="cursor-pointer p-2 text-gray-400 hover:text-[#2B7A75] hover:bg-[#E6F3F0] rounded-lg transition-all"
                            title="Detail"
                          >
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedTerapis(terapis);
                              setShowUbah(true);
                            }}
                            className="cursor-pointer p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Ubah"
                          >
                            <Pencil size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(terapis.id);
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
          <div className="md:hidden flex-1 w-full space-y-4">
            {isFetching ? (
              <div className="py-12 flex flex-col items-center justify-center gap-3 text-gray-400 bg-white rounded-3xl border border-teal-50 shadow-xs">
                <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                <p className="text-sm font-medium">Memuat data...</p>
              </div>
            ) : paginatedTerapis.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400 bg-white rounded-3xl border border-teal-50 shadow-xs">
                <Filter className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-medium">Tidak ada data ditemukan.</p>
              </div>
            ) : (
              paginatedTerapis.map((terapis) => (
                <div
                  key={terapis.id}
                  className="bg-white border border-teal-50/60 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(43,122,117,0.06)]"
                >
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100/50 text-[#2B7A75] flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                        {terapis.nama.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#1E5C58] truncate leading-snug">
                          {terapis.nama}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate mt-0.5">
                          @{terapis.username}
                        </p>
                      </div>
                    </div>
                    
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 shadow-2xs ${getStatusBadgeClass(terapis.status)}`}
                    >
                      {terapis.status || "Aktif"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 bg-[#F4F9F8]/60 p-3.5 rounded-2xl border border-teal-50/50">
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Spesialisasi</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B7A75] min-w-0">
                        <Stethoscope className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{terapis.bidang}</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Role Akun</span>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B7A75]">
                        <span className="capitalize px-2 py-0.5 rounded bg-teal-50 border border-teal-150/40 text-[9px] font-bold text-teal-850">
                          {terapis.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 px-1">
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium min-w-0">
                      <Mail className="w-3.5 h-3.5 text-[#2B7A75] shrink-0" />
                      <span className="truncate">{terapis.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#2B7A75] shrink-0" />
                      <span>{terapis.telepon || "-"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3.5 border-t border-teal-50/50">
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                      ID: #{terapis.id.slice(-6).toUpperCase()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDetail(terapis.id)}
                        className="cursor-pointer p-2 bg-white hover:bg-teal-50 border border-teal-100/60 text-[#2B7A75] rounded-xl shadow-2xs active:scale-90 transition-all"
                        title="Detail"
                      >
                        <Eye size={15} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTerapis(terapis);
                          setShowUbah(true);
                        }}
                        className="cursor-pointer p-2 bg-white hover:bg-amber-50 border border-amber-100/60 text-amber-600 rounded-xl shadow-2xs active:scale-90 transition-all"
                        title="Ubah"
                      >
                        <Pencil size={15} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(terapis.id);
                          setShowHapus(true);
                        }}
                        className="cursor-pointer p-2 bg-white hover:bg-red-50 border border-red-100/60 text-red-500 rounded-xl shadow-2xs active:scale-90 transition-all"
                        title="Hapus"
                      >
                        <Trash2 size={15} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="bg-white border border-teal-50 md:border-none border-t md:border-t-gray-100 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl md:rounded-none shadow-xs md:shadow-none mt-2 md:mt-0">
              <p className="text-xs sm:text-sm font-medium text-gray-500">
                Menampilkan{" "}
                <span className="font-bold text-[#1E5C58]">
                  {paginatedTerapis.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-[#1E5C58]">
                  {Math.min(endIndex, filtered.length)}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-[#1E5C58]">
                  {filtered.length}
                </span>{" "}
                terapis
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

      <FormTambahTerapis
        open={showTambah}
        onClose={() => setShowTambah(false)}
        onSave={handleTambah}
      />
      <FormUbahTerapis
        open={showUbah}
        onClose={() => setShowUbah(false)}
        onUpdate={handleUbah}
        initialData={selectedTerapis || undefined}
      />
      <FormHapusTerapis
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />
      <DetailTerapis
        open={showDetail}
        onClose={() => setShowDetail(false)}
        terapis={selectedTerapis}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Eye,
  Filter,
  ShieldCheck,
  Mail,
  Phone,
  CalendarDays,
  Clock,
  UserCog,
  UserCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import FormTambahAdmin from "@/components/form/FormTambahAdmin";
import FormUbahAdmin from "@/components/form/FormUbahAdmin";
import FormHapusAdmin from "@/components/form/FormHapusAdmin";
import {
  getAdmins,
  getAdminById,
  addAdmin,
  updateAdmin,
  deleteAdmin,
  Admin,
} from "@/lib/api/data_admin";

function DetailAdmin({
  open,
  onClose,
  admin,
}: {
  open: boolean;
  onClose: () => void;
  admin: Admin | null;
}) {
  if (!open || !admin) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 flex items-center justify-center bg-[#1E5C58]/20 backdrop-blur-sm z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative"
        >
          {/* Header */}
          <div className="bg-linear-to-br from-[#1E5C58] to-[#2B7A75] p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />

            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/70 hover:text-white bg-black/10 hover:bg-black/20 rounded-full p-1.5 transition-colors z-20 cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 relative z-10">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30 text-white">
                <UserCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">{admin.admin_name}</h2>
                <div className="flex items-center gap-1.5 mt-1 opacity-90">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 border border-white/20`}
                  >
                    {admin.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-5">
            <div className="grid gap-4">
              <div className="flex items-start gap-3 bg-[#F4F9F8] p-3 rounded-xl border border-teal-50">
                <UserCog className="w-5 h-5 text-[#2B7A75] mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">
                    Nama Pengguna
                  </p>
                  <p className="text-sm font-bold text-[#1E5C58]">
                    @{admin.username}
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
                    {admin.email}
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
                    {admin.admin_phone || "-"}
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
                  {admin.created_at}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-1">
                  <Clock className="w-3.5 h-3.5" /> Terakhir Ubah
                </div>
                <p className="text-xs font-bold text-gray-700">
                  {admin.updated_at}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function AdminPage() {
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
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);

  const [showTambah, setShowTambah] = useState(false);
  const [showUbah, setShowUbah] = useState(false);
  const [showHapus, setShowHapus] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchAdmins = async () => {
    setIsFetching(true);
    try {
      const res = await getAdmins();
      setAdmins(res);
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const handleDetail = async (admin_id: string) => {
    try {
      const item = await getAdminById(admin_id);
      setSelectedAdmin(item);
      setShowDetail(true);
    } catch (error) {
      console.error("Gagal memuat detail admin:", error);
    }
  };

  const handleTambah = async (data: {
    admin_name: string;
    username: string;
    email: string;
    admin_phone: string;
    password?: string;
  }) => {
    try {
      await addAdmin(data);
      setShowTambah(false);
      fetchAdmins();
    } catch (error) {
      console.error("Gagal menambah admin:", error);
    }
  };

  const handleUbah = async (data: {
    admin_name: string;
    username: string;
    email: string;
    admin_phone: string;
  }) => {
    if (!selectedAdmin) return;
    try {
      await updateAdmin(selectedAdmin.admin_id, data);
      setShowUbah(false);
      setSelectedAdmin(null);
      fetchAdmins();
    } catch (error) {
      console.error("Gagal mengubah admin:", error);
    }
  };

  const handleHapus = async (admin_id: string) => {
    try {
      await deleteAdmin(admin_id);
      setShowHapus(false);
      setDeleteId(null);
      fetchAdmins();
    } catch (error) {
      console.error("Gagal menghapus admin:", error);
    }
  };

  const filtered = admins.filter(
    (a) =>
      (a.admin_name ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (a.username ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAdmins = filtered.slice(startIndex, endIndex);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header & Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-[#2B7A75]" />
              Manajemen Admin
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola data seluruh hak akses administrator sistem.
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
                placeholder="Cari nama atau username..."
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
              Tambah Admin
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
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F4F9F8] border-b border-teal-100">
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider w-16 text-center">
                    No
                  </th>
                  <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                    Info Admin
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
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">Memuat data...</p>
                      </div>
                    </td>
                  </tr>
                ) : paginatedAdmins.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-gray-400">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <Filter className="w-10 h-10 text-gray-300 mb-2" />
                        <p className="text-sm font-medium">
                          Tidak ada data admin ditemukan.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedAdmins.map((admin, i) => (
                    <tr
                      key={admin.admin_id}
                      className="hover:bg-[#F4F9F8]/50 transition-colors group"
                    >
                      <td className="py-4 px-6 text-sm text-gray-500 font-medium text-center">
                        {startIndex + i + 1}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-[#E6F3F0] text-[#2B7A75] flex items-center justify-center font-bold text-sm shrink-0">
                            {admin.admin_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#1E5C58]">
                              {admin.admin_name}
                            </p>
                            <p className="text-xs text-gray-500 font-medium mt-0.5">
                              @{admin.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium whitespace-nowrap">
                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                            {admin.email}
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />
                            {admin.admin_phone || "-"}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border
                          ${getStatusBadgeClass(admin.status)}`}
                        >
                          {admin.status || "Aktif"}
                        </span>
                      </td>

                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleDetail(admin.admin_id)}
                            className="cursor-pointer p-2 text-gray-400 hover:text-[#2B7A75] hover:bg-[#E6F3F0] rounded-lg transition-all"
                            title="Detail"
                          >
                            <Eye size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAdmin(admin);
                              setShowUbah(true);
                            }}
                            className="cursor-pointer p-2 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title="Ubah"
                          >
                            <Pencil size={18} strokeWidth={2.5} />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteId(admin.admin_id);
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
            ) : paginatedAdmins.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400 bg-white rounded-3xl border border-teal-50 shadow-xs">
                <Filter className="w-10 h-10 text-gray-300 mb-2" />
                <p className="text-sm font-medium">Tidak ada data ditemukan.</p>
              </div>
            ) : (
              paginatedAdmins.map((admin) => (
                <div
                  key={admin.admin_id}
                  className="bg-white border border-teal-50/60 rounded-3xl p-5 shadow-[0_4px_20px_-4px_rgba(43,122,117,0.06)]"
                >
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100/50 text-[#2B7A75] flex items-center justify-center font-bold text-base shrink-0 shadow-xs">
                        {admin.admin_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-[#1E5C58] truncate leading-snug">
                          {admin.admin_name}
                        </h3>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate mt-0.5">
                          @{admin.username}
                        </p>
                        <div className="mt-1">
                          <span className="capitalize px-2 py-0.5 rounded bg-teal-50 border border-teal-100/50 text-[9px] font-bold text-[#2B7A75]">
                            Administrator
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <span
                      className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 shadow-2xs ${getStatusBadgeClass(admin.status)}`}
                    >
                      {admin.status || "Aktif"}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 px-1 bg-[#F4F9F8]/60 p-3.5 rounded-2xl border border-teal-50/50">
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium min-w-0">
                      <Mail className="w-3.5 h-3.5 text-[#2B7A75] shrink-0" />
                      <span className="truncate">{admin.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-600 font-medium">
                      <Phone className="w-3.5 h-3.5 text-[#2B7A75] shrink-0" />
                      <span>{admin.admin_phone || "-"}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-3.5 border-t border-teal-50/50">
                    <p className="text-[10px] font-bold text-gray-400 tracking-wider">
                      ID: #{admin.admin_id.slice(-6).toUpperCase()}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDetail(admin.admin_id)}
                        className="cursor-pointer p-2 bg-white hover:bg-teal-50 border border-teal-100/60 text-[#2B7A75] rounded-xl shadow-2xs active:scale-90 transition-all"
                        title="Detail"
                      >
                        <Eye size={15} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedAdmin(admin);
                          setShowUbah(true);
                        }}
                        className="cursor-pointer p-2 bg-white hover:bg-amber-50 border border-amber-100/60 text-amber-600 rounded-xl shadow-2xs active:scale-90 transition-all"
                        title="Ubah"
                      >
                        <Pencil size={15} strokeWidth={2.5} />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteId(admin.admin_id);
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
                  {paginatedAdmins.length === 0 ? 0 : startIndex + 1}
                </span>{" "}
                -{" "}
                <span className="font-bold text-[#1E5C58]">
                  {Math.min(endIndex, filtered.length)}
                </span>{" "}
                dari{" "}
                <span className="font-bold text-[#1E5C58]">
                  {filtered.length}
                </span>{" "}
                admin
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

      <FormTambahAdmin
        open={showTambah}
        onClose={() => setShowTambah(false)}
        onSave={handleTambah}
      />
      <FormUbahAdmin
        open={showUbah}
        onClose={() => setShowUbah(false)}
        onUpdate={handleUbah}
        initialData={selectedAdmin || undefined}
      />
      <FormHapusAdmin
        open={showHapus}
        onClose={() => setShowHapus(false)}
        onConfirm={() => deleteId && handleHapus(deleteId)}
      />

      <DetailAdmin
        open={showDetail}
        onClose={() => setShowDetail(false)}
        admin={selectedAdmin}
      />
    </div>
  );
}

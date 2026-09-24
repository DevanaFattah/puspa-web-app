/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Search,
  Eye,
  X,
  User,
  Mail,
  Phone,
  Calendar,
  AlertCircle,
  Clock,
} from "lucide-react";
import { getAllAdmins } from "@/lib/api/ownerAdmin";
import { getAdminById } from "@/lib/api/data_admin";

const AdminListPage: React.FC = () => {
  const [admins, setAdmins] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedAdmin, setSelectedAdmin] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    try {
      setLoading(true);
      const res = await getAllAdmins();
      if (res.success && Array.isArray(res.data)) {
        setAdmins(res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data admin:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewAdmin(id: string) {
    setLoadingDetail(true);
    try {
      const data = await getAdminById(id);
      setSelectedAdmin(data);
    } catch (error) {
      console.error("Gagal mengambil detail admin:", error);
    } finally {
      setLoadingDetail(false);
    }
  }

  function closeModal() {
    setSelectedAdmin(null);
  }

  const filteredAdmins = admins.filter(
    (item) =>
      item.admin_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-teal-50 pb-5">
          <div>
            <h1 className="text-xl font-extrabold text-[#1E5C58]">Daftar Administrator</h1>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">
              Kelola dan pantau seluruh akun administrator yang terdaftar di platform PUSPA.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#81B7A9]" />
            </div>
            <input
              type="text"
              placeholder="Cari nama atau username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-teal-50 rounded-xl text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none transition-all placeholder-gray-450 font-medium text-gray-700 shadow-xs"
            />
          </div>
        </div>

        {/* Table/Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="bg-transparent md:bg-white md:rounded-3xl md:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] md:border md:border-teal-50 overflow-hidden md:p-6 w-full"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center p-16 bg-white rounded-3xl md:bg-transparent border border-teal-50 md:border-0 shadow-xs md:shadow-none">
              <div className="w-10 h-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
              <p className="text-gray-400 font-medium text-sm animate-pulse">
                Memuat data admin...
              </p>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl md:bg-transparent border border-teal-50 md:border-0 shadow-xs md:shadow-none">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4 border border-teal-100/30">
                <ShieldCheck className="w-10 h-10 text-[#2B7A75] opacity-50" />
              </div>
              <h3 className="text-base font-bold text-gray-700 mb-1">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-400 text-xs max-w-sm font-semibold leading-relaxed">
                Belum ada data admin yang cocok dengan kriteria pencarian Anda.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400">
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider w-16">
                        No
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Nama Admin
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Username
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Email
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        No. Telepon
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-center w-24">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmins.map((admin, idx) => (
                      <tr
                        key={admin.admin_id}
                        className="border-b border-gray-55 last:border-0 hover:bg-[#F4F9F8]/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm font-semibold text-gray-450">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-800">
                          {admin.admin_name}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {admin.username}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {admin.email}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {admin.admin_phone}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                              admin.status === "Terverifikasi"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}
                          >
                            {admin.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleViewAdmin(admin.admin_id)}
                            disabled={loadingDetail}
                            className="cursor-pointer inline-flex items-center justify-center w-9 h-9 bg-white text-[#2B7A75] border-2 border-teal-100 rounded-xl hover:bg-[#F4F9F8] hover:border-teal-200 transition-all shadow-xs"
                            title="Lihat detail admin"
                          >
                            <Eye className="w-4.5 h-4.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {filteredAdmins.map((admin, idx) => (
                  <div
                    key={admin.admin_id}
                    className="bg-white border border-teal-50 rounded-2xl p-4 space-y-3 shadow-xs text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{admin.admin_name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">@{admin.username}</p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          admin.status === "Terverifikasi"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-teal-50/55 space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-medium">{admin.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Telepon:</span>
                        <span className="font-medium">{admin.admin_phone}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleViewAdmin(admin.admin_id)}
                        disabled={loadingDetail}
                        className="cursor-pointer w-full py-2.5 rounded-xl bg-white border border-teal-100 text-[#2B7A75] font-bold text-xs hover:bg-[#F4F9F8] transition-all flex items-center justify-center gap-1.5"
                      >
                        <Eye size={14} />
                        Lihat Detail
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Modal Detail Admin */}
        <AnimatePresence>
          {selectedAdmin && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(30,92,88,0.12)] border border-teal-50 relative overflow-hidden"
              >
                {/* Decorative header border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-[#2B7A75] to-[#1E5C58]" />

                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6 mt-2">
                  <div className="w-12 h-12 bg-teal-50 border border-teal-100/50 text-[#2B7A75] rounded-2xl flex items-center justify-center">
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1E5C58]">
                      Detail Akun Admin
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      Informasi rinci lisensi admin
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <DetailItem
                    icon={User}
                    label="Nama Lengkap"
                    value={selectedAdmin.admin_name}
                  />
                  <DetailItem
                    icon={ShieldCheck}
                    label="Username"
                    value={selectedAdmin.username}
                  />
                  <DetailItem
                    icon={Mail}
                    label="Alamat Email"
                    value={selectedAdmin.email}
                  />
                  <DetailItem
                    icon={Phone}
                    label="No. Telepon"
                    value={selectedAdmin.admin_phone}
                  />
                  <DetailItem
                    icon={AlertCircle}
                    label="Status Akun"
                    value={selectedAdmin.status}
                    isBadge
                    badgeType={selectedAdmin.status === "Terverifikasi" ? "success" : "danger"}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Tanggal Pendaftaran"
                    value={selectedAdmin.created_at}
                  />
                  <DetailItem
                    icon={Clock}
                    label="Pembaruan Terakhir"
                    value={selectedAdmin.updated_at}
                  />
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={closeModal}
                    className="cursor-pointer px-5 py-2.5 rounded-xl border border-gray-250 bg-white text-gray-500 hover:bg-gray-50 text-xs font-bold transition-all w-full sm:w-auto"
                  >
                    Tutup
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Modal Detail Item Component
function DetailItem({ icon: Icon, label, value, isBadge = false, badgeType = "success" }: any) {
  return (
    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50">
      <div className="text-gray-400 mt-0.5 shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-extrabold text-gray-455 uppercase tracking-wider block">
          {label}
        </span>
        {isBadge ? (
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold mt-1 ${
              badgeType === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-rose-50 text-rose-700 border border-rose-100"
            }`}
          >
            {value}
          </span>
        ) : (
          <p className="text-sm font-bold text-gray-700 mt-0.5 break-words">
            {value || "-"}
          </p>
        )}
      </div>
    </div>
  );
}

export default AdminListPage;

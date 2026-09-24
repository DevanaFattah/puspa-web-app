/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserSquare2,
  Search,
  Eye,
  X,
  User,
  Activity,
  Award,
  Mail,
  Phone,
  Calendar,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { getAllTherapists, promoteToAssessor } from "@/lib/api/ownerTerapis";
import { getDetailTerapis } from "@/lib/api/ownerTerapis";

const TherapistListPage: React.FC = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [detailTerapis, setDetailTerapis] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [loadingPromote, setLoadingPromote] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTherapists();
  }, []);

  async function fetchTherapists() {
    try {
      setLoading(true);
      const res = await getAllTherapists();
      if (res.success) setTherapists(res.data);
    } catch (err) {
      console.error("Gagal mengambil data terapis:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewDetail(therapist_id: string) {
    setLoadingDetail(true);
    setErrorDetail(null);
    try {
      const data = await getDetailTerapis(therapist_id);
      if (data) {
        setDetailTerapis(data);
      } else {
        setErrorDetail("Data terapis tidak ditemukan.");
      }
    } catch (error) {
      setErrorDetail("Gagal mengambil data terapis.");
    } finally {
      setLoadingDetail(false);
    }
  }

  async function handlePromoteAssessor(user_id: string) {
    if (!user_id) {
      alert("User ID tidak ditemukan! Tidak bisa lanjut.");
      return;
    }

    if (!confirm("Apakah Anda yakin ingin menjadikan terapis ini sebagai Asesor?")) return;

    setLoadingPromote(true);
    try {
      const res = await promoteToAssessor(user_id);
      if (res.success) {
        alert("Terapis berhasil dijadikan asesor!");
        setDetailTerapis(null);
        fetchTherapists();
      } else {
        alert(res.message || "Gagal menjadikan asesor");
      }
    } catch (err) {
      console.error("Error saat promoteToAssessor:", err);
      alert("Terjadi kesalahan saat promote ke asesor");
    } finally {
      setLoadingPromote(false);
    }
  }

  const filteredTherapists = therapists.filter(
    (item) =>
      item.therapist_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase()) ||
      item.username.toLowerCase().includes(search.toLowerCase()) ||
      item.therapist_section.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-teal-50 pb-5">
          <div>
            <h1 className="text-xl font-extrabold text-[#1E5C58]">Daftar Staf Terapis</h1>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">
              Kelola, verifikasi, dan jadikan terapis sebagai Asesor untuk meningkatkan aksesibilitas.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#81B7A9]" />
            </div>
            <input
              type="text"
              placeholder="Cari nama, bidang, username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-teal-50 rounded-xl text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none transition-all placeholder-gray-455 font-medium text-gray-700 shadow-xs"
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
                Memuat data terapis...
              </p>
            </div>
          ) : filteredTherapists.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl md:bg-transparent border border-teal-50 md:border-0 shadow-xs md:shadow-none">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4 border border-teal-100/30">
                <UserSquare2 className="w-10 h-10 text-[#2B7A75] opacity-50" />
              </div>
              <h3 className="text-base font-bold text-gray-700 mb-1">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-400 text-xs max-w-sm font-semibold leading-relaxed">
                Belum ada data terapis yang cocok dengan kriteria pencarian Anda.
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
                        Nama Terapis
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Bidang
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
                    {filteredTherapists.map((t, idx) => (
                      <tr
                        key={t.therapist_id}
                        className="border-b border-gray-55 last:border-0 hover:bg-[#F4F9F8]/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm font-semibold text-gray-455">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-800">
                          {t.therapist_name}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-[#1E5C58]">
                          {t.therapist_section}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {t.username}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {t.email}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {t.therapist_phone}
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                              t.status === "Terverifikasi"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : "bg-rose-50 text-rose-700 border border-rose-100"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleViewDetail(t.therapist_id)}
                            className="cursor-pointer inline-flex items-center justify-center w-9 h-9 bg-white text-[#2B7A75] border-2 border-teal-100 rounded-xl hover:bg-[#F4F9F8] hover:border-teal-200 transition-all shadow-xs"
                            title="Lihat detail terapis"
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
                {filteredTherapists.map((t, idx) => (
                  <div
                    key={t.therapist_id}
                    className="bg-white border border-teal-50 rounded-2xl p-4 space-y-3 shadow-xs text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{t.therapist_name}</h4>
                        <span className="inline-block text-[10px] text-[#1E5C58] bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100/30 font-bold mt-1">
                          {t.therapist_section}
                        </span>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold ${
                          t.status === "Terverifikasi"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}
                      >
                        {t.status}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-teal-50/55 space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Username:</span>
                        <span className="font-semibold text-gray-700">@{t.username}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Email:</span>
                        <span className="font-medium text-gray-700">{t.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">No. Telepon:</span>
                        <span className="font-medium text-gray-700">{t.therapist_phone}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleViewDetail(t.therapist_id)}
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

        {/* Modal Detail Terapis */}
        <AnimatePresence>
          {detailTerapis && (
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
                  onClick={() => setDetailTerapis(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6 mt-2">
                  <div className="w-12 h-12 bg-teal-50 border border-teal-100/50 text-[#2B7A75] rounded-2xl flex items-center justify-center">
                    <UserSquare2 size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1E5C58]">
                      Detail Akun Terapis
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      Informasi profil staf terapis & asesor
                    </p>
                  </div>
                </div>

                <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
                  <DetailItem
                    icon={User}
                    label="Nama Lengkap"
                    value={detailTerapis.nama}
                  />
                  <DetailItem
                    icon={Activity}
                    label="Bidang Terapi"
                    value={detailTerapis.bidang}
                  />
                  <DetailItem
                    icon={Award}
                    label="Peran / Jabatan"
                    value={detailTerapis.role}
                    isBadge
                    badgeType={detailTerapis.role === "asesor" ? "success" : "info"}
                  />
                  <DetailItem
                    icon={ShieldAlert}
                    label="Username"
                    value={detailTerapis.username}
                  />
                  <DetailItem
                    icon={Mail}
                    label="Alamat Email"
                    value={detailTerapis.email}
                  />
                  <DetailItem
                    icon={Phone}
                    label="No. Telepon"
                    value={detailTerapis.telepon}
                  />
                  <DetailItem
                    icon={Calendar}
                    label="Tanggal Pendaftaran"
                    value={detailTerapis.ditambahkan}
                  />
                  <DetailItem
                    icon={Clock}
                    label="Pembaruan Terakhir"
                    value={detailTerapis.diubah}
                  />
                </div>

                {/* Promote Button */}
                {detailTerapis.status === "Terverifikasi" && (
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handlePromoteAssessor(detailTerapis.user_id)}
                      disabled={loadingPromote || detailTerapis.role === "asesor"}
                      className={`cursor-pointer w-full py-3 rounded-2xl font-bold text-xs shadow-md transition-all duration-300 flex items-center justify-center gap-2 ${
                        detailTerapis.role === "asesor"
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                          : loadingPromote
                          ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed shadow-none"
                          : "bg-[#1E5C58] hover:bg-[#2B7A75] text-white shadow-teal-900/10 hover:shadow-teal-900/20 active:translate-y-0.5"
                      }`}
                    >
                      {detailTerapis.role === "asesor" ? (
                        "Sudah Menjadi Asesor"
                      ) : loadingPromote ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Award size={15} />
                          Jadikan Sebagai Asesor
                        </>
                      )}
                    </button>
                  </div>
                )}
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
            className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11.5px] font-bold mt-1 capitalize ${
              badgeType === "success"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                : "bg-teal-50 text-teal-700 border border-teal-100"
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

export default TherapistListPage;

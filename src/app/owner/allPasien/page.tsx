/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Search,
  Eye,
  X,
  User,
  Calendar,
  School,
  HeartHandshake,
  Heart,
  ChevronRight,
  Phone,
  Briefcase,
  IdCard,
} from "lucide-react";
import { getAllChildren } from "@/lib/api/ownerPasien";
import { getDetailPasien } from "@/lib/api/data_pasien";

const DataAnakListPage: React.FC = () => {
  const [children, setChildren] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [selectedChildDetail, setSelectedChildDetail] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [errorDetail, setErrorDetail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"anak" | "ortu" | "keluhan">("anak");

  useEffect(() => {
    fetchChildren();
  }, []);

  async function fetchChildren() {
    try {
      setLoading(true);
      const res = await getAllChildren();
      if (res.success) {
        setChildren(res.data);
      }
    } catch (error) {
      console.error("Gagal mengambil data anak:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleViewDetail(childId: string) {
    setLoadingDetail(true);
    setErrorDetail(null);
    setSelectedChildDetail(null);
    setActiveTab("anak"); // Reset to first tab

    try {
      const detail = await getDetailPasien(childId);
      setSelectedChildDetail(detail);
    } catch (error) {
      setErrorDetail("Gagal mengambil detail pasien.");
      setSelectedChildDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }

  const filteredChildren = children.filter(
    (item) =>
      item.child_name.toLowerCase().includes(search.toLowerCase()) ||
      (item.child_school?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-teal-50 pb-5">
          <div>
            <h1 className="text-xl font-extrabold text-[#1E5C58]">Daftar Pasien Anak</h1>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">
              Lihat, kelola, dan akses rekam medis serta informasi wali dari pasien anak terdaftar.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#81B7A9]" />
            </div>
            <input
              type="text"
              placeholder="Cari nama anak atau sekolah..."
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
                Memuat data pasien...
              </p>
            </div>
          ) : filteredChildren.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl md:bg-transparent border border-teal-50 md:border-0 shadow-xs md:shadow-none">
              <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4 border border-teal-100/30">
                <Users className="w-10 h-10 text-[#2B7A75] opacity-50" />
              </div>
              <h3 className="text-base font-bold text-gray-700 mb-1">
                Data Tidak Ditemukan
              </h3>
              <p className="text-gray-400 text-xs max-w-sm font-semibold leading-relaxed">
                Belum ada data pasien anak yang cocok dengan kriteria pencarian Anda.
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
                        Nama Anak
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Tanggal Lahir
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Usia
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Jenis Kelamin
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Asal Sekolah
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-center w-24">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChildren.map((child, idx) => (
                      <tr
                        key={child.child_id}
                        className="border-b border-gray-50 last:border-0 hover:bg-[#F4F9F8]/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm font-semibold text-gray-455">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-800">
                          {child.child_name}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {child.child_birth_date}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-[#1E5C58]">
                          {child.child_age}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-gray-550 capitalize">
                          {child.child_gender}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {child.child_school || "-"}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleViewDetail(child.child_id)}
                            className="cursor-pointer inline-flex items-center justify-center w-9 h-9 bg-white text-[#2B7A75] border-2 border-teal-100 rounded-xl hover:bg-[#F4F9F8] hover:border-teal-200 transition-all shadow-xs"
                            title="Lihat detail pasien"
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
                {filteredChildren.map((child, idx) => (
                  <div
                    key={child.child_id}
                    className="bg-white border border-teal-55 rounded-2xl p-4 space-y-3 shadow-xs text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{child.child_name}</h4>
                        <p className="text-xs text-gray-400 mt-0.5">{child.child_school || "Tidak ada sekolah"}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#1E5C58] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100/30 shrink-0">
                        {child.child_age}
                      </span>
                    </div>

                    <div className="pt-2.5 border-t border-teal-50/55 space-y-1.5 text-xs text-gray-600">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tgl Lahir:</span>
                        <span className="font-semibold text-gray-700">{child.child_birth_date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Jenis Kelamin:</span>
                        <span className="font-semibold text-gray-700 capitalize">{child.child_gender}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        onClick={() => handleViewDetail(child.child_id)}
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

        {/* Modal Detail Pasien */}
        <AnimatePresence>
          {(selectedChildDetail || loadingDetail || errorDetail) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs p-4">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-[0_20px_50px_rgba(30,92,88,0.12)] border border-teal-50 relative overflow-hidden"
              >
                {/* Decorative header border */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-400 via-[#2B7A75] to-[#1E5C58]" />

                <button
                  onClick={() => setSelectedChildDetail(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-650 cursor-pointer p-1 rounded-lg hover:bg-gray-50 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3 mb-6 mt-2">
                  <div className="w-12 h-12 bg-teal-50 border border-teal-100/50 text-[#2B7A75] rounded-2xl flex items-center justify-center">
                    <Users size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-[#1E5C58]">
                      Detail Informasi Pasien
                    </h3>
                    <p className="text-xs text-gray-400 font-semibold mt-0.5">
                      Kelola rekam medis & data wali terintegrasi
                    </p>
                  </div>
                </div>

                {loadingDetail ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-8 h-8 border-3 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-3" />
                    <p className="text-gray-400 text-xs font-semibold">Memuat berkas pasien...</p>
                  </div>
                ) : errorDetail ? (
                  <p className="text-red-500 text-center py-8 font-semibold text-sm">{errorDetail}</p>
                ) : selectedChildDetail ? (
                  <>
                    {/* Tabs Navigation */}
                    <div className="flex border-b border-gray-150 gap-2 mb-6">
                      <TabButton
                        active={activeTab === "anak"}
                        onClick={() => setActiveTab("anak")}
                        label="Biodata Anak"
                      />
                      <TabButton
                        active={activeTab === "ortu"}
                        onClick={() => setActiveTab("ortu")}
                        label="Orangtua / Wali"
                      />
                      <TabButton
                        active={activeTab === "keluhan"}
                        onClick={() => setActiveTab("keluhan")}
                        label="Keluhan & Layanan"
                      />
                    </div>

                    {/* Tab Contents */}
                    <div className="max-h-[50vh] overflow-y-auto pr-1 space-y-4">
                      {activeTab === "anak" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <DetailItem icon={User} label="Nama Lengkap" value={selectedChildDetail.child_name} />
                          <DetailItem icon={Calendar} label="Tempat, Tanggal Lahir" value={selectedChildDetail.child_birth_info} />
                          <DetailItem icon={Users} label="Usia" value={selectedChildDetail.child_age} />
                          <DetailItem icon={User} label="Jenis Kelamin" value={selectedChildDetail.child_gender} />
                          <DetailItem icon={Heart} label="Agama" value={selectedChildDetail.child_religion} />
                          <DetailItem icon={School} label="Sekolah" value={selectedChildDetail.child_school} />
                          <div className="sm:col-span-2">
                            <DetailItem icon={School} label="Alamat Rumah" value={selectedChildDetail.child_address} />
                          </div>
                        </div>
                      )}

                      {activeTab === "ortu" && (
                        <div className="space-y-6">
                          {/* Ayah */}
                          {selectedChildDetail.father_name && (
                            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                              <h4 className="text-xs font-extrabold text-[#1E5C58] uppercase tracking-widest mb-3 border-b border-teal-100/50 pb-1.5">
                                Profil Ayah
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <ParentField icon={User} label="Nama" value={selectedChildDetail.father_name} />
                                <ParentField icon={Briefcase} label="Pekerjaan" value={selectedChildDetail.father_occupation} />
                                <ParentField icon={Phone} label="No. Telpon" value={selectedChildDetail.father_phone} />
                                <ParentField icon={IdCard} label="NIK" value={selectedChildDetail.father_identity_number} />
                              </div>
                            </div>
                          )}

                          {/* Ibu */}
                          {selectedChildDetail.mother_name && (
                            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                              <h4 className="text-xs font-extrabold text-[#1E5C58] uppercase tracking-widest mb-3 border-b border-teal-100/50 pb-1.5">
                                Profil Ibu
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <ParentField icon={User} label="Nama" value={selectedChildDetail.mother_name} />
                                <ParentField icon={Briefcase} label="Pekerjaan" value={selectedChildDetail.mother_occupation} />
                                <ParentField icon={Phone} label="No. Telpon" value={selectedChildDetail.mother_phone} />
                                <ParentField icon={IdCard} label="NIK" value={selectedChildDetail.mother_identity_number} />
                              </div>
                            </div>
                          )}

                          {/* Wali */}
                          {selectedChildDetail.guardian_name && (
                            <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                              <h4 className="text-xs font-extrabold text-[#1E5C58] uppercase tracking-widest mb-3 border-b border-teal-100/50 pb-1.5">
                                Profil Wali (Jika Ada)
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                                <ParentField icon={User} label="Nama Wali" value={selectedChildDetail.guardian_name} />
                                <ParentField icon={HeartHandshake} label="Hubungan" value={selectedChildDetail.guardian_relationship} />
                                <ParentField icon={Briefcase} label="Pekerjaan" value={selectedChildDetail.guardian_occupation} />
                                <ParentField icon={Phone} label="No. Telpon" value={selectedChildDetail.guardian_phone} />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {activeTab === "keluhan" && (
                        <div className="space-y-4">
                          <div className="p-4 rounded-2xl bg-rose-50/20 border border-rose-100/50">
                            <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider block mb-1">
                              Keluhan Utama
                            </span>
                            <p className="text-sm font-semibold text-gray-750 leading-relaxed">
                              {selectedChildDetail.child_complaint || "Tidak ada keluhan tertulis."}
                            </p>
                          </div>

                          <div>
                            <span className="text-[10px] font-extrabold text-[#1E5C58] uppercase tracking-wider block mb-2 px-1">
                              Layanan Yang Dipilih
                            </span>
                            <div className="flex flex-wrap gap-2">
                              {selectedChildDetail.child_service_choice
                                ? selectedChildDetail.child_service_choice.split(",").map((service: string, i: number) => (
                                    <span
                                      key={i}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50/50 border border-teal-100/60 rounded-xl text-xs font-bold text-[#1E5C58] capitalize"
                                    >
                                      <ChevronRight size={13} className="text-[#2B7A75]" />
                                      {service.trim()}
                                    </span>
                                  ))
                                : <span className="text-gray-400 text-xs italic">Belum memilih layanan.</span>}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setSelectedChildDetail(null)}
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

// Tab button component
function TabButton({ active, onClick, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer pb-2 px-3 text-xs font-bold tracking-tight border-b-2 transition-all outline-none ${
        active
          ? "border-[#2B7A75] text-[#1E5C58]"
          : "border-transparent text-gray-400 hover:text-gray-600"
      }`}
    >
      {label}
    </button>
  );
}

// Modal Detail Item Component
function DetailItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-start gap-3.5 p-3 rounded-2xl bg-gray-50/50 border border-gray-100/50">
      <div className="text-gray-400 mt-0.5 shrink-0">
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-extrabold text-gray-455 uppercase tracking-wider block">
          {label}
        </span>
        <p className="text-sm font-bold text-gray-705 mt-0.5 break-words">
          {value || "-"}
        </p>
      </div>
    </div>
  );
}

// Parent Profil Field Component
function ParentField({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-2">
      <Icon size={14} className="text-gray-400 shrink-0" />
      <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{label}:</span>
      <span className="text-xs font-bold text-gray-700 truncate">{value || "-"}</span>
    </div>
  );
}

export default DataAnakListPage;

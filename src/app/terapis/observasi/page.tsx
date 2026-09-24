/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Eye, 
  Search, 
  Calendar, 
  ArrowRight, 
  X, 
  User, 
  Phone, 
  Clock, 
  ClipboardList, 
  Heart 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getScheduledObservations,
  getScheduledObservationDetail,
} from "@/lib/api/observasiTerapis";
import { handleApiError } from "@/lib/api-error";

interface Anak {
  observation_id: string | number;
  age_category?: string;
  child_name?: string;
  guardian_name?: string;
  guardian_phone?: string;
  admin_name?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  child_birth_date?: string;
  child_age?: string;
  child_gender?: string;
  child_school?: string;
  child_address?: string;
  child_complaint?: string;
  child_service_choice?: string;
  parent_type?: string;
  parent_name?: string;
  parent_phone?: string;
}

interface Kategori {
  title: string;
  filter: (data: Anak) => boolean;
}

function getTahun(usiaStr?: string): number {
  if (!usiaStr) return 0;
  const match = usiaStr.match(/(\d+)\s*Tahun/i);
  if (match) {
    return parseInt(match[1], 10);
  }
  return 0;
}

const kategori: Kategori[] = [
  { title: "Usia 0-5 Tahun", filter: (d) => getTahun(d.child_age) <= 5 },
  {
    title: "Usia 6-12 Tahun",
    filter: (d) => {
      const t = getTahun(d.child_age);
      return t >= 6 && t <= 12;
    },
  },
  {
    title: "Usia 13-17 Tahun",
    filter: (d) => {
      const t = getTahun(d.child_age);
      return t >= 13 && t <= 17;
    },
  },
  { title: "Usia 17+ Tahun", filter: (d) => getTahun(d.child_age) > 17 },
];

export default function ObservasiPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Anak | null>(null);
  const [activeKategori, setActiveKategori] = useState<number>(0);
  const [detailObservasi, setDetailObservasi] = useState<any | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  // Pagination states
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["observations", filterDate, searchName],
    queryFn: () => getScheduledObservations(filterDate, searchName),
  });

  const children: Anak[] = Array.isArray(data?.data)
    ? data.data.map((d: any, i: number) => ({
        observation_id: d.observation_id ?? `temp-${i}`,
        age_category: d.age_category ?? d.child_age_category ?? "-",
        child_name: d.child_name ?? "-",
        guardian_name: d.guardian_name ?? d.parent_name ?? "-",
        guardian_phone: d.guardian_phone ?? d.parent_phone ?? "-",
        admin_name: d.administrator ?? d.admin_name ?? "-",
        scheduled_date: d.scheduled_date ?? "-",
        scheduled_time: d.scheduled_time ?? d.time ?? "-",
        child_birth_date: d.child_birth_date,
        child_age: d.child_age,
        child_gender: d.child_gender,
        child_school: d.child_school,
        child_address: d.child_address,
        child_complaint: d.child_complaint,
        child_service_choice: d.child_service_choice,
        parent_type: d.parent_type,
        parent_name: d.parent_name,
        parent_phone: d.parent_phone,
      }))
    : [];

  // Filter hanya berdasarkan kategori aktif
  const filteredByKategori = children.filter((d) =>
    kategori[activeKategori].filter(d)
  );

  // Filter pencarian nama anak / wali (case insensitive)
  const filtered = filteredByKategori.filter((d) => {
    const q = searchName.trim().toLowerCase();
    if (!q) return true;
    return (
      String(d.child_name || "").toLowerCase().includes(q) ||
      String(d.guardian_name || "").toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  // Reset page ke 1 jika filterDate, searchName atau kategori berubah
  useEffect(() => {
    setPage(1);
  }, [filterDate, searchName, activeKategori]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, page]);

  const handleStartObservasi = (child: Anak) => {
    const kategoriUsia = child.age_category ?? "lainnya";

    router.push(
      `/terapis/observasi/form_observasi?observation_id=${child.observation_id}&nama=${encodeURIComponent(
        String(child.child_name)
      )}&usia=${encodeURIComponent(String(child.child_age ?? child.age_category ?? ""))}&kategori=${encodeURIComponent(
        kategoriUsia
      )}&tglObservasi=${encodeURIComponent(String(child.scheduled_date ?? ""))}`
    );
  };

  const handleViewDetail = async (observation_id: string | number) => {
    setLoadingDetail(true);
    try {
      const res = await getScheduledObservationDetail(String(observation_id));
      setDetailObservasi(res);
      setSelected(null);
    } catch (err) {
      console.error("❌ Gagal ambil detail observasi:", err);
      handleApiError(err, "Gagal memuat detail observasi");
    } finally {
      setLoadingDetail(false);
    }
  };

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterDate, searchName]);

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= SEARCH, FILTER & ACTION ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
        <div className="flex flex-col sm:flex-row gap-4 items-center w-full md:w-auto">
          {/* Calendar Input */}
          <div className="relative w-full sm:w-64">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81B7A9]" />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-teal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] shadow-[0_2px_8px_rgba(30,92,88,0.02)] hover:border-teal-200 transition-colors"
            />
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#81B7A9]" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Cari nama anak atau nama orang tua..."
              className="w-full pl-10 pr-4 py-2.5 border border-teal-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#81B7A9] shadow-[0_2px_8px_rgba(30,92,88,0.02)] hover:border-teal-200 transition-colors"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => router.push("/terapis/observasi/riwayat")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-xs transition-all duration-300 shadow-sm shrink-0 w-full md:w-auto justify-center md:justify-start"
        >
          <span>Riwayat Observasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* ================= CATEGORY NAVIGATION ================= */}
      <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-2 p-1.5 bg-[#EAF4F2]/50 border border-teal-50/50 rounded-xl w-full lg:w-fit">
        {kategori.map((kat, idx) => {
          const isActive = activeKategori === idx;
          return (
            <button
              key={idx}
              onClick={() => setActiveKategori(idx)}
              className={`cursor-pointer px-3 py-2 text-[11px] lg:text-sm font-semibold rounded-lg text-center transition-all duration-300 w-full lg:w-auto ${
                isActive
                  ? "bg-[#1E5C58] text-white shadow-sm"
                  : "text-[#1E5C58]/80 hover:bg-white/60 hover:text-[#1E5C58]"
              }`}
            >
              {kat.title}
            </button>
          );
        })}
      </div>

      {/* ================= TABLE LIST ================= */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeKategori}|${filterDate}|${searchName}|${page}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-6 md:p-8 border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.03)] hover:shadow-[0_8px_32px_rgba(30,92,88,0.06)] transition-shadow duration-300"
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
              <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium">Memuat data anak...</span>
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-red-500 font-medium">
              Gagal memuat data observasi terjadwal. Silakan coba beberapa saat lagi.
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
              <ClipboardList className="w-10 h-10 text-gray-300" />
              <span className="text-sm font-medium">Tidak ada data observasi terjadwal</span>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 text-gray-400 font-semibold">
                      <th className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-wider">Nama Anak</th>
                      <th className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-wider">Orang Tua / Wali</th>
                      <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Telepon</th>
                      <th className="py-3 px-4 text-left font-semibold text-xs uppercase tracking-wider">Administrator</th>
                      <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Tanggal</th>
                      <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Waktu</th>
                      <th className="py-3 px-4 text-center font-semibold text-xs uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginatedData.map((d, index) => (
                      <tr
                        key={d.observation_id ?? `row-${index}`}
                        className={`hover:bg-[#EAF4F2]/20 transition-colors ${
                          selected?.observation_id === d.observation_id
                            ? "bg-[#EAF4F2]/40"
                            : ""
                        }`}
                      >
                        <td className="py-4 px-4 font-bold text-gray-700">{d.child_name}</td>
                        <td className="py-4 px-4 text-gray-600 font-medium">{d.guardian_name}</td>
                        <td className="py-4 px-4 text-center text-gray-600 font-mono text-xs">{d.guardian_phone}</td>
                        <td className="py-4 px-4 text-gray-600 font-medium">{d.admin_name}</td>
                        <td className="py-4 px-4 text-center text-gray-500 font-medium">{d.scheduled_date || "-"}</td>
                        <td className="py-4 px-4 text-center text-gray-500 font-medium">{d.scheduled_time || "-"}</td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleStartObservasi(d)}
                              className="cursor-pointer bg-[#1E5C58] hover:bg-[#2E8B83] text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm hover:shadow transition-all"
                            >
                              Mulai
                            </button>
                            <button
                              onClick={() => handleViewDetail(d.observation_id!)}
                              className="cursor-pointer p-1.5 text-gray-400 hover:text-[#1E5C58] hover:bg-gray-100 rounded-lg transition-colors"
                              title="Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block lg:hidden space-y-4">
                {paginatedData.map((d, index) => (
                  <div
                    key={d.observation_id ?? `card-${index}`}
                    className={`bg-[#F4F9F8]/40 border border-teal-50 rounded-2xl p-4 space-y-3 shadow-xs ${
                      selected?.observation_id === d.observation_id
                        ? "border-[#1E5C58] bg-[#EAF4F2]/40"
                        : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-bold text-gray-700">{d.child_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Wali: {d.guardian_name}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => handleStartObservasi(d)}
                          className="cursor-pointer bg-[#1E5C58] hover:bg-[#2E8B83] text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm"
                        >
                          Mulai
                        </button>
                        <button
                          onClick={() => handleViewDetail(d.observation_id!)}
                          className="cursor-pointer p-1.5 text-gray-400 hover:text-[#1E5C58] hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-teal-50/50 text-gray-500 font-medium">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">WhatsApp</span>
                        <span className="font-mono text-gray-600">{d.guardian_phone || "-"}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Administrator</span>
                        <span className="text-gray-600">{d.admin_name || "-"}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Tanggal</span>
                        <span>{d.scheduled_date || "-"}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase">Waktu</span>
                        <span>{d.scheduled_time || "-"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 pt-4 border-t border-gray-100">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      page === 1
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        : "bg-white border-teal-100 hover:bg-teal-50/20 text-[#1E5C58]"
                    }`}
                  >
                    Sebelumnya
                  </button>
                  <span className="text-xs font-bold text-gray-500">
                    Halaman {page} / {totalPages}
                  </span>
                  <button
                    disabled={page === totalPages || totalPages === 0}
                    onClick={() => setPage(page + 1)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                      page === totalPages || totalPages === 0
                        ? "bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed"
                        : "bg-white border-teal-100 hover:bg-teal-50/20 text-[#1E5C58]"
                    }`}
                  >
                    Selanjutnya
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* ================= DETAIL MODAL ================= */}
      <AnimatePresence>
        {(loadingDetail || detailObservasi) && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] w-full max-w-lg p-6 relative max-h-[85vh] overflow-y-auto border border-teal-50/50 text-[#1E5C58]"
            >
              <button
                className="cursor-pointer absolute top-4 right-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors"
                onClick={() => setDetailObservasi(null)}
              >
                <X className="w-5 h-5" />
              </button>

              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                  <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-sm">Memuat detail observasi...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-[#1E5C58]">
                      Detail Observasi Anak
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Data janji temu dan identitas observasi</p>
                  </div>

                  <hr className="border-teal-50" />

                  <div className="space-y-4">
                    {/* SECTION: DATA ANAK */}
                    <div className="bg-[#EAF4F2]/30 rounded-xl p-4 border border-teal-50/50 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#1E5C58]">
                        <User className="w-4 h-4 text-[#81B7A9]" />
                        <span>Identitas Anak</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-gray-600">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Nama Lengkap</span>
                          <span className="text-gray-700 font-bold">{detailObservasi?.child_name ?? "-"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Tanggal Lahir</span>
                          <span>{detailObservasi?.child_birth_date ?? "-"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Usia</span>
                          <span>{detailObservasi?.child_age ?? detailObservasi?.age_category ?? "-"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Jenis Kelamin</span>
                          <span>{detailObservasi?.child_gender ?? "-"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Sekolah</span>
                          <span>{detailObservasi?.child_school ?? "-"}</span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Alamat</span>
                          <span className="break-words">{detailObservasi?.child_address ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION: DATA WALI */}
                    <div className="bg-[#EAF4F2]/30 rounded-xl p-4 border border-teal-50/50 space-y-3">
                      <div className="flex items-center gap-2 font-bold text-sm text-[#1E5C58]">
                        <Phone className="w-4 h-4 text-[#81B7A9]" />
                        <span>Orang Tua / Wali</span>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs font-medium text-gray-600">
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Nama Orang Tua</span>
                          <span className="text-gray-700 font-bold">
                            {detailObservasi?.parent_name ?? detailObservasi?.guardian_name ?? "-"}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[10px] text-gray-400 uppercase">Hubungan</span>
                          <span>{detailObservasi?.parent_type ?? "-"}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[10px] text-gray-400 uppercase">Nomor WhatsApp</span>
                          <span className="font-mono">{detailObservasi?.parent_phone ?? detailObservasi?.guardian_phone ?? "-"}</span>
                        </div>
                      </div>
                    </div>

                    {/* SECTION: DATA LAYANAN & LAINNYA */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-white border border-teal-100 rounded-xl p-3.5 space-y-1">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Jenis Layanan</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Heart className="w-3.5 h-3.5 text-rose-400" />
                          <span>{detailObservasi?.child_service_choice ?? "-"}</span>
                        </div>
                      </div>

                      <div className="bg-white border border-teal-100 rounded-xl p-3.5 space-y-1">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Waktu Jadwal</span>
                        <div className="flex items-center gap-1.5 text-xs font-bold">
                          <Clock className="w-3.5 h-3.5 text-[#81B7A9]" />
                          <span>{detailObservasi?.time ?? detailObservasi?.scheduled_time ?? "-"}</span>
                        </div>
                      </div>

                      <div className="col-span-2 bg-white border border-teal-100 rounded-xl p-3.5 space-y-1">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Keluhan</span>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {detailObservasi?.child_complaint || "Tidak ada keluhan tertulis"}
                        </p>
                      </div>

                      <div className="col-span-2 bg-white border border-teal-100 rounded-xl p-3.5 space-y-1">
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Administrator Pendaftar</span>
                        <span className="text-xs font-bold text-gray-700">
                          {detailObservasi?.admin_name ?? detailObservasi?.admin ?? detailObservasi?.administrator ?? "-"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

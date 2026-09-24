"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  UserSquare2,
  Search,
  Check,
  X,
} from "lucide-react";
import {
  getUnverifiedTherapists,
  activateTherapist,
  deactivateTherapist,
} from "@/lib/api/ownerTerapis";

const VerifikasiTerapisPage: React.FC = () => {
  const [therapists, setTherapists] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadTherapists = async () => {
    setLoading(true);
    try {
      const response = await getUnverifiedTherapists();
      if (response.success && Array.isArray(response.data)) {
        setTherapists(response.data);
      } else {
        console.error("Gagal memuat data terapis:", response.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTherapists();
  }, []);

  const handleApprove = async (user_id: string) => {
    const confirmApprove = window.confirm("Yakin ingin menyetujui terapis ini?");
    if (!confirmApprove) return;

    try {
      const response = await activateTherapist(user_id);
      if (response.success) {
        alert("Terapis berhasil diaktifkan!");
        loadTherapists();
      } else {
        alert("Gagal mengaktifkan: " + response.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    }
  };

  const handleReject = async (user_id: string) => {
    const confirmReject = window.confirm("Apakah Anda yakin ingin menolak terapis ini?");
    if (!confirmReject) return;

    try {
      const response = await deactivateTherapist(user_id);
      if (response.success) {
        alert("Terapis berhasil ditolak!");
        loadTherapists();
      } else {
        alert("Gagal menolak terapis: " + response.message);
      }
    } catch (err) {
      alert("Terjadi kesalahan.");
    }
  };

  const filteredTherapists = therapists.filter(
    (item) =>
      item.therapist_name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-teal-50 pb-5">
          <div>
            <h1 className="text-xl font-extrabold text-[#1E5C58]">Verifikasi Terapis</h1>
            <p className="text-xs text-gray-400 mt-1.5 font-medium">
              Setujui atau tolak pendaftaran terapis baru untuk mulai menangani pasien di platform PUSPA.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-64 shrink-0">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-[#81B7A9]" />
            </div>
            <input
              type="text"
              placeholder="Cari terapis..."
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
                Memuat berkas verifikasi...
              </p>
            </div>
          ) : filteredTherapists.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-16 text-center bg-white rounded-3xl md:bg-transparent border border-teal-50 md:border-0 shadow-xs md:shadow-none">
              <div className="w-20 h-20 bg-teal-50/50 rounded-full flex items-center justify-center mb-4 border border-teal-100/30">
                <UserSquare2 className="w-10 h-10 text-[#2B7A75] opacity-50" />
              </div>
              <h3 className="text-base font-bold text-gray-700 mb-1">
                Tidak Ada Antrean Verifikasi
              </h3>
              <p className="text-gray-400 text-xs max-w-xs font-semibold leading-relaxed">
                Saat ini belum ada terapis baru yang menunggu verifikasi dari Anda.
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
                        Email
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider">
                        Tanggal Pendaftaran
                      </th>
                      <th className="py-4 px-6 text-xs font-bold uppercase tracking-wider text-center w-64">
                        Tindakan
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTherapists.map((item, idx) => (
                      <tr
                        key={item.user_id}
                        className="border-b border-gray-55 last:border-0 hover:bg-[#F4F9F8]/50 transition-colors"
                      >
                        <td className="py-4 px-6 text-sm font-semibold text-gray-455">
                          {idx + 1}
                        </td>
                        <td className="py-4 px-6 text-sm font-bold text-gray-800">
                          {item.therapist_name}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-500">
                          {item.email}
                        </td>
                        <td className="py-4 px-6 text-sm font-semibold text-[#1E5C58]">
                          {item.createdAt}
                        </td>
                        <td className="py-4 px-6 flex items-center justify-center gap-3">
                          {/* Approve Button */}
                          <button
                            onClick={() => handleApprove(item.user_id)}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 border border-emerald-200/50 transition-all font-bold text-xs shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <Check size={14} strokeWidth={2.5} />
                            Setujui
                          </button>

                          {/* Reject Button */}
                          <button
                            onClick={() => handleReject(item.user_id)}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100/80 text-rose-700 border border-rose-200/50 transition-all font-bold text-xs shadow-xs hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <X size={14} strokeWidth={2.5} />
                            Tolak
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block md:hidden space-y-4">
                {filteredTherapists.map((item, idx) => (
                  <div
                    key={item.user_id}
                    className="bg-white border border-teal-50 rounded-2xl p-4 space-y-3.5 shadow-xs text-left"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-gray-800">{item.therapist_name}</h4>
                        <p className="text-xs text-gray-500 mt-1 font-medium">{item.email}</p>
                      </div>
                      <span className="text-[10px] font-bold text-[#1E5C58] bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-100/30 shrink-0">
                        No. {idx + 1}
                      </span>
                    </div>

                    <div className="pt-3 border-t border-teal-50/55 flex justify-between items-center text-xs">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-semibold">Tgl Daftar</span>
                        <span className="font-semibold text-gray-650">{item.createdAt}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        onClick={() => handleApprove(item.user_id)}
                        className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200/50 font-bold text-xs transition-all"
                      >
                        <Check size={14} strokeWidth={2.5} />
                        Setujui
                      </button>
                      <button
                        onClick={() => handleReject(item.user_id)}
                        className="cursor-pointer flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/50 font-bold text-xs transition-all"
                      >
                        <X size={14} strokeWidth={2.5} />
                        Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default VerifikasiTerapisPage;

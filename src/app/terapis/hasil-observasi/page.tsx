/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
  X, 
  User, 
  Heart, 
  AlertCircle, 
  FileText 
} from "lucide-react";
import {
  getObservationDetail,
  getObservations,
  CompletedObservationDetail,
} from "@/lib/api/observasiSubmit";

export default function HasilObservasiFrame() {
  const searchParams = useSearchParams();
  const observationId = searchParams.get("id");

  const [data, setData] = useState<CompletedObservationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!observationId) {
      setError("⚠️ Observation ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        const list = await getObservations("completed");
        const detail = await getObservationDetail(observationId, "completed");

        const scheduleItem = list.find(
          (item) => item.observation_id?.toString() === observationId
        );

        if (!detail) {
          setError("Data hasil observasi tidak ditemukan.");
          setData(null);
        } else {
          setData({
            ...detail,
            scheduled_date: scheduleItem?.scheduled_date || "-",
          });
          setError(null);
        }
      } catch (err: any) {
        console.error("❌ Error fetch observation detail:", err);
        if (err?.response?.status === 429) {
          setError("Terlalu banyak permintaan. Coba lagi beberapa saat.");
        } else {
          setError("Terjadi kesalahan saat mengambil data observasi.");
        }
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [observationId]);

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Hasil Laporan Observasi Anak
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Dokumen resmi rekam evaluasi dan kesimpulan observasi klinis pasien.
          </p>
        </div>
        <button
          onClick={() => (window.location.href = "/terapis/observasi/riwayat")}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-medium">Memuat data hasil observasi...</span>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center py-20 text-red-500 font-bold">
          {error}
        </div>
      ) : !data ? (
        <div className="flex justify-center items-center py-20 text-gray-400 font-medium">
          Data hasil observasi tidak ditemukan.
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-teal-50/60 shadow-[0_4px_24px_rgba(30,92,88,0.03)] hover:shadow-[0_8px_32px_rgba(30,92,88,0.06)] transition-shadow duration-300 space-y-8">
          {/* ================= SECTION: DATA PASIEN ================= */}
          <div className="bg-[#EAF4F2]/30 rounded-2xl p-6 border border-teal-50/50 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-[#1E5C58]">
              <User className="w-4 h-4 text-[#81B7A9]" />
              <span>Identitas Anak & Orang Tua</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem label="Nama Lengkap" value={data.child_name} />
              <InfoItem label="Tempat & Tanggal Lahir" value={data.child_birth_place_date} />
              <InfoItem label="Usia" value={data.child_age} />
              <InfoItem label="Jenis Kelamin" value={data.child_gender} />
              <InfoItem label="Sekolah" value={data.child_school} />
              <InfoItem label="Alamat Tempat Tinggal" value={data.child_address} />
              <InfoItem label="Nama Orang Tua" value={data.parent_name} />
              <InfoItem label="Hubungan Orang Tua" value={data.parent_type} />
              <InfoItem label="Tanggal Observasi" value={data.scheduled_date} />
            </div>
          </div>

          {/* ================= SECTION: RINGKASAN EVALUASI ================= */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#1E5C58] tracking-tight">
              Ringkasan Evaluasi Klinis
            </h3>

            {/* Total Skor Badge */}
            <div className="flex justify-between items-center bg-[#EAF4F2]/30 border border-teal-50 rounded-xl p-4 text-xs sm:text-sm font-bold text-[#1E5C58]">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#81B7A9]" />
                <span>Akumulasi Skor Observasi</span>
              </span>
              <span className="text-lg font-extrabold">{data.total_score ?? 0}</span>
            </div>

            {/* Rekomendasi */}
            <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Rekomendasi Lanjutan</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-semibold">
                {data.recommendation || "-"}
              </p>
            </div>

            {/* Kesimpulan */}
            <div className="bg-[#EAF4F2]/10 border border-teal-50 rounded-xl p-5 space-y-2 shadow-sm">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>Kesimpulan Observasi</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line font-semibold">
                {data.conclusion || "-"}
              </p>
            </div>
          </div>

          {/* ================= BACK ACTION ================= */}
          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button
              onClick={() => (window.location.href = "/terapis/observasi/riwayat")}
              className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <span>Kembali ke Riwayat</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* InfoItem reusable component */
function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="space-y-1">
      <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-wider">{label}</span>
      <span className="text-sm font-bold text-gray-700">{value ?? "-"}</span>
    </div>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getAssessmentDetail } from "@/lib/api/asesment";
import { User, Users } from "lucide-react";

export default function DetailAssessmentPage() {
  const params = useSearchParams();
  const assessmentId = params.get("assessment_id");

  const [detail, setDetail] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!assessmentId) return;
    const fetchDetail = async () => {
      try {
        const data = await getAssessmentDetail(assessmentId);
        setDetail(data);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [assessmentId]);

  if (!assessmentId) return <p className="p-8 text-center text-red-500 font-bold">Assessment ID tidak ditemukan!</p>;

  return (
    <div className="p-6 md:p-8 space-y-8 text-[#1E5C58] bg-[#F8FBFB] min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center border-b border-teal-100/50 pb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#1E5C58]">
            Detail Rencana Asesmen Anak
          </h1>
          <p className="text-xs md:text-sm text-gray-400 mt-1">
            Informasi janji temu dan identitas asesmen klinis pasien.
          </p>
        </div>
        <button
          onClick={() => history.back()}
          className="cursor-pointer inline-flex items-center gap-2 bg-[#1E5C58] hover:bg-[#2E8B83] text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-all duration-300 shadow-[0_4px_12px_rgba(129,183,169,0.2)] hover:shadow-[0_8px_20px_rgba(30,92,88,0.2)] hover:-translate-y-0.5"
        >
          <span>Kembali</span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <div className="w-8 h-8 border-4 border-[#81B7A9] border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-sm font-medium">Memuat rincian asesmen...</span>
        </div>
      ) : !detail ? (
        <div className="flex justify-center items-center py-20 text-gray-400 font-medium">
          Rincian asesmen tidak ditemukan.
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-teal-100 shadow-[0_4px_24px_rgba(30,92,88,0.03)] hover:shadow-[0_8px_32px_rgba(30,92,88,0.06)] transition-shadow duration-300 space-y-8">
          
          {/* ================= IDENTITAS ANAK ================= */}
          <div className="bg-teal-50/60 rounded-2xl p-6 border border-teal-100 space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#1E5C58]">
              <User className="w-4 h-4 text-[#81B7A9]" />
              <span>Identitas Anak</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem label="Nama Lengkap" value={detail.child_name} />
              <InfoItem label="Tanggal Lahir" value={detail.child_birth_date} />
              <InfoItem label="Usia" value={detail.child_age} />
              <InfoItem label="Jenis Kelamin" value={detail.child_gender} />
              <InfoItem label="Sekolah" value={detail.child_school} />
              <InfoItem label="Alamat" value={detail.child_address} />
            </div>
          </div>

          {/* ================= ORANG TUA / WALI ================= */}
          <div className="bg-teal-50/60 rounded-2xl p-6 border border-teal-100 space-y-4">
            <div className="flex items-center gap-2 font-extrabold text-sm text-[#1E5C58]">
              <Users className="w-4 h-4 text-[#81B7A9]" />
              <span>Orang Tua / Wali</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <InfoItem label="Nama Orang Tua" value={detail.parent_name} />
              <InfoItem label="Hubungan Orang Tua" value={detail.relationship} />
              <InfoItem label="Nomor WhatsApp" value={detail.parent_phone} />
            </div>
          </div>

          {/* ================= DETIL RENCANA ================= */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-4 space-y-1.5">
              <span className="block text-[10px] text-teal-600 font-extrabold uppercase tracking-wider">Jenis Assessment</span>
              <span className="text-sm font-extrabold text-[#1E5C58]">{detail.type}</span>
            </div>
            
            <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-4 space-y-1.5">
              <span className="block text-[10px] text-teal-600 font-extrabold uppercase tracking-wider">Waktu Jadwal</span>
              <span className="text-sm font-bold text-[#1E5C58]">{detail.scheduled_date} pukul {detail.scheduled_time}</span>
            </div>
          </div>

          {/* ================= KELUHAN ================= */}
          {detail.complaint && (
            <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-5 space-y-2 shadow-sm">
              <span className="block text-[10px] text-teal-600 font-extrabold uppercase tracking-wider">Keluhan Utama</span>
              <p className="text-sm text-gray-700 leading-relaxed font-semibold">
                {detail.complaint}
              </p>
            </div>
          )}

          {/* ================= ADMIN ================= */}
          <div className="bg-teal-50/40 border border-teal-100 rounded-xl p-4 space-y-1.5">
            <span className="block text-[10px] text-teal-600 font-extrabold uppercase tracking-wider">Administrator Pendaftar</span>
            <span className="text-sm font-bold text-gray-700">{detail.admin_name}</span>
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

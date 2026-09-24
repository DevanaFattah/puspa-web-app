"use client";

import { useState, useEffect } from "react";
import CardInfo from "@/components/dashboard/card_info";
import JadwalTable from "@/components/dashboard/jadwal_table";
import PasienChartAdmin from "@/components/dashboard/pasien_chart_admin";
import FormTambahAdmin from "@/components/form/FormTambahAdmin";
import FormTambahTerapis from "@/components/form/FormTambahTerapis";
import { ShieldPlus, UserPlus, Sparkles } from "lucide-react";
import { addAdmin } from "@/lib/api/data_admin";
import { addTerapis } from "@/lib/api/data_terapis";
import {
  getDashboardStats,
  getTodaySchedule,
  DashboardStats,
  PatientCategory,
  TodaySchedule,
} from "@/lib/api/dashboard_admin";
import { motion } from "framer-motion";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [todaySchedule, setTodaySchedule] = useState<TodaySchedule[]>([]);
  const [patientCategories, setPatientCategories] = useState<PatientCategory[]>(
    [],
  );
  const [loading, setLoading] = useState(true);

  const [openTambahAdmin, setOpenTambahAdmin] = useState(false);
  const [openTambahTerapis, setOpenTambahTerapis] = useState(false);

  const handleTambahAdmin = async (data: {
    admin_name: string;
    username: string;
    email: string;
    admin_phone: string;
    password?: string;
  }) => {
    try {
      await addAdmin(data);
      setOpenTambahAdmin(false);
      fetchDashboardData();
      showSuccessToast("Admin berhasil ditambahkan!");
    } catch (error) {
      console.error("❌ Gagal menambah admin dari dashboard:", error);
      handleApiError(error, "Gagal menambah admin");
    }
  };

  const handleTambahTerapis = async (data: {
    nama: string;
    bidang: string;
    username: string;
    email: string;
    telepon: string;
    password: string;
  }) => {
    try {
      await addTerapis(data);
      setOpenTambahTerapis(false);
      fetchDashboardData();
      showSuccessToast("Terapis berhasil ditambahkan!");
    } catch (err) {
      console.error("❌ Gagal menambah terapis dari dashboard:", err);
      handleApiError(err, "Gagal menambah terapis");
    }
  };

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, scheduleData] = await Promise.all([
        getDashboardStats(),
        getTodaySchedule(),
      ]);
      setTodaySchedule(scheduleData);
      if (statsData) {
        setStats(statsData);
        setPatientCategories(statsData.patient_categories || []);
      } else {
        setStats(null);
      }
    } catch (error) {
      console.error("❌ Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden selection:bg-[#2B7A75] selection:text-white bg-transparent w-full">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-[-10%] w-[50%] h-[50%] bg-[#b8e8db40] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#68b2a020] rounded-full blur-[100px] pointer-events-none z-0" />

      <main className="relative z-10 w-full flex flex-col">
        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 pb-12 w-full shadow-none border-none">
          {/* Header Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-linear-to-br from-[#1E5C58] to-[#2B7A75] rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden w-full"
          >
            {/* Visual Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="absolute bottom-0 left-10 w-40 h-40 bg-[#A2E4D3]/20 rounded-full blur-2xl transform translate-y-1/2 pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight">
                  Dasbor Admin
                </h1>
                <p className="text-teal-50/90 text-sm lg:text-base max-w-lg leading-relaxed">
                  Kelola penjadwalan, statistik layanan klinik, serta penambahan
                  staf secara terintegrasi dari satu layar utama Anda.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 md:shrink-0">
                <button
                  onClick={() => setOpenTambahAdmin(true)}
                  disabled={loading}
                  className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold transition-all duration-300 disabled:opacity-50"
                >
                  <ShieldPlus className="w-4 h-4" />
                  Tambah Admin
                </button>

                <button
                  onClick={() => setOpenTambahTerapis(true)}
                  disabled={loading}
                  className="cursor-pointer flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-[#1E5C58] shadow-md hover:scale-[1.02] active:scale-[0.98] font-bold transition-all duration-300 disabled:opacity-50"
                >
                  <UserPlus className="w-5 h-5" />
                  Tambah Terapis
                </button>
              </div>
            </div>
          </motion.div>

          {/* Cards Status Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-full"
          >
            <CardInfo
              stats={stats}
              loading={loading}
              date={stats?.date?.formatted || ""}
            />
          </motion.div>

          {/* Jadwal + Chart Layout */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full flex"
            >
              <div className="w-full h-full">
                <JadwalTable
                  jadwal={todaySchedule}
                  loading={loading}
                  emptyMessage="Tidak ada jadwal hari ini"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="w-full flex"
            >
              <div className="w-full h-full">
                <PasienChartAdmin data={patientCategories} loading={loading} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Forms Modal */}
      <FormTambahAdmin
        open={openTambahAdmin}
        onClose={() => setOpenTambahAdmin(false)}
        onSave={handleTambahAdmin}
      />

      <FormTambahTerapis
        open={openTambahTerapis}
        onClose={() => setOpenTambahTerapis(false)}
        onSave={handleTambahTerapis}
      />
    </div>
  );
}

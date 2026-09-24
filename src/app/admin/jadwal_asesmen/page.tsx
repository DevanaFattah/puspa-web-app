"use client";

import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Settings,
  ChevronDown,
  ChevronRight,
  Eye,
  Clock3,
  User,
  Stethoscope,
  Upload,
  Activity,
  Speech,
  GraduationCap,
  CalendarDays,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
import FormEditAsesment from "@/components/form/FormEditAsesment";
import {
  getAssessmentsAdmin,
  updateAsessmentSchedule,
  getAssessmentDetail,
} from "@/lib/api/jadwal_asessment";
import FormDetailAsesment from "@/components/form/FormDetailAsesment";
import { motion, AnimatePresence } from "framer-motion";
import { handleApiError, showSuccessToast } from "@/lib/api-error";

// =======================
// Interface Jadwal
// =======================
export interface Jadwal {
  assessment_id: number;
  nama: string;
  usia?: string;
  jenisKelamin?: string;
  sekolah?: string;
  orangtua: string;
  telepon: string;
  asessor?: string;
  administrator?: string;
  tipe?: string;
  tanggalObservasi?: string | null;
  waktu?: string | null;
  observer?: string | null;
  status?: string | null;
}

const ORTU_ACTIONS = [
  { key: "umum", label: "Data Umum" },
  { key: "fisio", label: "Data Fisioterapi" },
  { key: "okupasi", label: "Data Terapi Okupasi" },
  { key: "wicara", label: "Data Terapi Wicara" },
  { key: "paedagog", label: "Data Paedagog" },
  { key: "upload", label: "Upload File" },
];

const ASESSOR_ACTIONS = [
  { key: "fisio", label: "Data Fisioterapi" },
  { key: "okupasi", label: "Data Terapi Okupasi" },
  { key: "wicara", label: "Data Terapi Wicara" },
  { key: "paedagog", label: "Data Paedagog" },
];

const ORTU_ICONS: Record<string, any> = {
  umum: User,
  fisio: Activity,
  okupasi: Stethoscope,
  wicara: Speech,
  paedagog: GraduationCap,
  upload: Upload,
};

const ASESSOR_ICONS: Record<string, any> = {
  fisio: Activity,
  okupasi: Stethoscope,
  wicara: Speech,
  paedagog: GraduationCap,
};

// =======================
// Page Component
// =======================
export default function JadwalAsesmenPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  
  const initialTab =
    searchParams.get("tab") === "selesai"
      ? "selesai"
      : "terjadwal";

  const [tab, setTab] = useState<"terjadwal" | "selesai">(initialTab);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== tab) {
      params.set("tab", tab);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [tab, router]);

  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [selectedPasien, setSelectedPasien] = useState<Jadwal | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<{
    assessment_id: number;
    role: "ortu" | "asessor" | "aksi";
  } | null>(null);
  const [detailPasien, setDetailPasien] = useState<any | null>(null);
  const [openAsesmen, setOpenAsesmen] = useState(false);

  const fetchJadwal = async () => {
    setLoading(true);
    setError(null);
    try {
      const status = tab === "terjadwal" ? "scheduled" : "completed";
      const data = await getAssessmentsAdmin(
        status,
        "",
        tab === "terjadwal" ? (selectedDate ?? undefined) : undefined,
      );
      setJadwalList(data);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat data jadwal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [tab, selectedDate]);

  const filtered = jadwalList.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      j.nama?.toLowerCase().includes(q) ||
      j.orangtua?.toLowerCase().includes(q);

    const matchDateSelesai =
      tab === "selesai" && filterDate
        ? j.tanggalObservasi === format(new Date(filterDate), "dd/MM/yyyy")
        : true;

    return matchSearch && matchDateSelesai;
  });

  const handleDateSelect = async (date: Date) => {
    const formatted = format(date, "yyyy-MM-dd");
    setSelectedDate(formatted);
  };

  const handleOrtuRoute = (action: string, assessment_id: number) => {
    const base = "/admin/ortu";
    const routes: Record<string, string> = {
      umum: `${base}/data_umum`,
      fisio: `${base}/fisioterapi`,
      okupasi: `${base}/okupasi`,
      wicara: `${base}/wicara`,
      paedagog: `${base}/paedagog`,
      upload: `${base}/upload_file`,
    };
    router.push(`${routes[action]}?assessment_id=${assessment_id}`);
  };

  const handleAsessorRoute = (action: string, assessment_id: number) => {
    const base = "/admin/asesor";
    const routes: Record<string, string> = {
      umum: `${base}/data_umum`,
      fisio: `${base}/fisioterapi`,
      okupasi: `${base}/okupasi`,
      wicara: `${base}/wicara`,
      paedagog: `${base}/paedagog`,
    };
    router.push(`${routes[action]}?assessment_id=${assessment_id}`);
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <FileCheck2 className="w-7 h-7 text-[#2B7A75]" />
              Jadwal Asesmen Klinis
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola antrean dan penjadwalan prosedur asesmen pasien.
            </p>
          </div>
        </div>

        <main className="space-y-6">
          <AnimatePresence mode="wait">
            {tab === "terjadwal" && (
              <motion.div
                key="kalender-asesmen"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 bg-white border border-teal-100 p-6 rounded-3xl shadow-sm mb-4">
                  <div className="custom-calendar-container">
                    <Calendar
                      onChange={(d) => handleDateSelect(d as Date)}
                      locale="id-ID"
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      value={selectedDate ? new Date(selectedDate) : new Date()}
                      className="border-none shadow-sm rounded-xl font-sans! text-sm"
                    />
                  </div>
                  <div className="hidden sm:block h-64 w-px bg-gray-200" />
                  <div className="custom-calendar-container">
                    <Calendar
                      onChange={(d) => handleDateSelect(d as Date)}
                      locale="id-ID"
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      value={
                        new Date(
                          (selectedDate
                            ? new Date(selectedDate)
                            : new Date()
                          ).getFullYear(),
                          (selectedDate
                            ? new Date(selectedDate)
                            : new Date()
                          ).getMonth() + 1,
                          1,
                        )
                      }
                      className="border-none shadow-sm rounded-xl font-sans! text-sm"
                    />
                  </div>
                  <style
                    dangerouslySetInnerHTML={{
                      __html: `
                    .react-calendar { width: 300px; max-width: 100%; font-family: inherit; border: none; background: transparent; }
                    .react-calendar__navigation button { min-width: 44px; background: none; font-size: 16px; margin-top: 8px; font-weight: bold; color: #1E5C58; border-radius: 8px; }
                    .react-calendar__navigation button:enabled:hover, .react-calendar__navigation button:enabled:focus { background-color: #F4F9F8; }
                    .react-calendar__month-view__weekdays { text-transform: uppercase; font-weight: bold; font-size: 0.75em; color: #64748b; margin-bottom: 8px;}
                    .react-calendar__month-view__weekdays__weekday abbr { text-decoration: none; }
                    .react-calendar__tile { max-width: 100%; padding: 10px 6px; background: none; text-align: center; line-height: 16px; font-size: 14px; border-radius: 8px; font-weight: 500;}
                    .react-calendar__tile:enabled:hover, .react-calendar__tile:enabled:focus { background-color: #F4F9F8; color: #1E5C58; border-radius: 8px; }
                    .react-calendar__tile--active { background: #2B7A75 !important; color: white !important; font-weight: bold; border-radius: 8px; }
                    .react-calendar__tile--now { background: #e0f2fe; color: #0284c7; font-weight: bold; border-radius: 8px;}
                  `,
                    }}
                  />
                </div>

                <AnimatePresence>
                  {selectedDate && (
                    <motion.div
                      key="hapus-filter"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        overflow: "visible",
                      }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      className="flex justify-center mt-4"
                    >
                      <button
                        onClick={() => setSelectedDate(null)}
                        className="cursor-pointer px-5 py-2 text-xs font-bold bg-white text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-700 shadow-sm transition-all"
                      >
                        Hapus Filter Tanggal ✕
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB & SEARCH NAVIGATION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            {/* TABS */}
            <div className="flex w-full md:w-auto p-1 bg-gray-50/50 rounded-xl relative">
              {["terjadwal", "selesai"].map((t) => {
                const isActive = tab === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTab(t as any)}
                    className={`cursor-pointer relative flex-1 md:w-32 py-2.5 text-sm font-bold capitalize transition-all z-10 
                      ${isActive ? "text-[#1E5C58]" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTabAsesmen"
                        className="absolute inset-0 bg-white rounded-lg shadow-sm border border-teal-50"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                    <span className="relative flex items-center justify-center gap-1.5 z-20">
                      {t === "terjadwal" && (
                        <CalendarDays className="w-4 h-4" />
                      )}
                      {t === "selesai" && <CheckCircle2 className="w-4 h-4" />}
                      {t}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* SEARCH */}
            <div className="flex w-full md:w-auto gap-2">
              {tab === "selesai" && (
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full md:w-auto px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none text-gray-600 font-medium"
                />
              )}
              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari pasien / orangtua..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-teal-100 focus:border-teal-400 outline-none transition-all placeholder-gray-400 font-medium text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Table Container (Desktop) & Cards (Mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 overflow-visible flex-1 flex flex-col"
          >
            {loading ? (
              <div className="flex flex-col items-center justify-center p-16">
                <div className="w-10 h-10 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin mb-4" />
                <p className="text-gray-400 font-medium text-sm animate-pulse">
                  Memuat jadwal asesmen...
                </p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center p-16 text-red-500">
                <CheckCircle2 className="w-12 h-12 mb-4 opacity-50" />
                <p>{error}</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center">
                <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-4">
                  <FileCheck2 className="w-10 h-10 text-[#2B7A75] opacity-50" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-1">
                  {selectedDate && tab === "terjadwal"
                    ? `Tidak ada jadwal di ${selectedDate}`
                    : "Antrean Kosong"}
                </h3>
                <p className="text-gray-400 text-sm max-w-sm">
                  Belum ada jadwal asesmen yang ditemukan untuk kriteria ini.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-visible pb-24">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-linear-to-r from-gray-50 to-white border-b border-gray-100">
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Info Pasien
                        </th>
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                          Tipe Asesmen
                        </th>
                        {tab === "terjadwal" && (
                          <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Jadwal (Terjadwal)
                          </th>
                        )}
                        {tab === "selesai" && (
                          <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            Jadwal (Selesai)
                          </th>
                        )}
                        <th className="py-4 px-6 text-xs font-bold text-gray-400 uppercase tracking-wider text-center">
                          Tindakan Khusus
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((j) => (
                        <tr
                          key={j.assessment_id}
                          className="border-b border-gray-50 last:border-0 hover:bg-[#F4F9F8]/50 transition-colors group"
                        >
                          {/* Info Pasien */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-teal-100/50 flex items-center justify-center shrink-0 border border-teal-50">
                                <User className="w-5 h-5 text-[#2B7A75]" />
                              </div>
                              <div>
                                <p className="font-bold text-gray-800 text-sm">
                                  {j.nama}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-xs text-gray-500">
                                    {j.orangtua}
                                  </span>
                                  <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                  <span className="text-xs text-gray-500">
                                    {j.telepon}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Tipe Asesmen */}
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-1.5">
                              {j.tipe?.split(",").map((t, idx) => (
                                <span
                                  key={idx}
                                  className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-100 whitespace-nowrap"
                                >
                                  {t.trim()}
                                </span>
                              ))}
                              {!j.tipe && (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-bold bg-gray-50 text-gray-500 border border-gray-100">
                                  -
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-[#2B7A75] font-semibold mt-1">
                              {j.administrator
                                ? `Admin: ${j.administrator}`
                                : `Asesor: ${j.asessor}`}
                            </p>
                          </td>

                          {/* Jadwal */}
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <CalendarDays className="w-4 h-4 text-gray-400" />
                              <span className="font-medium">
                                {j.tanggalObservasi}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                              <Clock3 className="w-3.5 h-3.5" />
                              {j.waktu}
                            </div>
                          </td>

                          {/* Aksi & Dropdown */}
                          <td className="py-4 px-6 text-center">
                            {tab === "terjadwal" ? (
                              <div className="relative inline-block text-left">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPasien(j);
                                    setOpenDropdown(
                                      openDropdown?.assessment_id ===
                                        j.assessment_id &&
                                        openDropdown?.role === "aksi"
                                        ? null
                                        : {
                                            assessment_id: j.assessment_id,
                                            role: "aksi",
                                          },
                                    );
                                  }}
                                  className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-[#2B7A75] border-2 border-teal-100 rounded-xl hover:bg-[#F4F9F8] hover:border-teal-200 transition-all shadow-sm"
                                >
                                  Kelola <ChevronDown className="w-3.5 h-3.5" />
                                </button>
                                <AnimatePresence>
                                  {openDropdown?.assessment_id ===
                                    j.assessment_id &&
                                    openDropdown?.role === "aksi" && (
                                      <motion.div
                                        initial={{
                                          opacity: 0,
                                          y: -10,
                                          scale: 0.95,
                                        }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{
                                          opacity: 0,
                                          y: -10,
                                          scale: 0.95,
                                        }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 text-left"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <button
                                          onClick={() => {
                                            setOpenAsesmen(true);
                                            setOpenDropdown(null);
                                          }}
                                          className="w-full flex items-center px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#2B7A75] transition-colors"
                                        >
                                          <Settings className="w-4 h-4 mr-2" />{" "}
                                          Atur Asesmen
                                        </button>
                                        <button
                                          onClick={async () => {
                                            setOpenDropdown(null);
                                            setOpenDetail(true);
                                            setDetailPasien(null);
                                            try {
                                              const detail =
                                                await getAssessmentDetail(
                                                  j.assessment_id,
                                                );
                                              setDetailPasien(detail);
                                            } catch (err) {
                                              console.error("Gagal", err);
                                            }
                                          }}
                                          className="w-full flex items-center px-4 py-3 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#2B7A75] transition-colors"
                                        >
                                          <Eye className="w-4 h-4 mr-2" /> Lihat
                                          Rincian
                                        </button>
                                      </motion.div>
                                    )}
                                </AnimatePresence>
                              </div>
                            ) : (
                              <div className="flex justify-center gap-2">
                                {/* DROPDOWN ORTU */}
                                <div className="relative inline-block">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDropdown(
                                        openDropdown?.assessment_id ===
                                          j.assessment_id &&
                                          openDropdown?.role === "ortu"
                                          ? null
                                          : {
                                              assessment_id: j.assessment_id,
                                              role: "ortu",
                                            },
                                      );
                                    }}
                                    className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-[#81B7A9] text-white border-2 border-transparent rounded-xl hover:bg-[#6aaea0] transition-all shadow-sm"
                                  >
                                    <User className="w-3.5 h-3.5" /> Ortu{" "}
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <AnimatePresence>
                                    {openDropdown?.assessment_id ===
                                      j.assessment_id &&
                                      openDropdown?.role === "ortu" && (
                                        <motion.div
                                          initial={{
                                            opacity: 0,
                                            y: -10,
                                            scale: 0.95,
                                          }}
                                          animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                          }}
                                          exit={{
                                            opacity: 0,
                                            y: -10,
                                            scale: 0.95,
                                          }}
                                          className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 text-left"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <div className="bg-teal-50 px-3 py-2 border-b border-teal-100 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-[#2B7A75] uppercase tracking-wider">
                                              Hasil Ortu
                                            </span>
                                          </div>
                                          <div className="p-1 max-h-60 overflow-y-auto">
                                            {ORTU_ACTIONS.map((item) => {
                                              const Icon = ORTU_ICONS[item.key];
                                              return (
                                                <button
                                                  key={item.key}
                                                  onClick={() =>
                                                    handleOrtuRoute(
                                                      item.key,
                                                      j.assessment_id,
                                                    )
                                                  }
                                                  className="w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-[#2B7A75] transition-colors"
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4 text-teal-600/60" />{" "}
                                                    {item.label}
                                                  </div>
                                                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </motion.div>
                                      )}
                                  </AnimatePresence>
                                </div>

                                {/* DROPDOWN ASESOR */}
                                <div className="relative inline-block">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenDropdown(
                                        openDropdown?.assessment_id ===
                                          j.assessment_id &&
                                          openDropdown?.role === "asessor"
                                          ? null
                                          : {
                                              assessment_id: j.assessment_id,
                                              role: "asessor",
                                            },
                                      );
                                    }}
                                    className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold bg-white text-[#5F52BF] border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
                                  >
                                    <Stethoscope className="w-3.5 h-3.5" />{" "}
                                    Asesor{" "}
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <AnimatePresence>
                                    {openDropdown?.assessment_id ===
                                      j.assessment_id &&
                                      openDropdown?.role === "asessor" && (
                                        <motion.div
                                          initial={{
                                            opacity: 0,
                                            y: -10,
                                            scale: 0.95,
                                          }}
                                          animate={{
                                            opacity: 1,
                                            y: 0,
                                            scale: 1,
                                          }}
                                          exit={{
                                            opacity: 0,
                                            y: -10,
                                            scale: 0.95,
                                          }}
                                          className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-50 text-left"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <div className="bg-indigo-50 px-3 py-2 border-b border-indigo-100 flex items-center justify-between">
                                            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                                              Hasil Asesor
                                            </span>
                                          </div>
                                          <div className="p-1">
                                            {ASESSOR_ACTIONS.map((item) => {
                                              const Icon =
                                                ASESSOR_ICONS[item.key];
                                              return (
                                                <button
                                                  key={item.key}
                                                  onClick={() =>
                                                    handleAsessorRoute(
                                                      item.key,
                                                      j.assessment_id,
                                                    )
                                                  }
                                                  className="w-full flex justify-between items-center px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-indigo-50 hover:text-[#5F52BF] transition-colors"
                                                >
                                                  <div className="flex items-center gap-2">
                                                    <Icon className="w-4 h-4 text-indigo-400" />{" "}
                                                    {item.label}
                                                  </div>
                                                  <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </motion.div>
                                      )}
                                  </AnimatePresence>
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden flex-1 overflow-y-auto w-full p-4 space-y-4">
                  {filtered.map((j) => (
                    <div
                      key={j.assessment_id}
                      className="bg-[#F4F9F8]/30 border border-teal-50 rounded-2xl p-4 shadow-xs"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-teal-50 shadow-sm">
                            <User className="w-5 h-5 text-[#2B7A75]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-800">
                              {j.nama}
                            </p>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                              Wali: {j.orangtua}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1 justify-end shrink-0 max-w-[55%]">
                          {j.tipe?.split(",").map((t, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-bold bg-amber-50 text-amber-700 border border-amber-100 whitespace-nowrap"
                            >
                              {t.trim()}
                            </span>
                          ))}
                          {!j.tipe && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[8px] font-bold bg-gray-50 text-gray-500 border border-gray-100">
                              -
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="bg-white/50 p-3 rounded-xl border border-white/50 space-y-3 mb-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Jadwal Asesmen
                            </p>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                              <CalendarDays className="w-3 h-3 text-teal-600/60" />
                              {j.tanggalObservasi}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-medium ml-4.5 mt-0.5">
                              <Clock3 className="w-3 h-3" />
                              {j.waktu}
                            </div>
                          </div>
                          <div>
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                              Administrator
                            </p>
                            <div className="flex items-center gap-1.5 text-xs font-bold text-[#2B7A75]">
                              <Settings className="w-3 h-3" />
                              <span className="truncate">
                                {j.administrator || j.asessor || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {tab === "terjadwal" ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedPasien(j);
                                setOpenAsesmen(true);
                              }}
                              className="flex-1 py-2 bg-[#2B7A75] text-white rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                              <Settings className="w-3.5 h-3.5" /> Atur Asesmen
                            </button>
                            <button
                              onClick={async () => {
                                setOpenDetail(true);
                                setDetailPasien(null);
                                try {
                                  const detail = await getAssessmentDetail(
                                    j.assessment_id,
                                  );
                                  setDetailPasien(detail);
                                } catch (err) {
                                  console.error("Gagal", err);
                                }
                              }}
                              className="px-4 py-2 bg-white border border-teal-100 text-[#2B7A75] rounded-xl active:scale-95 transition-all"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(
                                  openDropdown?.assessment_id ===
                                    j.assessment_id &&
                                    openDropdown?.role === "ortu"
                                    ? null
                                    : {
                                        assessment_id: j.assessment_id,
                                        role: "ortu",
                                      },
                                );
                              }}
                              className="py-2.5 bg-[#81B7A9] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 relative"
                            >
                              <User className="w-3.5 h-3.5" /> Data Ortu
                              <ChevronDown className="w-3 h-3" />
                              <AnimatePresence>
                                {openDropdown?.assessment_id ===
                                  j.assessment_id &&
                                  openDropdown?.role === "ortu" && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute bottom-full left-0 mb-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50 text-left"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {ORTU_ACTIONS.map((item) => (
                                        <button
                                          key={item.key}
                                          onClick={() =>
                                            handleOrtuRoute(
                                              item.key,
                                              j.assessment_id,
                                            )
                                          }
                                          className="w-full px-3 py-2.5 text-[10px] font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                                        >
                                          {item.label}
                                          <ChevronRight className="w-3 h-3 opacity-30" />
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenDropdown(
                                  openDropdown?.assessment_id ===
                                    j.assessment_id &&
                                    openDropdown?.role === "asessor"
                                    ? null
                                    : {
                                        assessment_id: j.assessment_id,
                                        role: "asessor",
                                      },
                                );
                              }}
                              className="py-2.5 bg-white border-2 border-indigo-100 text-[#5F52BF] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 relative"
                            >
                              <Stethoscope className="w-3.5 h-3.5" /> Asesor
                              <ChevronDown className="w-3 h-3" />
                              <AnimatePresence>
                                {openDropdown?.assessment_id ===
                                  j.assessment_id &&
                                  openDropdown?.role === "asessor" && (
                                    <motion.div
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute bottom-full right-0 mb-2 w-48 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden z-50 text-left"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      {ASESSOR_ACTIONS.map((item) => (
                                        <button
                                          key={item.key}
                                          onClick={() =>
                                            handleAsessorRoute(
                                              item.key,
                                              j.assessment_id,
                                            )
                                          }
                                          className="w-full px-3 py-2.5 text-[10px] font-bold text-gray-700 hover:bg-indigo-50 flex items-center justify-between border-b border-gray-50 last:border-0"
                                        >
                                          {item.label}
                                          <ChevronRight className="w-3 h-3 opacity-30" />
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                              </AnimatePresence>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        </main>
      </div>

      {openAsesmen && selectedPasien && (
        <FormEditAsesment
          title={tab === "terjadwal" ? "Edit Asesmen" : "Atur Asesmen"}
          pasienName={selectedPasien.nama}
          initialDate={
            selectedPasien.tanggalObservasi &&
            selectedPasien.tanggalObservasi !== "-"
              ? selectedPasien.tanggalObservasi
              : undefined
          }
          initialTime={
            selectedPasien.waktu && selectedPasien.waktu !== "-"
              ? selectedPasien.waktu
              : undefined
          }
          onClose={() => {
            setOpenAsesmen(false);
            setSelectedPasien(null);
          }}
          onSave={async (date, time) => {
            if (!date || !time) return;
            try {
              await updateAsessmentSchedule(
                selectedPasien.assessment_id,
                date,
                time,
              );
              await fetchJadwal();
              showSuccessToast("Jadwal asesmen sukses disimpan!");
            } catch (err) {
              console.error(err);
              handleApiError(err, "Gagal menyimpan jadwal asesmen");
            }
          }}
        />
      )}

      <FormDetailAsesment
        open={openDetail}
        pasien={detailPasien}
        onClose={() => {
          setOpenDetail(false);
          setDetailPasien(null);
        }}
      />
    </div>
  );
}

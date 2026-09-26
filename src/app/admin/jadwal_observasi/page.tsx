"use client";

import { useEffect, useState } from "react";
import {
  Search as SearchIcon,
  Settings,
  ChevronDown,
  Eye,
  Clock3,
  Calendar as CalendarIcon,
  Clock,
  Activity,
  CheckCircle2,
  ListTodo,
  ClipboardList,
  BookOpen,
  MapPin,
  UserCheck,
  Phone,
} from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import FormAturAsesmen from "@/components/form/FormAturAsesmen";
import FormDetailObservasi from "@/components/form/FormDetailObservasi";
import { handleApiError, showSuccessToast } from "@/lib/api-error";
import {
  getObservations,
  Jadwal,
  updateObservationSchedule,
  createObservationAgreement,
} from "@/lib/api/jadwal_observasi";

export default function JadwalPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState("");
  const initialTab =
    searchParams.get("tab") === "selesai"
      ? "selesai"
      : searchParams.get("tab") === "terjadwal"
        ? "terjadwal"
        : "menunggu";

  const [tab, setTab] = useState<"menunggu" | "terjadwal" | "selesai">(
    initialTab,
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") !== tab) {
      params.set("tab", tab);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [tab, router]);

  const [jadwalList, setJadwalList] = useState<Jadwal[]>([]);
  const [originalList, setOriginalList] = useState<Jadwal[]>([]);

  const [selectedPasien, setSelectedPasien] = useState<Jadwal | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [openAsesmen, setOpenAsesmen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState<any | null>(
    null,
  );

  const [filterDate, setFilterDate] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // =====================
  // Fetch Jadwal
  // =====================
  const fetchJadwal = async () => {
    setLoading(true);
    setError(null);

    try {
      let status: "pending" | "scheduled" | "completed";

      if (tab === "menunggu") status = "pending";
      else if (tab === "terjadwal") status = "scheduled";
      else status = "completed";

      const data = await getObservations(status, debouncedSearch);
      setJadwalList(data);
      setOriginalList(data);
    } catch (err) {
      console.error("Gagal memuat data jadwal:", err);
      setError("Gagal memuat data jadwal");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJadwal();
  }, [debouncedSearch]);

  useEffect(() => {
    fetchJadwal();
    setSelectedDate(null);
  }, [tab]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  // =====================
  // Filter by search
  // =====================
  const filtered = originalList.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      (j.nama || "").toLowerCase().includes(q) ||
      (j.sekolah || "").toLowerCase().includes(q) ||
      (j.orangtua || "").toLowerCase().includes(q);

    const matchDateFromCalendar =
      tab === "terjadwal" && selectedDate
        ? j.tanggalObservasi === selectedDate
        : true;

    const matchDateFromInput =
      tab === "selesai" && filterDate
        ? j.tanggalObservasi === format(new Date(filterDate), "dd/MM/yyyy")
        : true;

    return matchSearch && matchDateFromCalendar && matchDateFromInput;
  });

  // =====================
  // Handle Calendar Select
  // =====================
  const handleDateSelect = (date: Date) => {
    const formatted = format(date, "dd/MM/yyyy");
    setSelectedDate(formatted);

    const hasilFilter = originalList.filter(
      (item) => item.tanggalObservasi === formatted,
    );
    setJadwalList(hasilFilter);
  };

  // =====================
  // Navigation actions
  // =====================
  const handleRiwayatJawaban = (observation_id: number) =>
    router.push(`/admin/riwayat-hasil?observation_id=${observation_id}`);
  const handleLihatHasil = (id: number) =>
    router.push(`/admin/hasil-observasi?observation_id=${id}`);
  const handleAturAsesmen = (pasien: Jadwal) => {
    setSelectedPasien(pasien);
    setOpenAsesmen(true);
    setOpenDropdown(null);
  };

  // =====================
  // Click outside dropdown
  // =====================
  useEffect(() => {
    const close = () => setOpenDropdown(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  // =====================
  // Dual Calendar Component
  // =====================

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-transparent w-full">
      <div className="flex flex-col flex-1 w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-[#1E5C58] tracking-tight flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-[#2B7A75]" />
              Jadwal Observasi Anak
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola dan pantau antrean penjadwalan observasi pasien.
            </p>
          </div>
        </div>

        <main className="space-y-6">
          {/* Calendar Toggle for Terjadwal Tab */}
          <AnimatePresence mode="wait">
            {tab === "terjadwal" && (
              <motion.div
                key="kalender-terjadwal"
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <div className="flex flex-col sm:flex-row justify-center items-center gap-6 bg-white border border-teal-100 p-6 rounded-3xl shadow-sm overflow-hidden mb-4">
                  <div className="custom-calendar-container">
                    <Calendar
                      onChange={(value) => handleDateSelect(value as Date)}
                      locale="id-ID"
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      value={
                        selectedDate
                          ? new Date(
                              selectedDate.split("/").reverse().join("-"),
                            )
                          : new Date()
                      }
                      className="border-none shadow-sm rounded-xl font-sans! text-sm"
                    />
                  </div>

                  <div className="hidden sm:block h-64 w-px bg-gray-200" />

                  <div className="custom-calendar-container">
                    <Calendar
                      onChange={(value) => handleDateSelect(value as Date)}
                      locale="id-ID"
                      showNeighboringMonth={false}
                      next2Label={null}
                      prev2Label={null}
                      value={
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth() + 1,
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
                      key="hapus-filter-btn"
                      initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                      animate={{
                        opacity: 1,
                        height: "auto",
                        overflow: "visible",
                      }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.2 }}
                      className="flex justify-center mt-4"
                    >
                      <button
                        onClick={() => {
                          setSelectedDate(null);
                          setJadwalList(originalList);
                        }}
                        className="cursor-pointer px-5 py-2 text-xs font-bold bg-white text-gray-500 border border-gray-200 rounded-full hover:bg-gray-50 hover:text-gray-700 shadow-sm transition-all"
                      >
                        Hapus Filter: {selectedDate} ✕
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}
          </AnimatePresence>

          {/* TAB + SEARCH */}
          <div className="flex justify-between items-center mt-2">
            <div className="flex gap-6">
              {["menunggu", "terjadwal", "selesai"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t as any)}
                  className={`relative pb-2 text-sm font-medium ${tab === t
                      ? "text-[#36315B] border-b-2 border-[#81B7A9] font-semibold"
                      : "text-gray-500 hover:text-gray-700"
                    }`}
                >
                  {t === "menunggu" ? "Menunggu" : t === "terjadwal" ? "Terjadwal" : "Selesai"}
                </button>
              ))}
            </div>

            {/* SEARCH */}
            <div className="flex w-full md:w-auto gap-2">
              {tab === "selesai" && (
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="border border-gray-200 bg-gray-50 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] text-[#1E5C58]"
                />
              )}

              <div className="relative flex-1 md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari pasien / orangtua..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2B7A75]/20 focus:border-[#2B7A75] transition-all font-medium text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* TABLE */}
          {/* Table Container (Desktop) & Cards (Mobile) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] border border-teal-50 overflow-visible flex-1 flex flex-col"
          >
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-visible pb-24">
              {tab === "selesai" ? (
                <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B] bg-gray-50">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Observer</th>
                    <th className="p-3 text-left">Tanggal Observasi</th>
                    <th className="p-3 text-left">Waktu</th>
                    <th className="p-3 text-left">Status Asesmen</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((j) => (
                    <tr key={j.observation_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{j.nama}</td>
                      <td className="p-3">{j.orangtua}</td>
                      <td className="p-3">{j.observer || "-"}</td>
                      <td className="p-3">{j.tanggalObservasi || "-"}</td>
                      <td className="p-3">{j.waktu || "-"}</td>
                      <td className="p-3">{j.assessment_status || "-"}</td>
<td className="p-3 text-center relative">
  <button
    onClick={(e) => {
      e.stopPropagation();
      setSelectedPasien(j);
      setOpenDropdown(
        openDropdown === j.observation_id ? null : j.observation_id
      );
    }}
    className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded
               hover:bg-[#E9F4F1] text-xs inline-flex items-center"
  >
    <Settings size={14} className="mr-1" />
    Aksi
    <ChevronDown size={12} className="ml-1" />
  </button>

  {/* DROPDOWN */}
  {openDropdown === j.observation_id && (
    <div
      className="absolute top-full mt-2 right-0 w-56 bg-white
                 border border-[#80C2B0] rounded-lg shadow-lg z-50"
    >
      <div className="divide-y divide-gray-200 text-left">

        {tab === "selesai" && (
          <>
            <button
              onClick={() => handleAturAsesmen(j)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Settings size={16} className="mr-2" />
              Atur Asesmen
            </button>

            <button
              onClick={() => handleRiwayatJawaban(j.observation_id)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Clock3 size={16} className="mr-2" />
              Riwayat Jawaban
            </button>

            <button
              onClick={() => handleLihatHasil(j.observation_id)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Eye size={16} className="mr-2" />
              Lihat Hasil
            </button>
          </>
        )}
      </div>
    </div>
  )}
</td>

                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              // TABEL MENUNGGU & TERJADWAL
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-gray-200 text-[#36315B] bg-gray-50">
                    <th className="p-3 text-left">Nama Pasien</th>
                    <th className="p-3 text-left">Nama Orangtua</th>
                    <th className="p-3 text-left">Telepon</th>

                    {tab === "terjadwal" && (
                      <>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Jadwal Observasi
                        </th>
                        <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider">
                          Administrator
                        </th>
                      </>
                    )}
                    <th className="py-4 px-6 text-xs font-bold text-[#1E5C58] uppercase tracking-wider text-center">
                      Tindakan
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="w-8 h-8 border-4 border-teal-100 border-t-[#2B7A75] rounded-full animate-spin"></div>
                          <p className="text-sm font-medium">
                            Memuat data observasi...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-red-500 font-medium"
                      >
                        {error}
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-12 text-center text-gray-400"
                      >
                        <div className="flex flex-col items-center justify-center gap-2">
                          <ListTodo className="w-10 h-10 text-gray-300 mb-2" />
                          <p className="text-sm font-medium">
                            Tidak ada data jadwal ditemukan.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((j) => (
                      <tr
                        key={j.observation_id}
                        className="hover:bg-[#F4F9F8]/50 transition-colors group"
                      >
                        {/* Info Pasien (All Tabs) */}
                        <td className="py-4 px-6">
                          <p className="text-sm font-bold text-[#1E5C58] mb-1">
                            {j.nama || "Tidak ada nama"}
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                            <span className="bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full capitalize">
                              Wali: {j.orangtua || "-"}
                            </span>
                          </div>
                        </td>

                        {/* --- TAB MENUNGGU --- */}
                        {tab === "menunggu" && (
                          <>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                                  <Activity className="w-3.5 h-3.5 text-teal-600" />{" "}
                                  {j.usia || "-"} Tahun •{" "}
                                  {j.jenisKelamin || "-"}
                                </div>
                                <div className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                                  <BookOpen className="w-3.5 h-3.5" />{" "}
                                  {j.sekolah || "Tidak ada asal sekolah"}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6 text-sm font-medium text-gray-600">
                              {j.telepon || "-"}
                            </td>
                          </>
                        )}

                        {/* --- TAB TERJADWAL --- */}
                        {tab === "terjadwal" && (
                          <>
                            <td className="py-4 px-6">
                              <div className="space-y-1">
                                <div className="text-sm font-bold text-[#2B7A75] flex items-center gap-1.5">
                                  <CalendarIcon className="w-4 h-4" />{" "}
                                  {j.tanggalObservasi || "Belum ditentukan"}
                                </div>
                                <div className="text-xs text-gray-500 font-bold flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5" /> Pukul{" "}
                                  {j.waktu || "-"}
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-2 text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1.5 rounded-lg w-fit">
                                <UserCheck className="w-3.5 h-3.5" />{" "}
                                {j.observer || "-"}
                              </div>
                            </td>
                          </>
                        )}

                      <td className="p-3 text-center relative">
  {tab === "terjadwal" ? (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setSelectedPasien(j);
          setOpenDropdown(
            openDropdown === j.observation_id ? null : j.observation_id
          );
        }}
        className="px-3 py-1 border border-[#80C2B0] text-[#5F52BF] rounded
                   hover:bg-[#E9F4F1] text-xs inline-flex items-center"
      >
        <Settings size={14} className="mr-1" />
        Aksi
        <ChevronDown size={12} className="ml-1" />
      </button>

      {/* DROPDOWN INLINE KHUSUS TAB TERJADWAL */}
      {openDropdown === j.observation_id && (
        <div
          className="absolute top-full mt-2 right-0 w-56 bg-white
                     border border-[#80C2B0] rounded-lg shadow-lg z-50"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="divide-y divide-gray-200 text-left">
            <button
              onClick={() => handleAturAsesmen(j)}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Settings size={16} className="mr-2" />
              Edit Jadwal
            </button>

            <button
              onClick={async () => {
                try {
                  const token = localStorage.getItem("token");
                  const res = await fetch(
                    `/api/observations/${j.observation_id}/detail?type=scheduled`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  );
                  const data = await res.json();
                  setSelectedObservation(data.data);
                  setOpenDetail(true);
                  setOpenDropdown(null);
                } catch {
                  alert("Gagal memuat detail observasi");
                }
              }}
              className="flex items-center w-full px-4 py-3 text-sm hover:bg-[#E9F4F1]"
            >
              <Eye size={16} className="mr-2" />
              Detail
            </button>
          </div>
        </div>
      )}
    </>
  ) : (
    <button
      onClick={() => {
        setSelectedPasien(j);
        setOpenAsesmen(true);
      }}
      className="px-4 py-1 text-sm rounded bg-[#81B7A9] hover:bg-[#36315B] text-white transition"
    >
      {tab === "menunggu" ? "Atur Jadwal" : "Atur Asesmen"}
    </button>
  )}
</td>

                    </tr>
                  )))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
        </main>
      </div>

      {openDetail && selectedObservation && (
        <FormDetailObservasi
          open={openDetail}
          onClose={() => {
            setOpenDetail(false);
            setSelectedObservation(null);
          }}
          pasien={selectedObservation}
        />
      )}

      {/* MODAL ATUR ASESMEN */}
      {openAsesmen && selectedPasien && (
        <FormAturAsesmen
          title={
            tab === "menunggu"
              ? "Atur Jadwal Observasi"
              : tab === "terjadwal"
                ? "Perbarui Jadwal Observasi"
                : "Buat Jadwal Asesmen"
          }
          pasienName={selectedPasien.nama}
          initialDate={selectedPasien.tanggalObservasi || ""}
          initialTime={selectedPasien.waktu || ""}
          onClose={() => {
            setOpenAsesmen(false);
            setSelectedPasien(null);
          }}
          onSave={async (date, time) => {
            if (!selectedPasien) return;
            try {
              if (tab === "selesai") {
                await createObservationAgreement(
                  selectedPasien.observation_id,
                  date,
                  time,
                );
                showSuccessToast("Asesmen berhasil dijadwalkan!");
              } else {
                await updateObservationSchedule(
                  selectedPasien.observation_id,
                  date,
                  time,
                );
                showSuccessToast("Jadwal observasi sukses disimpan!");
              }
              setOpenAsesmen(false);
              setSelectedPasien(null);
              fetchJadwal();
            } catch (err) {
              console.error(err);
              handleApiError(err, "Gagal menyimpan jadwal.");
            }
          }}
        />
      )}
    </div>
  );
}

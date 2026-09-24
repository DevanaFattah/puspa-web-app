/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { registrationChild, RegistrationPayload } from "@/lib/api/registration";
import { handleApiError, showSuccessToast } from "@/lib/api-error";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Calendar,
  MapPin,
  Phone,
  Mail,
  HeartPulse,
  Sparkles,
  Building2,
  CircleUserRound,
  AlertCircle,
  FileText,
  Info,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

const layananOptions = [
  "Asesmen Tumbuh Kembang",
  "Asesmen Terpadu",
  "Konsultasi Dokter",
  "Konsultasi Psikolog",
  "Konsultasi Keluarga",
  "Test Psikolog",
  "Layanan Minat Bakat",
  "Daycare",
  "Home Care",
  "Hydrotherapy",
  "Baby Spa",
  "Lainnya",
];

export default function Page() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    namaLengkap: "",
    tempatLahir: "",
    tanggalLahir: "",
    usia: "",
    jenisKelamin: "",
    sekolah: "",
    alamat: "",
    keluhan: "",
    statusOrtu: "",
    orangTua: "",
    nomorTelepon: "",
    email: "",
    pilihanLayanan: [] as string[],
  });

  const isStep1Valid = () => {
    return (
      formData.namaLengkap.trim() !== "" &&
      formData.tempatLahir.trim() !== "" &&
      formData.tanggalLahir.trim() !== "" &&
      formData.jenisKelamin.trim() !== "" &&
      formData.alamat.trim() !== "" &&
      formData.keluhan.trim() !== ""
    );
  };

  const isStep2Valid = () => {
    return (
      formData.orangTua.trim() !== "" &&
      formData.statusOrtu.trim() !== "" &&
      formData.nomorTelepon.trim() !== "" &&
      formData.email.trim() !== ""
    );
  };

  const isStep3Valid = () => {
    return formData.pilihanLayanan.length > 0;
  };

  useEffect(() => {
    if (formData.tanggalLahir) {
      const today = new Date();
      const birthDate = new Date(formData.tanggalLahir);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, usia: String(age) }));
    }
  }, [formData.tanggalLahir]);

  const mutation = useMutation({
    mutationFn: (payload: RegistrationPayload) => registrationChild(payload),
    onSuccess: () => {
      showSuccessToast("Pendaftaran berhasil!");
      setFormData({
        namaLengkap: "",
        tempatLahir: "",
        tanggalLahir: "",
        usia: "",
        jenisKelamin: "",
        sekolah: "",
        alamat: "",
        keluhan: "",
        statusOrtu: "",
        orangTua: "",
        nomorTelepon: "",
        email: "",
        pilihanLayanan: [],
      });
      setCurrentStep(1);
      router.push("/pendaftaran");
    },
    onError: (error: any) => {
      console.error("❌ Error saat submit:", error);
      handleApiError(error, "Terjadi kesalahan saat pendaftaran.");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => {
        const updated = checked
          ? [...prev.pilihanLayanan, value]
          : prev.pilihanLayanan.filter((v) => v !== value);
        return { ...prev, pilihanLayanan: updated };
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLElement;
      if (target.tagName === "TEXTAREA") {
        return;
      }
      e.preventDefault(); // Prevent standard enter-to-submit behavior
      
      // Advance step if valid
      if (currentStep === 1 && isStep1Valid()) {
        setCurrentStep(2);
      } else if (currentStep === 2 && isStep2Valid()) {
        setCurrentStep(3);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if not on final step or if final step is invalid
    if (currentStep !== 3 || !isStep3Valid()) {
      return;
    }

    let birthDate = formData.tanggalLahir;
    if (birthDate) {
      const date = new Date(birthDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      birthDate = `${year}-${month}-${day}`;
    }

    const payload: RegistrationPayload = {
      child_name: formData.namaLengkap,
      child_gender: formData.jenisKelamin.toLowerCase(),
      child_birth_place: formData.tempatLahir,
      child_birth_date: birthDate,
      child_school: formData.sekolah,
      child_address: formData.alamat,
      child_complaint: formData.keluhan,
      child_service_choice: formData.pilihanLayanan.join(", "),
      email: formData.email,
      guardian_name: formData.orangTua,
      guardian_phone: formData.nomorTelepon,
      guardian_type: formData.statusOrtu.toLowerCase(),
    };

    mutation.mutate(payload);
  };

  return (
    <div className="min-h-screen lg:h-screen w-full bg-white flex flex-col lg:flex-row lg:overflow-hidden selection:bg-[#2B7A75] selection:text-white relative">
      {/* Sticky Mobile Header for UX */}
      <div className="sticky top-0 z-50 lg:hidden bg-[#1E5C58]/95 backdrop-blur-md text-white px-5 py-3.5 flex items-center justify-between border-b border-white/10 shadow-sm w-full">
        <div className="bg-white px-2 py-1 rounded-lg shadow-sm">
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={24}
            className="w-auto h-5 object-contain"
          />
        </div>
        <Link
          href="/auth/login"
          className="px-4 py-1.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg text-white font-bold text-xs transition-all duration-300 active:scale-95 shadow-sm"
        >
          Masuk Disini
        </Link>
      </div>

      {/* Left Side - Branding & Info */}
      <div className="w-full lg:w-5/12 bg-linear-to-br from-[#1E5C58] to-[#2B7A75] p-8 lg:p-12 text-white relative flex flex-col justify-between overflow-hidden shrink-0 lg:h-full">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#0d3633]/30 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <div className="relative z-10">
          <div className="hidden lg:inline-block bg-white p-2.5 rounded-xl mb-6 shadow-lg max-w-fit">
            <Image
              src="/logo.png"
              alt="Logo"
              width={120}
              height={35}
              className="w-auto h-6 lg:h-8 object-contain"
            />
          </div>
        </div>

        {/* Compact content group like the original card design */}
        <div className="relative z-10 flex flex-col gap-6 my-auto max-w-md py-6">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl lg:text-4xl font-extrabold leading-tight"
          >
            Tumbuh Kembang <br />
            <span className="text-[#A2E4D3]">Lebih Optimal</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-teal-50 text-sm lg:text-base leading-relaxed opacity-90"
          >
            Kami menghadirkan layanan terapi holistik dan integratif untuk
            mendukung setiap tahapan perkembangan buah hati Anda.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-1 gap-4"
          >
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="bg-[#A2E4D3]/20 p-2.5 rounded-xl">
                <HeartPulse className="w-5 h-5 text-[#A2E4D3]" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Pendekatan Holistik</h3>
                <p className="text-xs text-teal-100">
                  Penanganan tulus & menyeluruh
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="bg-[#A2E4D3]/20 p-2.5 rounded-xl">
                <ShieldCheck className="w-5 h-5 text-[#A2E4D3]" />
              </div>
              <div>
                <h3 className="font-semibold text-base">Terapis Profesional</h3>
                <p className="text-xs text-teal-100">
                  Berpengalaman & tersertifikasi
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="hidden lg:inline-block relative z-10 pt-6 border-t border-white/20 mt-auto justify-between gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-teal-50 text-xs sm:text-sm">
              Sudah memiliki akun?
            </p>
            <p className="text-white font-semibold text-sm lg:text-xs pb-3">
              Masuk untuk memantau tumbuh kembang anak secara real-time.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-md"
          >
            Masuk Disini
          </Link>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-7/12 flex flex-col lg:h-full bg-white relative lg:overflow-hidden">
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .scrollable-content::-webkit-scrollbar {
            width: 8px;
          }
          .scrollable-content::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-radius: 10px;
          }
          .scrollable-content::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
          }
          .scrollable-content::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
          }
        `,
          }}
        />
        <div className="p-6 lg:p-8 pb-3 shrink-0">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1E5C58] mb-1">
            Formulir Pendaftaran
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm mb-4">
            Lengkapi data di bawah ini agar permohonan Anda dapat segera kami
            proses.
          </p>

          {/* Stepper progress bar */}
          <div className="mb-2">
            <div className="flex items-center justify-between relative max-w-xl mx-auto px-4">
              {/* Line behind steps */}
              <div className="absolute left-4 right-4 top-5 h-0.5 bg-gray-100 -translate-y-1/2 z-0" />
              <div
                className="absolute left-4 top-5 h-0.5 bg-[#2B7A75] -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `calc(${((currentStep - 1) / 2) * 100}% - 8px)`,
                }}
              />

              {/* Step 1 */}
              <button
                type="button"
                onClick={() => currentStep > 1 && setCurrentStep(1)}
                className="cursor-pointer relative z-10 flex flex-col items-center group focus:outline-none"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-300 ${
                    currentStep >= 1
                      ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  1
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 transition-colors duration-300 ${
                    currentStep === 1 ? "text-[#1E5C58]" : "text-gray-400"
                  }`}
                >
                  Data Anak
                </span>
              </button>

              {/* Step 2 */}
              <button
                type="button"
                disabled={!isStep1Valid()}
                onClick={() => isStep1Valid() && setCurrentStep(2)}
                className="cursor-pointer relative z-10 flex flex-col items-center group focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-300 ${
                    currentStep >= 2
                      ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  2
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 transition-colors duration-300 ${
                    currentStep === 2 ? "text-[#1E5C58]" : "text-gray-400"
                  }`}
                >
                  Orang Tua
                </span>
              </button>

              {/* Step 3 */}
              <button
                type="button"
                disabled={!isStep1Valid() || !isStep2Valid()}
                onClick={() =>
                  isStep1Valid() && isStep2Valid() && setCurrentStep(3)
                }
                className="cursor-pointer relative z-10 flex flex-col items-center group focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all duration-300 ${
                    currentStep >= 3
                      ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                      : "bg-white border-gray-200 text-gray-400"
                  }`}
                >
                  3
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 transition-colors duration-300 ${
                    currentStep === 3 ? "text-[#1E5C58]" : "text-gray-400"
                  }`}
                >
                  Layanan
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="scrollable-content lg:overflow-y-auto px-6 lg:px-8 pb-6 flex-1">
          <form
            onSubmit={handleSubmit}
            onKeyDown={handleKeyDown}
            className="space-y-4 max-w-2xl mx-auto flex flex-col justify-between"
          >
            {/* Step 1 Contents */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {false && (
                  <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                    <CircleUserRound className="text-[#2B7A75] w-5 h-5" />
                    <h3 className="text-lg font-bold text-gray-800">
                      Data Anak
                    </h3>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="namaLengkap"
                      value={formData.namaLengkap}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama lengkap anak"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-sm text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Tempat Lahir <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <MapPin className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="tempatLahir"
                        value={formData.tempatLahir}
                        onChange={handleChange}
                        required
                        placeholder="Kota kelahiran"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-sm text-gray-700"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="space-y-1.5 flex-1">
                      <label className="text-xs font-semibold text-gray-700">
                        Tanggal Lahir <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          name="tanggalLahir"
                          value={formData.tanggalLahir}
                          onChange={handleChange}
                          required
                          className="w-full px-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-sm text-gray-600"
                        />
                      </div>
                    </div>
                    <div className="space-y-1.5 w-16">
                      <label className="text-sm font-semibold text-gray-700">
                        Usia
                      </label>
                      <input
                        type="text"
                        name="usia"
                        value={formData.usia}
                        readOnly
                        placeholder="-"
                        className="w-full py-2.5 text-center bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 font-bold focus:outline-none cursor-not-allowed"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-5 mt-1">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${formData.jenisKelamin === "laki-laki" ? "border-[#2B7A75]" : "border-gray-300"}`}
                        >
                          {formData.jenisKelamin === "laki-laki" && (
                            <div className="w-2.5 h-2.5 bg-[#2B7A75] rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="laki-laki"
                          className="hidden"
                          onChange={handleChange}
                        />
                        <span
                          className={`text-xs ${formData.jenisKelamin === "laki-laki" ? "font-bold text-[#1E5C58]" : "text-gray-500 group-hover:text-gray-700"}`}
                        >
                          Laki-laki
                        </span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <div
                          className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${formData.jenisKelamin === "perempuan" ? "border-[#2B7A75]" : "border-gray-300"}`}
                        >
                          {formData.jenisKelamin === "perempuan" && (
                            <div className="w-2 h-2 bg-[#2B7A75] rounded-full" />
                          )}
                        </div>
                        <input
                          type="radio"
                          name="jenisKelamin"
                          value="perempuan"
                          className="hidden"
                          onChange={handleChange}
                        />
                        <span
                          className={`text-xs ${formData.jenisKelamin === "perempuan" ? "font-bold text-[#1E5C58]" : "text-gray-500 group-hover:text-gray-700"}`}
                        >
                          Perempuan
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-gray-700">
                      Asal Sekolah
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Building2 className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="sekolah"
                        value={formData.sekolah}
                        onChange={handleChange}
                        placeholder="Nama sekolah / TK"
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-sm text-gray-700"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                    rows={3}
                    placeholder="Masukkan alamat domisili saat ini"
                    className="w-full p-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700 resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Keluhan Utama <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <AlertCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      name="keluhan"
                      value={formData.keluhan}
                      onChange={handleChange}
                      required
                      rows={3}
                      placeholder="Ceritakan keluhan atau gejala yang dialami anak"
                      className="w-full pl-11 pr-4 py-4 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700 resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 Contents */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <User className="text-[#2B7A75] w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Data Orang Tua / Wali
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Nama Orang Tua / Wali{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="orangTua"
                      value={formData.orangTua}
                      onChange={handleChange}
                      required
                      placeholder="Masukkan nama lengkap"
                      className="w-full px-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                    />
                  </div>

                  <div className="flex flex-wrap gap-4">
                    {["Ayah", "Ibu", "Wali"].map((status) => {
                      const isActive =
                        formData.statusOrtu === status.toLowerCase();
                      return (
                        <label key={status} className="cursor-pointer">
                          <input
                            type="radio"
                            name="statusOrtu"
                            value={status.toLowerCase()}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <div
                            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all ${
                              isActive
                                ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md"
                                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
                            }`}
                          >
                            {status}
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Nomor WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="nomorTelepon"
                        value={formData.nomorTelepon}
                        onChange={handleChange}
                        required
                        placeholder="Contoh: 08123456789"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="alamat@email.com"
                        className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2B7A75] focus:bg-white focus:border-transparent outline-none transition-all text-gray-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3 Contents */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                  <FileText className="text-[#2B7A75] w-5 h-5" />
                  <h3 className="text-lg font-bold text-gray-800">
                    Pilihan Layanan
                  </h3>
                </div>

                <div className="bg-[#F4F9F8] rounded-2xl p-6 border border-teal-100">
                  <p className="text-sm text-gray-600 mb-4 font-medium flex items-center gap-2">
                    <Info className="w-4 h-4 text-[#2B7A75]" /> Pilih layanan
                    yang dibutuhkan (bisa lebih dari satu){" "}
                    <span className="text-red-500">*</span>
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    {layananOptions.map((layanan) => {
                      const isChecked =
                        formData.pilihanLayanan.includes(layanan);
                      return (
                        <label
                          key={layanan}
                          className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer border transition-all ${isChecked ? "bg-white border-[#2B7A75] shadow-sm" : "border-transparent hover:bg-white/60"}`}
                        >
                          <div
                            className={`mt-0.5 shrink-0 w-5 h-5 rounded flex items-center justify-center border transition-colors ${isChecked ? "bg-[#2B7A75] border-[#2B7A75]" : "bg-white border-gray-300"}`}
                          >
                            {isChecked && (
                              <div className="w-2 h-2 bg-white rounded-sm" />
                            )}
                          </div>
                          <input
                            type="checkbox"
                            name="pilihanLayanan"
                            value={layanan}
                            checked={isChecked}
                            onChange={handleChange}
                            className="hidden"
                          />
                          <span
                            className={`text-sm leading-snug ${isChecked ? "font-medium text-[#1E5C58]" : "text-gray-600"}`}
                          >
                            {layanan}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Navigation Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((prev) => prev - 1)}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 font-bold rounded-xl hover:bg-gray-50 hover:text-gray-800 transition-all cursor-pointer text-sm"
                >
                  Kembali
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  disabled={
                    currentStep === 1 ? !isStep1Valid() : !isStep2Valid()
                  }
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  className={`px-6 py-2.5 font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer text-sm ${
                    (currentStep === 1 ? isStep1Valid() : isStep2Valid())
                      ? "bg-[#2B7A75] text-white hover:bg-[#1E5C58] shadow-md shadow-teal-500/10"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  Selanjutnya
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={mutation.isPending || !isStep3Valid()}
                  className={`px-6 py-2.5 font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${
                    isStep3Valid() && !mutation.isPending
                      ? "bg-[#2B7A75] text-white hover:bg-[#1E5C58] shadow-lg shadow-teal-500/30"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200"
                  }`}
                >
                  {mutation.isPending ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin"></div>
                      <span>Memproses...</span>
                    </div>
                  ) : (
                    "Kirim Pendaftaran"
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

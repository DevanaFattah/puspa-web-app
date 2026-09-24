"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface InputFieldProps {
    label: string;
    name?: string;
    value?: string;
    onChange?: (v: string) => void;
    type?: string;
}

function InputField({ label, name, value, onChange, type = "text" }: InputFieldProps) {
    return (
        <div className="flex flex-col">
            <label className="mb-1.5 font-bold text-xs md:text-sm text-[#1E5C58]/80">{label}</label>
            <input
                type={type}
                className="w-full border border-gray-200 p-3 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white"
                name={name}
                value={value ?? ""}
                onChange={(e) => onChange?.(e.target.value)}
            />
        </div>
    );
}

interface IdentitasFormProps {
    childName: string;
    setChildName: (v: string) => void;
    childBirthInfo: string;
    setChildBirthInfo: (v: string) => void;
    parentIdentity: any;
    setParentField: (key: string, value: any) => void;
    onSubmit: (e?: any) => void;
    submitting: boolean;
}

export default function IdentitasForm({
    childName,
    setChildName,
    childBirthInfo,
    setChildBirthInfo,
    parentIdentity,
    setParentField,
    onSubmit,
    submitting,
}: IdentitasFormProps) {
    const router = useRouter();

    return (
        <form onSubmit={onSubmit} className="space-y-5 md:space-y-6">
            {/* Bagian 1: Anak */}
            <div className="bg-gray-50/40 p-4 md:p-5 rounded-2xl border border-gray-100">
                <h3 className="font-extrabold text-[#1E5C58] text-xs md:text-sm mb-3.5 border-l-4 border-[#2B7A75] pl-3">
                    1. Identitas Anak
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                    <div className="flex flex-col">
                        <label className="font-bold mb-1 text-xs md:text-sm text-[#1E5C58]/80">Nama Lengkap</label>
                        <input
                            className="w-full border border-gray-200 p-2.5 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 cursor-not-allowed text-gray-500"
                            value={childName}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col">
                        <label className="font-bold mb-1 text-xs md:text-sm text-[#1E5C58]/80">Tanggal Lahir</label>
                        <input
                            className="w-full border border-gray-200 p-2.5 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/50 cursor-not-allowed text-gray-500"
                            value={childBirthInfo}
                            readOnly
                        />
                    </div>
                    <div className="flex flex-col md:col-span-2">
                        <label className="font-bold mb-1 text-xs md:text-sm text-[#1E5C58]/80">Alamat Rumah</label>
                        <input
                            className="w-full border border-gray-200 p-2.5 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white"
                            placeholder="Alamat domisili anak saat ini"
                            value={parentIdentity.address || ""}
                            onChange={(e) => setParentField("address", e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Bagian 2: Orangtua */}
            <div className="space-y-6">
                <h3 className="font-extrabold text-[#1E5C58] text-xs md:text-sm mb-4 border-l-4 border-[#2B7A75] pl-3">
                    2. Identitas Orang Tua / Wali
                </h3>

                {/* AYAH */}
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-teal-50/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
                    <h4 className="font-extrabold text-[#1E5C58] text-xs md:text-sm mb-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2B7A75] shrink-0" /> Ayah
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                        <InputField label="Nama Lengkap Ayah" value={parentIdentity.father_name || ""} onChange={(v) => setParentField("father_name", v)} />
                        <InputField label="Tanggal Lahir" type="date" value={parentIdentity.father_birth_date || ""} onChange={(v) => setParentField("father_birth_date", v)} />
                        <InputField label="Pekerjaan" value={parentIdentity.father_occupation || ""} onChange={(v) => setParentField("father_occupation", v)} />
                        <InputField label="Nomor Telepon (WA)" value={parentIdentity.father_phone || ""} onChange={(v) => setParentField("father_phone", v)} />
                        <InputField label="Hubungan dengan Anak" value={parentIdentity.father_relationship || ""} onChange={(v) => setParentField("father_relationship", v)} />
                        <InputField label="NIK Ayah" value={parentIdentity.father_identity_number || ""} onChange={(v) => setParentField("father_identity_number", v)} />
                    </div>
                </div>

                {/* IBU */}
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-teal-50/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
                    <h4 className="font-extrabold text-[#1E5C58] text-xs md:text-sm mb-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2B7A75] shrink-0" /> Ibu
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                        <InputField label="Nama Lengkap Ibu" value={parentIdentity.mother_name || ""} onChange={(v) => setParentField("mother_name", v)} />
                        <InputField label="Tanggal Lahir" type="date" value={parentIdentity.mother_birth_date || ""} onChange={(v) => setParentField("mother_birth_date", v)} />
                        <InputField label="Pekerjaan" value={parentIdentity.mother_occupation || ""} onChange={(v) => setParentField("mother_occupation", v)} />
                        <InputField label="Nomor Telepon (WA)" value={parentIdentity.mother_phone || ""} onChange={(v) => setParentField("mother_phone", v)} />
                        <InputField label="Hubungan dengan Anak" value={parentIdentity.mother_relationship || ""} onChange={(v) => setParentField("mother_relationship", v)} />
                        <InputField label="NIK Ibu" value={parentIdentity.mother_identity_number || ""} onChange={(v) => setParentField("mother_identity_number", v)} />
                    </div>
                </div>

                {/* WALI */}
                <div className="bg-white p-4 md:p-5 rounded-2xl border border-teal-50/60 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)]">
                    <h4 className="font-extrabold text-[#1E5C58] text-xs md:text-sm mb-3 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#2B7A75] shrink-0" /> Wali (Opsional)
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm">
                        <InputField label="Nama Lengkap Wali" value={parentIdentity.guardian_name || ""} onChange={(v) => setParentField("guardian_name", v)} />
                        <InputField label="Tanggal Lahir" type="date" value={parentIdentity.guardian_birth_date || ""} onChange={(v) => setParentField("guardian_birth_date", v)} />
                        <InputField label="Pekerjaan" value={parentIdentity.guardian_occupation || ""} onChange={(v) => setParentField("guardian_occupation", v)} />
                        <InputField label="Nomor Telepon (WA)" value={parentIdentity.guardian_phone || ""} onChange={(v) => setParentField("guardian_phone", v)} />
                        <InputField label="Hubungan dengan Anak" value={parentIdentity.guardian_relationship || ""} onChange={(v) => setParentField("guardian_relationship", v)} />
                        <InputField label="NIK Wali" value={parentIdentity.guardian_identity_number || ""} onChange={(v) => setParentField("guardian_identity_number", v)} />
                    </div>
                </div>
            </div>

            {/* BUTTONS - Stack on Mobile, Row on Desktop */}
            <div className="flex flex-col-reverse sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => router.push("/orangtua/assessment")}
                    className="bg-gray-150 hover:bg-gray-200 text-[#1E5C58] px-6 py-3.5 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95 cursor-pointer text-center"
                >
                    Batal
                </button>
                <div className="flex flex-col sm:flex-row gap-3">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-[#2B7A75] hover:bg-[#1E5C58] text-white px-8 py-3.5 rounded-2xl disabled:opacity-60 text-xs md:text-sm font-bold shadow-md shadow-teal-500/10 hover:shadow-teal-500/25 transition-all active:scale-95 cursor-pointer text-center"
                    >
                        {submitting ? "Menyimpan..." : "Simpan & Lanjutkan"}
                    </button>
                </div>
            </div>
        </form>
    );
}
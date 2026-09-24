"use client";

import React from "react";
import { FolderPlus, Plus, Trash } from "lucide-react";
import { safeJsonParse } from "../utils/helpers";

interface QuestionRendererProps {
    question: any;
    answer: any;
    onAnswerChange: (qid: any, value: any) => void;
    onToggleCheckbox: (qid: any, value: any) => void;
    onTableCellChange: (qid: any, label: string, value: any) => void;
}

export default function QuestionRenderer({
    question: q,
    answer,
    onAnswerChange,
    onToggleCheckbox,
    onTableCellChange,
}: QuestionRendererProps) {
    const extra = safeJsonParse(q.extra_schema, {});
    const optionsRaw = Array.isArray(extra?.options)
        ? extra.options
        : safeJsonParse(q.answer_options, []);

    // normalize options to string values
    const options = (optionsRaw || []).map((opt: any) =>
        typeof opt === "string" ? opt : opt?.value ?? opt?.label ?? String(opt)
    );

    const isFullWidth = ["table", "textarea", "multi"].includes(q.answer_type);

    return (
        <div className={`space-y-2 p-4 bg-white border border-teal-50/50 rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.02)] ${isFullWidth ? "col-span-full" : "col-span-full md:col-span-1"}`}>
            <label className="block font-bold text-[#1E5C58] text-xs md:text-sm leading-relaxed">
                {q.question_number ? `${q.question_number}. ` : ""}
                {q.question_text}
            </label>

            {/* TEXT */}
            {q.answer_type === "text" && (
                <TextQuestion value={answer} onChange={(v) => onAnswerChange(q.id, v)} />
            )}

            {/* NUMBER */}
            {q.answer_type === "number" && (
                <NumberQuestion value={answer} onChange={(v) => onAnswerChange(q.id, v)} />
            )}

            {/* TEXTAREA */}
            {q.answer_type === "textarea" && (
                <TextareaQuestion value={answer} onChange={(v) => onAnswerChange(q.id, v)} />
            )}

            {/* SELECT */}
            {q.answer_type === "select" && (
                <SelectQuestion
                    value={answer}
                    options={options}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* RADIO */}
            {q.answer_type === "radio" && (
                <RadioQuestion
                    qid={q.id}
                    value={answer}
                    options={options}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* CHECKBOX */}
            {q.answer_type === "checkbox" && (
                <CheckboxQuestion
                    value={answer}
                    options={options}
                    onToggle={(v) => onToggleCheckbox(q.id, v)}
                />
            )}

            {/* RADIO WITH TEXT */}
            {q.answer_type === "radio_with_text" && (
                <RadioWithTextQuestion
                    qid={q.id}
                    value={answer}
                    options={options}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* MULTI */}
            {q.answer_type === "multi" && (
                <MultiQuestion
                    value={answer}
                    fields={extra?.fields || ["Nama", "Usia"]}
                    onChange={(v) => onAnswerChange(q.id, v)}
                />
            )}

            {/* TABLE */}
            {q.answer_type === "table" && (
                <TableQuestion
                    qid={q.id}
                    value={answer}
                    rows={extra?.rows || []}
                    onCellChange={onTableCellChange}
                />
            )}
        </div>
    );
}

// ==================== SUB COMPONENTS ====================

function TextQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
    return (
        <input
            className="w-full border border-gray-200 p-3 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function NumberQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
    return (
        <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            className="w-full sm:w-36 border border-gray-200 p-3 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white"
            value={value ?? ""}
            onChange={(e) => {
                const v = e.target.value;
                if (/^\d*$/.test(v)) {
                    onChange(v);
                }
            }}
        />
    );
}

function TextareaQuestion({ value, onChange }: { value: any; onChange: (v: string) => void }) {
    return (
        <textarea
            rows={3}
            className="w-full border border-gray-200 p-3 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white resize-y min-h-[90px]"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
        />
    );
}

function SelectQuestion({
    value,
    options,
    onChange,
}: {
    value: any;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <select
            className="w-full sm:w-auto border border-gray-200 p-3 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white cursor-pointer"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Pilih salah satu</option>
            {options.map((opt, idx) => (
                <option key={idx} value={opt}>
                    {opt}
                </option>
            ))}
        </select>
    );
}

function RadioQuestion({
    qid,
    value,
    options,
    onChange,
}: {
    qid: any;
    value: any;
    options: string[];
    onChange: (v: string) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-1.5">
            {options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-gray-650 cursor-pointer select-none">
                    <input
                        type="radio"
                        name={`radio-${qid}`}
                        value={opt}
                        checked={value === opt}
                        onChange={(e) => onChange(e.target.value)}
                        className="accent-[#2B7A75] w-4.5 h-4.5 cursor-pointer"
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
}

function CheckboxQuestion({
    value,
    options,
    onToggle,
}: {
    value: any;
    options: string[];
    onToggle: (v: string) => void;
}) {
    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 mt-1.5">
            {options.map((opt, idx) => (
                <label key={idx} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-gray-650 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        checked={Array.isArray(value) && value.includes(opt)}
                        onChange={() => onToggle(opt)}
                        className="accent-[#2B7A75] w-4.5 h-4.5 rounded cursor-pointer"
                    />
                    {opt}
                </label>
            ))}
        </div>
    );
}

function RadioWithTextQuestion({
    qid,
    value,
    options,
    onChange,
}: {
    qid: any;
    value: any;
    options: string[];
    onChange: (v: any) => void;
}) {
    return (
        <div className="mt-1.5 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                {options.map((opt, idx) => (
                    <label key={idx} className="flex items-center gap-2.5 text-xs md:text-sm font-semibold text-gray-650 cursor-pointer select-none">
                        <input
                            type="radio"
                            name={`radio-${qid}`}
                            value={opt}
                            checked={value?.value === opt}
                            onChange={() => onChange({ value: opt, note: "" })}
                            className="accent-[#2B7A75] w-4.5 h-4.5 cursor-pointer"
                        />
                        {opt}
                    </label>
                ))}
            </div>

            {(value?.value === "Tidak" ||
                value?.value === "Belum Imunisasi" ||
                value?.value === "Tidak Lengkap") && (
                    <input
                        className="w-full border border-gray-200 p-3 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none transition-all duration-200 bg-gray-50/30 hover:bg-white focus:bg-white mt-2"
                        value={value?.note ?? ""}
                        onChange={(e) => onChange({ ...(value || {}), note: e.target.value })}
                        placeholder="Keterangan / Alasan detail"
                    />
                )}
        </div>
    );
}

function MultiQuestion({
    value,
    fields,
    onChange,
    color = "#2B7A75"
}: {
    value: any;
    fields: string[];
    onChange: (v: any[]) => void;
    color?: string;
}) {
    const rows = Array.isArray(value) ? value : [];

    const addRow = () => {
        const newRow: any = {};
        fields.forEach((f) => {
            newRow[f] = "";
        });
        onChange([...rows, newRow]);
    };

    const updateRow = (index: number, field: string, val: string) => {
        const updated = [...rows];
        updated[index] = { ...updated[index], [field]: val };
        onChange(updated);
    };

    const removeRow = (index: number) => {
        onChange(rows.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3 mt-1.5">
            {rows.map((row: any, index: number) => (
                <div key={index} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                    {fields.map((f) => (
                        <input
                            key={f}
                            className="w-full sm:w-auto flex-1 border border-gray-200 p-2.5 rounded-xl text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none bg-white transition-all duration-200"
                            value={row[f] || ""}
                            onChange={(e) => updateRow(index, f, e.target.value)}
                            placeholder={f}
                        />
                    ))}

                    <div className="flex gap-2 justify-end">
                        {index === rows.length - 1 && (
                            <button
                                type="button"
                                className="p-2.5 hover:bg-teal-50 rounded-xl text-[#2B7A75] transition-colors cursor-pointer"
                                onClick={addRow}
                                title="Tambah baris"
                            >
                                <FolderPlus size={18} />
                            </button>
                        )}

                        {index > 0 && (
                            <button
                                type="button"
                                className="p-2.5 hover:bg-red-50 rounded-xl text-red-500 transition-colors cursor-pointer"
                                onClick={() => removeRow(index)}
                                title="Hapus baris"
                            >
                                <Trash size={18} />
                            </button>
                        )}
                    </div>
                </div>
            ))}

            {rows.length === 0 && (
                <button
                    type="button"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-teal-50 hover:bg-[#2B7A75]/10 text-[#2B7A75] text-xs font-bold rounded-xl transition-all cursor-pointer"
                    onClick={addRow}
                >
                    <Plus size={14} /> Tambah Data
                </button>
            )}
        </div>
    );
}

function TableQuestion({
    qid,
    value,
    rows,
    onCellChange,
}: {
    qid: any;
    value: any;
    rows: string[];
    onCellChange: (qid: any, label: string, value: any) => void;
}) {
    if (!Array.isArray(rows) || rows.length === 0) {
        return <p className="text-xs md:text-sm text-gray-400">Tidak ada baris.</p>;
    }

    return (
        <div className="mt-1.5 space-y-2 overflow-x-auto">
            <div className="min-w-max space-y-2.5">
                {rows.map((label, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                        <span className="w-40 sm:w-56 text-xs md:text-sm font-semibold text-gray-700">{label}</span>
                        <input
                            className="border border-gray-200 p-2.5 rounded-xl w-32 sm:w-44 text-xs md:text-sm focus:ring-2 focus:ring-[#2B7A75] focus:border-transparent outline-none bg-white transition-all duration-200"
                            value={(value && value[label]) ?? ""}
                            onChange={(e) => onCellChange(qid, label, e.target.value)}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
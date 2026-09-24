"use client";

import React from "react";

interface NavigationButtonsProps {
    currentIndex: number;
    totalCategories: number;
    onPrev: () => void;
    onNext: () => void;
    onSubmit: () => void;
    submitting: boolean;
}

export default function NavigationButtons({
    currentIndex,
    totalCategories,
    onPrev,
    onNext,
    onSubmit,
    submitting,
}: NavigationButtonsProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between gap-3 pt-6 border-t border-gray-50">
            {currentIndex > 0 ? (
                <button
                    type="button"
                    onClick={onPrev}
                    className="bg-gray-100 hover:bg-gray-200 text-[#1E5C58] px-6 py-3 rounded-2xl text-xs md:text-sm font-bold transition-all active:scale-95 cursor-pointer text-center order-2 sm:order-1"
                >
                    Sebelumnya
                </button>
            ) : (
                <div className="hidden sm:block" />
            )}

            {currentIndex < totalCategories - 1 ? (
                <button
                    type="button"
                    onClick={onNext}
                    className="bg-[#2B7A75] hover:bg-[#1E5C58] text-white px-6 md:px-8 py-3 rounded-2xl text-xs md:text-sm font-bold shadow-md shadow-teal-500/10 transition-all active:scale-95 cursor-pointer text-center order-1 sm:order-2"
                >
                    Selanjutnya
                </button>
            ) : (
                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting}
                    className="bg-[#2B7A75] hover:bg-[#1E5C58] text-white px-6 md:px-8 py-3 rounded-2xl disabled:opacity-60 text-xs md:text-sm font-bold shadow-md shadow-teal-500/10 transition-all active:scale-95 cursor-pointer text-center order-1 sm:order-2"
                >
                    {submitting ? "Mengirim..." : "Kirim Jawaban"}
                </button>
            )}
        </div>
    );
}
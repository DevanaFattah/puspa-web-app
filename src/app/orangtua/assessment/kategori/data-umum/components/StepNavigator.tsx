"use client";

import React from "react";
import { useRouter } from "next/navigation";

interface Step {
    label: string;
    path: string;
}

interface StepNavigatorProps {
    steps: Step[];
    activeStep: number;
}

export default function StepNavigator({ steps, activeStep }: StepNavigatorProps) {
    const router = useRouter();

    return (
        <div className="mb-6 md:mb-10 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            <div className="flex items-center min-w-max md:min-w-0 md:justify-center px-4 md:px-0">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className="flex items-center"
                    >
                        {/* Kontainer Step */}
                        <div
                            className="flex flex-col items-center text-center space-y-1.5 md:space-y-2 cursor-pointer group"
                            onClick={() => router.push(step.path)}
                        >
                            {/* Lingkaran Angka */}
                            <div
                                className={`w-8 h-8 md:w-10 md:h-10 rounded-2xl flex items-center justify-center text-[10px] md:text-sm font-extrabold transition-all duration-300 ${
                                    i === activeStep
                                        ? "bg-[#2B7A75] border-[#2B7A75] text-white shadow-md shadow-teal-500/20"
                                        : i < activeStep
                                            ? "bg-teal-50/50 border-[#2B7A75]/30 text-[#2B7A75]"
                                            : "bg-gray-100 border-gray-200 text-gray-400"
                                } border-2`}
                            >
                                {i + 1}
                            </div>

                            {/* Label */}
                            <span
                                className={`text-[10px] md:text-xs font-bold transition-colors ${
                                    i === activeStep
                                        ? "text-[#1E5C58]"
                                        : "text-gray-400 group-hover:text-gray-600"
                                } max-w-[70px] md:max-w-none leading-tight`}
                            >
                                {step.label}
                            </span>
                        </div>

                        {/* Garis Penghubung */}
                        {i < steps.length - 1 && (
                          <div
                            className={`h-0.5 transition-all duration-300 mx-2 md:mx-4 translate-y-[-10px] md:translate-y-[-14px] rounded-full ${
                              i < activeStep ? "bg-[#2B7A75] w-6 md:w-16" : "bg-gray-200 w-4 md:w-12"
                            }`}
                          />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
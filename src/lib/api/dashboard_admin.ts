/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";

// =======================
// Interfaces
// =======================
export interface DashboardStats {
  assessment_today: number;
  observation_today: number;
  active_patients: number;
  date: {
    current: string;
    formatted: string;
  };
  patient_categories: PatientCategory[];
}

export interface PatientCategory {
  type: string;
  type_key: string;
  count: string;
  percentage: number;
}

export interface TodaySchedule {
  assessment_id: string;
  nama_pasien: string;
  jenis_terapi: string;
  waktu: string;
}

// =======================
// API Functions
// =======================
export async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) return null;

    const res = await api.get("/admins/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res.data?.data || null;
  } catch (error) {
    console.error("❌ Dashboard stats error:", error);
    return null;
  }
}

export async function getTodaySchedule(): Promise<TodaySchedule[]> {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token")
        : null;

    if (!token) return [];

    const res = await api.get("/admins/dashboard/today-schedule", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const list = res.data?.data || [];

    return list.map((item: any) => ({
      assessment_id: item.assessment_id,
      nama_pasien: item.child_name,
      jenis_terapi: item.types.join(", "),
      waktu: item.time,
    }));
  } catch (error) {
    console.error("❌ Today schedule error:", error);
    return [];
  }
}
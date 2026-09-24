/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import axiosInstance from "@/lib/axios";


export interface RegistrationPayload {
  child_name: string;
  child_gender: string;
  child_birth_place: string;
  child_birth_date: string;
  child_school: string;
  child_address: string;
  child_complaint: string;
  child_service_choice: string; 
  email: string;
  guardian_name: string;
  guardian_phone: string;
  guardian_type: string;
}

export async function registrationChild(payload: RegistrationPayload) {
  try {
    const response = await axiosInstance.post(
      "/registration", 
      payload
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("❌ Axios error detail:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers,
      });
    } else {
      console.error("❌ Unknown error:", error);
    }
    throw error;
  }
}

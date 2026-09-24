/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

export async function resendVerification(userId: string) {
  try {
    const res = await axiosInstance.post(`/auth/resend-verification/${userId}`);
    return { success: true, message: res.data?.message || "Email dikirim ulang!" };
  } catch (error: any) {
    if (error.response) return { success: false, message: error.response.data?.message };
    return { success: false, message: "Tidak dapat terhubung ke server." };
  }
}

export async function getVerificationStatus(userId: string) {
  try {
    const res = await axiosInstance.get(`/auth/resend-status/${userId}`);
    const status = res.data?.status;
    let message = "";

    if (status === "already") message = "Akun sudah diverifikasi.";
    else if (status === "success") message = "Verifikasi berhasil!";
    else message = "Menunggu verifikasi.";

    return { success: true, status, message };
  } catch (error: any) {
    if (error.response) return { success: false, message: error.response.data?.message };
    return { success: false, message: "Tidak dapat terhubung ke server." };
  }
}

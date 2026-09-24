/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import axiosInstance from "@/lib/axios";

export async function registerUser({
  email,
  username,
  password,
}: {
  email: string;
  username: string;
  password: string;
}) {
  try {
    const res = await axiosInstance.post(
      "/auth/register",
      { email, username, password }
    );

    const user_id =
      res.data?.data?.user_id ||
      res.data?.data?.user?.id ||
      res.data?.user_id ||
      null;

    return {
      success: true,
      message:
        res.data?.message ||
        "Registrasi berhasil! Silakan verifikasi email Anda.",
      user_id,
    };
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (status === 422 && data.errors) {
        const emailError = data.errors.email?.[0];
        const usernameError = data.errors.username?.[0];
        const passwordError = data.errors.password?.[0];

        throw new Error(
          emailError ||
            usernameError ||
            passwordError ||
            data.message ||
            "Data tidak valid. Mohon periksa kembali."
        );
      }

      throw new Error(data?.message || "Terjadi kesalahan di server.");
    }

    if (error.request) {
      throw new Error("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
    }

    throw new Error(error.message || "Terjadi kesalahan tak terduga.");
  }
}

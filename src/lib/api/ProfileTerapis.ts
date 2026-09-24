/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ===================== IMAGE URL NORMALIZER =====================
function normalizeProfilePictureUrl(path?: string | null): string | null {
  if (!path) return null;
  const filename = path.split("/").pop();
  if (!filename) return null;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://puspa-api.alfirdausina.com/api/v1";
  const storageBase = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${storageBase}/storage/therapists/${filename}`;
}

// ===================== INTERFACE (TYPE) =====================
export interface TherapistProfile {
  user_id: string;
  therapist_id: string;
  therapist_name: string;
  therapist_phone: string;
  therapist_section: string;
  email: string;
  role: string;
  profile_picture: string | null;
  therapist_birth_date: string;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: TherapistProfile;
}

// ===================== FETCH PROFILE =====================
export const showProfile = async (token?: string): Promise<ProfileResponse | null> => {
  try {
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    const res = await axiosInstance.get<ProfileResponse>("/asse-thera/profile", { headers });

    if (res.data?.data?.profile_picture) {
      res.data.data.profile_picture = normalizeProfilePictureUrl(res.data.data.profile_picture);
    }

    return res.data;
  } catch (error: any) {
    if (error.response) {
      console.error("Error fetching profile:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return null;
  }
};
export async function updateProfileWithPhoto(
  therapistId: string,
  formData: FormData
): Promise<ProfileResponse | null> {
  try {
    const res = await axiosInstance.post<ProfileResponse>(
      `/asse-thera/${therapistId}/profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    // Normalisasi URL foto setelah update
    if (res.data?.data?.profile_picture) {
      res.data.data.profile_picture = normalizeProfilePictureUrl(
        res.data.data.profile_picture
      );
    }

    return res.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    return null;
  }
}


// ===================== UPDATE PASSWORD =====================
export interface UpdatePasswordResponse {
  success: boolean;
  message: string;
}

export interface UpdatePasswordPayload {
  current_password: string;
  password: string;
  password_confirmation: string;
}

export async function updatePassword(
  data: UpdatePasswordPayload
): Promise<UpdatePasswordResponse | null> {
  try {
    const payload = {
      ...data,
      _method: "PUT",
    };

    const res = await axiosInstance.post<UpdatePasswordResponse>(
      "/profile/update-password",
      payload
    );

    return res.data;
  } catch (error: any) {
    console.error("🔥 FULL ERROR:", error.response?.data);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.errors ||
        "Gagal mengubah password",
    };
  }
}
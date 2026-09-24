/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/lib/axios";

// ===================== IMAGE URL NORMALIZER =====================
function normalizeProfilePictureUrl(path?: string | null): string | null {
  if (!path) return null;
  const filename = path.split("/").pop();
  if (!filename) return null;
  const apiBase = process.env.NEXT_PUBLIC_API_URL || "https://puspa-api.alfirdausina.com/api/v1";
  const storageBase = apiBase.replace(/\/api\/v1\/?$/, "");
  return `${storageBase}/storage/guardians/${filename}`;
}

// ===================== INTERFACE (TYPE) =====================
export interface ParentProfile {
  user_id: string;
  guardian_id: string;
  family_id: string;
  guardian_name: string;
  guardian_type: string;
  relationship_with_child: string;
  guardian_birth_date: string;
  guardian_phone: string;
  email: string;
  role: string;
  guardian_occupation: string;
  profile_picture: string | null;
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ParentProfile;
}

export const getParentProfile = async (token?: string): Promise<ProfileResponse | null> => {
  if (!token) {
    console.error("Token tidak tersedia");
    return null;
  }

  try {
    const res = await axiosInstance.get<ProfileResponse>("/my/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (res.data?.data?.profile_picture) {
      res.data.data.profile_picture = normalizeProfilePictureUrl(res.data.data.profile_picture);
    }

    return res.data;
  } catch (error: any) {
    if (error.response) {
      // Error dari server
      console.error("Error fetching profile:", error.response.data);
    } else if (error.request) {
      // Request dibuat tapi tidak ada response
      console.error("No response received:", error.request);
    } else {
      // Error lain
      console.error("Error setting up request:", error.message);
    }
    return null;
  }
};


// ===================== UPDATE PROFILE =====================
export async function updateParentProfile(
  guardianId: string,
  formData: FormData
): Promise<ProfileResponse | null> {
  try {
    const res = await axiosInstance.post<ProfileResponse>(
      `/my/profile/${guardianId}`,
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

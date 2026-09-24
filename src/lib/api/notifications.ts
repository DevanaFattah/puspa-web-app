import api from "@/lib/axios";

export interface NotificationData {
  child_id: string;
  child_name: string;
  guardian_name: string;
  message: string;
  type: string;
}

export interface Notification {
  id: string;
  type: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
}

export async function getNotifications() {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.get("/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data?.data || [];
  } catch (error) {
    console.error("ERROR getNotifications:", error);
    return [];
  }
}

export async function readNotification(id: string) {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.get(`/notifications/${id}/read`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ERROR readNotification:", error);
    throw error;
  }
}

export async function readAllNotifications() {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.get("/notifications/read-all", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ERROR readAllNotifications:", error);
    throw error;
  }
}

export async function deleteAllNotifications() {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.delete("/notifications", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ERROR deleteAllNotifications:", error);
    throw error;
  }
}

export async function deleteNotification(id: string) {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await api.delete(`/notifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  } catch (error) {
    console.error("ERROR deleteNotification:", error);
    throw error;
  }
}

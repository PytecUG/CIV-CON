import axios from "axios";
import { toast } from "sonner";
import api from "@/api/client";

const API_BASE = "https://civcon.onrender.com";

export const notificationService = {
  async getAll() {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/notifications/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async markAllAsRead(notifications: any[]) {
    try {
      await Promise.all(
        notifications.map((n) =>
          api.post(`/notifications/${n.id}/read`).catch(() => null)
        )
      );
      toast.success("All notifications marked as read!");
    } catch (err) {
      console.error("Error marking all as read:", err);
      toast.error("Failed to mark all notifications as read.");
    }
  },

  async markRead(id: number) {
    const token = localStorage.getItem("token");
    const res = await axios.patch(
      `${API_BASE}/notifications/${id}/read`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },
};

import axios from "axios";

const API_BASE = "https://civcon.onrender.com";

export const notificationService = {
  async getAll() {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_BASE}/notifications/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
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

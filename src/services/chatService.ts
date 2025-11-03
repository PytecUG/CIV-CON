// src/services/chatService.ts
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.civ-con.org";

export const chatService = {
  getHistory: async (groupId: string) => {
    const res = await axios.get(`${API_BASE}/messages/${groupId}`);
    return res.data;
  },
};

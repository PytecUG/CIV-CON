// src/services/chatService.ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";


export const chatService = {
  getHistory: async (groupId: string) => {
    const res = await axios.get(`${API_URL}/messages/${groupId}`);
    return res.data;
  },
};

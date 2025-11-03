import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";


export const eventService = {
  async list(params?: {
    search?: string;
    category?: string;
    location?: string;
    upcoming?: boolean;
    sort?: string;
    date_from?: string;
    date_to?: string;
    organizer_id?: number;
    skip?: number;
    limit?: number;
  }) {
    const res = await axios.get(`${API_URL}/events/`, { params });
    return res.data;
  },

  async getById(id: number) {
    const res = await axios.get(`${API_URL}/events/${id}`);
    return res.data;
  },

  async create(data: {
    title: string;
    description?: string;
    date: string;
    time?: string;
    location: string;
    category?: string;
  }, token: string) {
    const res = await axios.post(`${API_URL}/events/`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async join(id: number, token: string) {
    const res = await axios.post(`${API_URL}/events/${id}/join`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async leave(id: number, token: string) {
    const res = await axios.post(`${API_URL}/events/${id}/leave`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async attendees(id: number, params?: { skip?: number; limit?: number }) {
    const res = await axios.get(`${API_URL}/events/${id}/attendees`, { params });
    return res.data;
  },
};

import api from "@/api/client";

/**
 * Service for interacting with live feeds and their messages
 */
export const liveFeedService = {
  /**  Get all active or recent live feeds */
  async getAll(params?: { active_only?: boolean; limit?: number; skip?: number }) {
    const res = await api.get("/live-feeds/", { params });
    return res.data;
  },

  /**  Get a single live feed by ID */
  async getOne(feedId: number) {
    const res = await api.get(`/live-feeds/${feedId}`);
    return res.data;
  },

  /**  Get messages for a specific live feed (chat history) */
  async getMessages(feedId: number, limit = 50, newest_first = false) {
    const res = await api.get(`/live-feeds/${feedId}/messages`, {
      params: { limit, newest_first },
    });
    return res;
  },

  /**  Create a new live feed (Journalist only) */
  async create(data: { title: string; description: string; stream_url?: string }) {
    const res = await api.post("/live-feeds/", data);
    return res.data;
  },

  /**  Update an existing live feed */
  async update(feedId: number, data: Partial<{ title: string; description: string; stream_url?: string; is_active?: boolean }>) {
    const res = await api.put(`/live-feeds/${feedId}`, data);
    return res.data;
  },

  /**  Delete a live feed */
  async remove(feedId: number) {
    const res = await api.delete(`/live-feeds/${feedId}`);
    return res.data;
  },
};

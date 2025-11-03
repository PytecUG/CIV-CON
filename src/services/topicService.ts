import api from "@/api/client";

export const topicService = {
  async getAll(params?: Record<string, any>) {
    const res = await api.get("/topics", { params });
    return res.data;
  },

  async create(data: { title: string; description: string; category: string }) {
    const res = await api.post("/topics", data);
    return res.data;
  },
};

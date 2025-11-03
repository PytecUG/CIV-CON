import api from "@/lib/api";

export const adminDashboardService = {
  async getAnalytics() {
    const { data } = await api.get("/admin/analytics");
    return data;
  },
};

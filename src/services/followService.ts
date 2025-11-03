import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.civ-con.org";

export const followService = {
  async follow(userId: number, token: string) {
    const res = await axios.post(`${API_BASE}/follow/${userId}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  async getMutualInterests(userId: number, token: string) {
  const res = await axios.get(`${API_BASE}/users/${userId}/mutual-interests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
    },


  async unfollow(userId: number, token: string) {
    const res = await axios.delete(`${API_BASE}/follow/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  async getMutualFollowers(userId: number, token: string) {
  const res = await axios.get(`${API_BASE}/users/${userId}/mutual-followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
    },


  async getFollowers(userId: number) {
    const res = await axios.get(`${API_BASE}/follow/${userId}/followers`);
    return res.data;
  },

  async getSuggested(token: string) {
  const res = await axios.get(`${API_BASE}/users/suggested`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
    },



  async getFollowing(userId: number) {
    const res = await axios.get(`${API_BASE}/follow/${userId}/following`);
    return res.data;
  },
};

import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";


export const followService = {
  async follow(userId: number, token: string) {
    const res = await axios.post(`${API_URL}/follow/${userId}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  async getMutualInterests(userId: number, token: string) {
  const res = await axios.get(`${API_URL}/users/${userId}/mutual-interests`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
    },


  async unfollow(userId: number, token: string) {
    const res = await axios.delete(`${API_URL}/follow/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
  async getMutualFollowers(userId: number, token: string) {
  const res = await axios.get(`${API_URL}/users/${userId}/mutual-followers`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
    },


  async getFollowers(userId: number) {
    const res = await axios.get(`${API_URL}/follow/${userId}/followers`);
    return res.data;
  },

  async getSuggested(token: string) {
  const res = await axios.get(`${API_URL}/users/suggested`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
    },



  async getFollowing(userId: number) {
    const res = await axios.get(`${API_URL}/follow/${userId}/following`);
    return res.data;
  },
};

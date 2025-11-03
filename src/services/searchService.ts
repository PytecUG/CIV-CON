import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";


export const searchService = {
  async globalSearch(query: string) {
    if (!query.trim()) return [];

    const res = await axios.get(`${API_URL}/search`, {
      params: { query },
    });

    const data = res.data || {};

    //  Flatten all sections (articles, posts, users, comments)
    const suggestions = [
      ...(data.articles || []).map((a: any) => ({
        id: a.id,
        title: a.title || a.summary,
        type: "article",
      })),
      ...(data.posts || []).map((p: any) => ({
        id: p.id,
        title: p.title,
        type: "post",
      })),
      ...(data.users || []).map((u: any) => ({
        id: u.id,
        title: `${u.first_name} ${u.last_name}`.trim() || u.username,
        type: "user",
      })),
      ...(data.comments || []).map((c: any) => ({
        id: c.id,
        title: c.content?.slice(0, 60) + "...",
        type: "comment",
      })),
    ];

    return suggestions;
  },
};

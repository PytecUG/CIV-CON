import api from "@/api/client";

export interface Group {
  id: number;
  name: string;
  description: string;
  category?: string;
  image?: string;
  is_joined?: boolean;
  member_count?: number;
  post_count?: number;
  created_at?: string;
}

let cachedGroups: Group[] | null = null;

/**
 * 🧠 groupService — handles all group-related API operations
 */
export const groupService = {
  /** 🔹 Fetch all groups (with local cache) */
  async getAll(forceRefresh = false): Promise<Group[]> {
    try {
      if (cachedGroups && !forceRefresh) {
        return cachedGroups;
      }

      const res = await api.get("/groups/");
      const data = res.data;

      if (Array.isArray(data)) cachedGroups = data;
      return data;
    } catch (error: any) {
      console.error("❌ Error fetching groups:", error.response?.data || error);
      throw new Error("Failed to load groups");
    }
  },

  /** 🔹 Fetch a single group by ID */
  async getOne(groupId: number): Promise<Group> {
    try {
      const res = await api.get(`/groups/${groupId}`);
      return res.data;
    } catch (error: any) {
      console.error("❌ Error fetching group:", error.response?.data || error);
      throw new Error("Group not found");
    }
  },

  /** 🔹 Create a new group */
  async create(data: {
    name: string;
    description: string;
    category?: string;
  }): Promise<Group> {
    try {
      const res = await api.post("/groups/", data);
      cachedGroups = null; // clear cache after creation
      return res.data;
    } catch (error: any) {
      console.error("❌ Error creating group:", error.response?.data || error);
      throw new Error("Failed to create group");
    }
  },

  /** 🔹 Join a group */
  async join(groupId: number): Promise<any> {
    try {
      const res = await api.post(`/groups/${groupId}/join`);
      // Update local cache if exists
      if (cachedGroups) {
        cachedGroups = cachedGroups.map((g) =>
          g.id === groupId ? { ...g, is_joined: true } : g
        );
      }
      return res.data;
    } catch (error: any) {
      console.error("❌ Error joining group:", error.response?.data || error);
      throw new Error("Failed to join group");
    }
  },

  /** 🔹 Leave a group */
  async leave(groupId: number): Promise<any> {
    try {
      const res = await api.post(`/groups/${groupId}/leave`);
      if (cachedGroups) {
        cachedGroups = cachedGroups.map((g) =>
          g.id === groupId ? { ...g, is_joined: false } : g
        );
      }
      return res.data;
    } catch (error: any) {
      console.error("❌ Error leaving group:", error.response?.data || error);
      throw new Error("Failed to leave group");
    }
  },

  /** 🔹 Fetch posts inside a group */
  async getPosts(
    groupId: number,
    skip = 0,
    limit = 10
  ): Promise<any[]> {
    try {
      const res = await api.get(`/groups/${groupId}/posts`, {
        params: { skip, limit },
      });
      return res.data?.data || [];
    } catch (error: any) {
      console.error(" Error fetching group posts:", error.response?.data || error);
      throw new Error("Failed to load group posts");
    }
  },
};

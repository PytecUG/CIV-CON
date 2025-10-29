import axios, { AxiosError, CancelTokenSource } from "axios";
import { toast } from "sonner";

const API_BASE = "https://civcon.onrender.com";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
});

//  Inject token into every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

//  Auto logout on 401 Unauthorized
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      toast.error("Session expired. Please sign in again.");
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export const postService = {
  /**  Get all posts */
  async getAllPosts() {
    try {
      const res = await api.get("/posts/");
      return res.data;
    } catch (err: any) {
      console.error(" Error fetching posts:", err.response?.data || err.message);
      toast.error("Failed to load posts from server.");
      throw err;
    }
  },

  /**  Get a single post by ID */
  async getPostById(id: number) {
    try {
      const res = await api.get(`/posts/${id}`);
      return res.data;
    } catch (err: any) {
      console.error(" Error fetching post:", err);
      toast.error("Post not found or failed to load.");
      throw err;
    }
  },

  /**  Toggle like / unlike */
  async toggleLike(postId: number) {
    try {
      const res = await api.post(`/posts/${postId}/like`);
      return res.data; // should contain { is_liked, like_count }
    } catch (err: any) {
      console.error(" Error toggling like:", err.response?.data || err.message);
      toast.error("Could not update like status.");
      throw err;
    }
  },

  /**  Get comments (with nested replies) */
  async getComments(postId: number) {
    try {
      const res = await api.get(`/posts/${postId}/comments`);
      return res.data;
    } catch (err: any) {
      console.error(" Error fetching comments:", err.response?.data || err.message);
      toast.error("Could not load comments for this post.");
      throw err;
    }
  },

  /**  Add a comment or reply */
  async addComment(postId: number, content: string, parentId?: number) {
    try {
      const payload = parentId ? { content, parent_id: parentId } : { content };
      const res = await api.post(`/posts/${postId}/comments`, payload);
      toast.success("Comment added!");
      return res.data;
    } catch (err: any) {
      console.error(" Error adding comment:", err.response?.data || err.message);
      toast.error("Failed to post comment. Please try again.");
      throw err;
    }
  },

  /**  Create a new post (with optional media) */
  async createPost(
    formData: FormData,
    onUploadProgress?: (progressEvent: ProgressEvent) => void,
    cancelToken?: CancelTokenSource
  ) {
    try {
      const res = await api.post("/posts/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress,
        cancelToken: cancelToken?.token,
      });
      toast.success("Post created successfully!");
      return res.data;
    } catch (err: any) {
      console.error(" Error creating post:", err.response?.data || err.message);
      toast.error("Failed to upload post. Please try again.");
      throw err;
    }
  },

  /**  Share a post */
  async sharePost(postId: number) {
    try {
      const shareUrl = `${window.location.origin}/post/${postId}`;

      if (navigator.share) {
        await navigator.share({
          title: "CivCon Post",
          text: "Check out this post on CivCon",
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }

      const res = await api.post(`/posts/${postId}/share`);
      toast.success("Post shared successfully!");
      return res.data;
    } catch (err: any) {
      console.error("Error sharing post:", err);
      toast.error("Failed to share post.");
      throw err;
    }
  },

  /**  Update an existing post */
  async updatePost(postId: number, formData: FormData) {
    try {
      const res = await api.put(`/posts/${postId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Post updated successfully!");
      return res.data;
    } catch (err: any) {
      console.error(" Error updating post:", err.response?.data || err.message);
      toast.error("Failed to update post.");
      throw err;
    }
  },
    /**  Logout current user */
  async logout() {
    try {
      // Optional backend call (if endpoint exists)
      await api.post("/auth/logout").catch(() => {}); 

      // Clear local data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      toast.success("You have been logged out.");
      window.location.href = "/signin";  // redirect to login page
    } catch (err: any) {
      console.error("Error logging out:", err.response?.data || err.message);
      toast.error("Logout failed, please try again.");
    }
  },


  /**  Delete a post */
  async deletePost(postId: number) {
    try {
      await api.delete(`/posts/${postId}`);
      toast.success("Post deleted successfully!");
      return true;
    } catch (err: any) {
      console.error(" Error deleting post:", err.response?.data || err.message);
      toast.error("Failed to delete post.");
      throw err;
    }
  },

  /**  Create a cancel token for uploads */
  createCancelToken(): CancelTokenSource {
    return axios.CancelToken.source();
  },
};



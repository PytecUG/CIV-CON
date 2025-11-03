import axios, { AxiosError } from "axios";

const API_BASE_URL = "https://api.civ-con.org";
const CLOUDINARY_UPLOAD_URL = "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload"; // ⚠️ replace YOUR_CLOUD_NAME
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET"; // ⚠️ replace with your unsigned preset

/** Reusable Axios instance for your backend */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

export const articleService = {
  /** Fetch paginated + filtered articles */
  async getAllArticles(params?: Record<string, any>) {
    try {
      const res = await api.get("/articles", { params });
      return res.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch articles");
      return [];
    }
  },

  /** Fetch single article by ID */
  async getArticleById(id: number) {
    try {
      const res = await api.get(`/articles/${id}`);
      return res.data;
    } catch (error) {
      handleApiError(error, "Failed to fetch article details");
      throw error;
    }
  },

  /**
   * Create a new article.
   * Automatically uploads image to Cloudinary if a File is passed.
   */
  async createArticle(articleData: any, token: string) {
    try {
      let imageUrl = articleData.image;

      // ✅ If the image is a File object, upload to Cloudinary
      if (articleData.image && articleData.image instanceof File) {
        imageUrl = await uploadToCloudinary(articleData.image);
      }

      const payload = {
        ...articleData,
        image: imageUrl,
      };

      const res = await api.post("/articles", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      handleApiError(error, "Failed to create article");
      throw error;
    }
  },

  /** Update existing article */
  async updateArticle(id: number, articleData: any, token: string) {
    try {
      let imageUrl = articleData.image;

      if (articleData.image && articleData.image instanceof File) {
        imageUrl = await uploadToCloudinary(articleData.image);
      }

      const payload = { ...articleData, image: imageUrl };

      const res = await api.put(`/articles/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return res.data;
    } catch (error) {
      handleApiError(error, "Failed to update article");
      throw error;
    }
  },

  /** Delete an article */
  async deleteArticle(id: number, token: string) {
    try {
      const res = await api.delete(`/articles/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error) {
      handleApiError(error, "Failed to delete article");
      throw error;
    }
  },
};

/**
 * Uploads a File to Cloudinary and returns the secure URL.
 */
async function uploadToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.secure_url;
  } catch (error) {
    handleApiError(error, "Cloudinary upload failed");
    throw new Error("Image upload failed");
  }
}

/**
 * Generic API error handler
 */
function handleApiError(error: unknown, message: string) {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    console.error(`${message}:`, axiosError.response?.data || axiosError.message);
  } else {
    console.error(`${message}:`, error);
  }
}

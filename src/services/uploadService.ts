import axios from "axios";

const API_BASE_URL = "https://api.civ-con.org"; 

export const uploadService = {
  async uploadArticleImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(`${API_BASE_URL}/articles/upload-image`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data.url; 
  },
};

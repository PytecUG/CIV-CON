import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL || "https://api.civ-con.org";


export const messageService = {
  //  Send a new private message
  async sendMessage(recipientId: number, content: string, token: string) {
    const res = await axios.post(
      `${API_URL}/messages/`,
      { recipient_id: recipientId, content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return res.data;
  },

  //  List received messages (for MPs)
  async getReceivedMessages(token: string) {
    const res = await axios.get(`${API_URL}/messages/received`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  //  Fetch conversation history between two users
  async getConversation(withUserId: number, token: string) {
    const res = await axios.get(`${API_URL}/messages/conversation/${withUserId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },
};

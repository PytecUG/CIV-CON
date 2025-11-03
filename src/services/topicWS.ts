// src/services/topicWS.ts
let socket: WebSocket | null = null;

export const connectTopicSocket = (onMessage: (data: any) => void) => {
  const WS_BASE = "wss://civcon.onrender.com/ws/topics";
  if (socket) socket.close();

  socket = new WebSocket(WS_BASE);

  socket.onopen = () => console.log("🔗 Topics WebSocket connected");
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("🆕 New topic broadcast:", data);
      onMessage(data);
    } catch (err) {
      console.error("Invalid WebSocket message:", event.data);
    }
  };

  socket.onclose = () => console.warn(" Topics WebSocket closed");
  socket.onerror = (err) => console.error(" Topics WS error:", err);

  return socket;
};

export const disconnectTopicSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

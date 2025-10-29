let socket: WebSocket | null = null;

export const connectNotificationSocket = (
  token: string,
  onMessage: (data: any) => void
) => {
  const WS_BASE = "wss://civcon.onrender.com/ws/notifications";
  if (socket) socket.close();

  socket = new WebSocket(`${WS_BASE}?token=${token}`);

  socket.onopen = () => console.log("🔗 WebSocket connected to CivCon");
  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(" New WS message:", data);
      onMessage(data);
    } catch (err) {
      console.error("Invalid WS message:", event.data);
    }
  };

  socket.onclose = (e) => {
    console.warn(" WebSocket closed:", e.reason);
  };
  socket.onerror = (err) => {
    console.error(" WebSocket error:", err);
  };

  return socket;
};

export const disconnectNotificationSocket = () => {
  if (socket) {
    socket.close();
    socket = null;
  }
};

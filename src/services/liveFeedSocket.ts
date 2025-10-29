let socket: WebSocket | null = null;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let reconnectAttempts = 0;

interface OutgoingMessage {
  message: string;
  type?: string;
}

/**
 * Connects to a live feed WebSocket
 */
export const connectLiveFeedSocket = (
  feedId: number,
  token: string,
  onMessage: (data: any) => void
): WebSocket => {
  const WS_URL = `wss://civcon.onrender.com/ws/live/${feedId}?token=${token}`;

  // Close any existing socket before reconnecting
  if (socket) {
    socket.close();
    socket = null;
  }

  socket = new WebSocket(WS_URL);
  (window as any).currentLiveSocket = socket;

  console.log(` Attempting WebSocket connection → ${WS_URL}`);

  socket.onopen = () => {
    reconnectAttempts = 0;
    console.log(` Connected to Live Feed #${feedId}`);
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error(" Invalid WebSocket message:", event.data);
    }
  };

  socket.onclose = (e) => {
    console.warn(` LiveFeed WS closed: [${e.code}] ${e.reason || "no reason"}`);
    socket = null;

    // Attempt to reconnect only if not a normal close
    if (!e.wasClean && reconnectAttempts < 10) {
      const delay = Math.min(5000 * (reconnectAttempts + 1), 30000);
      console.log(` Reconnecting in ${delay / 1000}s...`);
      reconnectTimer = setTimeout(() => {
        reconnectAttempts++;
        connectLiveFeedSocket(feedId, token, onMessage);
      }, delay);
    } else if (reconnectAttempts >= 10) {
      console.error(" Max reconnection attempts reached. Giving up.");
    }
  };

  socket.onerror = (err) => {
    console.error(" WebSocket error:", err);
  };

  return socket;
};

/**
 * Cleanly disconnects WebSocket and clears timers
 */
export const disconnectLiveFeedSocket = (): void => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }

  if (socket) {
    socket.close(1000, "Client closed connection");
    socket = null;
  }

  console.log(" WebSocket disconnected.");
};

/**
 * Sends a message through the live feed WebSocket
 */
export const sendLiveFeedMessage = (message: string): void => {
  const payload: OutgoingMessage = { message, type: "chat" };

  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(payload));
  } else {
    console.warn(" WebSocket not open — message not sent:", message);
  }
};

// 简单的 WebSocket 客户端
const socket = new WebSocket("ws://localhost:8000");

socket.onopen = () => {
  console.log("Connected to WebSocket server");
  socket.send("ping");
};

socket.onmessage = (event) => {
  console.log("Received:", event.data);
};

socket.onclose = () => {
  console.log("Connection closed");
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};
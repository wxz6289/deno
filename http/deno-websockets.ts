Deno.serve((req) => {
  if (req.headers.get("upgrade")?.toLowerCase() !== "websocket")
    return new Response(null, { status: 426 });

  const { socket, response } = Deno.upgradeWebSocket(req);
  socket.addEventListener("open", () => {
    console.log("a client connected");
  });
  socket.addEventListener("message", (event) => {
    console.log("message received:", event.data);
    if (event.data === "ping") {
      socket.send(`pong`);
    }
  });
  return response;
})
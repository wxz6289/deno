// WebSocket 客户端 - 连接到 deno-websockets.ts 服务器
const WEBSOCKET_URL = "ws://localhost:8000";

try {
  console.log(`正在连接到 WebSocket 服务器: ${WEBSOCKET_URL}`);

  const socket = new WebSocket(WEBSOCKET_URL);

  // 连接打开事件
  socket.addEventListener("open", () => {
    console.log("✅ 已成功连接到 WebSocket 服务器");

    // 发送初始消息
    socket.send("Hello Server!");
    console.log("📤 发送消息: Hello Server!");

    // 发送 ping 消息测试服务器响应
    setTimeout(() => {
      socket.send("ping");
      console.log("📤 发送消息: ping");
    }, 1000);

    // 发送更多测试消息
    setTimeout(() => {
      socket.send("这是一条中文消息");
      console.log("📤 发送消息: 这是一条中文消息");
    }, 2000);

    // 发送 JSON 数据
    setTimeout(() => {
      const jsonData = JSON.stringify({
        type: "test",
        message: "JSON 数据测试",
        timestamp: new Date().toISOString()
      });
      socket.send(jsonData);
      console.log("📤 发送 JSON 数据:", jsonData);
    }, 3000);
  });

  // 接收消息事件
  socket.addEventListener("message", (event) => {
    console.log("📥 收到服务器消息:", event.data);
  });

  // 连接关闭事件
  socket.addEventListener("close", (event) => {
    console.log("❌ WebSocket 连接已关闭");
    console.log("关闭代码:", event.code);
    console.log("关闭原因:", event.reason);
  });

  // 错误事件
  socket.addEventListener("error", (event) => {
    console.error("💥 WebSocket 连接发生错误:", event);
  });

  // 程序退出时关闭连接
  addEventListener("beforeunload", () => {
    socket.close();
  });

  // 在 Deno 中监听进程信号
  if (Deno.build.os !== "windows") {
    Deno.addSignalListener("SIGINT", () => {
      console.log("\n🔄 正在关闭 WebSocket 连接...");
      socket.close();
      Deno.exit(0);
    });
  }

  // 保持程序运行
  console.log("客户端正在运行，按 Ctrl+C 退出...");

  // 定期发送心跳消息
  const heartbeatInterval = setInterval(() => {
    if (socket.readyState === WebSocket.OPEN) {
      socket.send("heartbeat");
      console.log("💓 发送心跳消息");
    } else {
      clearInterval(heartbeatInterval);
    }
  }, 10000); // 每10秒发送一次心跳

} catch (error) {
  console.error("❌ 创建 WebSocket 连接时发生错误:", error);
}
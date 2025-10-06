// 交互式 WebSocket 客户端
const WS_URL = "ws://localhost:8000";

async function createInteractiveClient() {
  const socket = new WebSocket(WS_URL);

  socket.addEventListener("open", () => {
    console.log("🎉 连接成功! 你现在可以发送消息了。");
    console.log("输入消息并按回车发送，输入 'quit' 退出");
  });

  socket.addEventListener("message", (event) => {
    console.log(`📥 服务器回复: ${event.data}`);
    console.log("输入下一条消息: ");
  });

  socket.addEventListener("close", () => {
    console.log("🔌 连接已断开");
    Deno.exit(0);
  });

  socket.addEventListener("error", (error) => {
    console.error("❌ 连接错误:", error);
  });

  // 等待连接建立
  await new Promise((resolve) => {
    socket.addEventListener("open", resolve);
  });

  // 读取用户输入
  const decoder = new TextDecoder();
  const buffer = new Uint8Array(1024);

  console.log("请输入消息 (输入 'quit' 退出): ");

  while (true) {
    // 读取标准输入
    const bytesRead = await Deno.stdin.read(buffer);
    if (bytesRead === null) break;

    const input = decoder.decode(buffer.subarray(0, bytesRead)).trim();

    if (input.toLowerCase() === 'quit') {
      console.log("👋 正在退出...");
      socket.close();
      break;
    }

    if (input && socket.readyState === WebSocket.OPEN) {
      socket.send(input);
      console.log(`📤 已发送: ${input}`);
    }
  }
}

// 启动交互式客户端
async function main() {
  try {
    await createInteractiveClient();
  } catch (error) {
    console.error("❌ 客户端运行错误:", error);
  }
}

// 运行主函数
main();

export { };
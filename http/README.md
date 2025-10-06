# WebSocket 客户端使用指南

这里提供了三个不同的 WebSocket 客户端来连接 `deno-websockets.ts` 服务器。

## 🚀 启动服务器

首先，启动 WebSocket 服务器：

```bash
deno run --allow-net http/deno-websockets.ts
```

服务器将在 `http://localhost:8000` 启动。

## 📱 客户端选项

### 1. 简单客户端 (simple-client.ts)
最基础的客户端，连接后发送一个 "ping" 消息。

```bash
deno run --allow-net http/simple-client.ts
```

### 2. 功能完整的客户端 (websocket-client.ts)
包含完整的事件处理、心跳机制和多种消息类型。

```bash
deno run --allow-net http/websocket-client.ts
```

### 3. 交互式客户端 (interactive-client.ts)
允许用户输入消息并实时发送到服务器。

```bash
deno run --allow-net --allow-read http/interactive-client.ts
```

## 🧪 测试流程

1. **启动服务器**：
   ```bash
   # 终端 1
   deno run --allow-net http/deno-websockets.ts
   ```

2. **运行客户端**：
   ```bash
   # 终端 2
   deno run --allow-net http/websocket-client.ts
   ```

3. **观察输出**：
   - 服务器终端会显示客户端连接和收到的消息
   - 客户端终端会显示连接状态和服务器响应

## 📝 预期输出

### 服务器端输出：
```
Listening on http://localhost:8000/
a client connected
message received: Hello Server!
message received: ping
message received: 这是一条中文消息
message received: {"type":"test","message":"JSON 数据测试","timestamp":"2025-10-03T..."}
message received: heartbeat
```

### 客户端输出：
```
✅ 已成功连接到 WebSocket 服务器
📤 发送消息: Hello Server!
📤 发送消息: ping
📥 收到服务器消息: pong
📤 发送消息: 这是一条中文消息
📤 发送 JSON 数据: {"type":"test",...}
💓 发送心跳消息
```

## 🔧 功能特性

- ✅ 自动连接重试
- ✅ 心跳机制
- ✅ 优雅关闭
- ✅ 错误处理
- ✅ 中文消息支持
- ✅ JSON 数据传输
- ✅ 交互式输入
- ✅ 信号处理 (Ctrl+C)

## 📋 注意事项

1. 确保服务器先启动
2. 如果连接失败，检查端口 8000 是否被占用
3. 交互式客户端需要 `--allow-read` 权限读取标准输入
4. 按 Ctrl+C 可以优雅地关闭客户端连接
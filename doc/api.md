# Deno API 学习路线

> 基于 [Deno 全局命名空间 API 文档](https://docs.deno.com/api/deno/) 整理。  
> **原则**：优先掌握 Web 标准 API（`fetch`、`Request`/`Response`、`WebSocket` 等），`Deno.*` 仅补充运行时特有能力。

---

## 学习路线总览

```
阶段 0  Web 标准 API（fetch / Request / Response / URL / Streams）
  │
阶段 1  HTTP 服务 ──► 文件系统 ──► 运行时信息 ──► 权限
  │
阶段 2  测试 ──► 子进程 ──► WebSocket ──► 错误处理
  │
阶段 3  网络底层 ──► Fetch 扩展 ──► 文件监听 / I/O
  │
阶段 4  KV / Cron ──► 可观测性 ──► 基准测试
  │
阶段 5  FFI / Bundle / GPU / Jupyter / Linter（按需）
```

| 优先级 | 分类 | 典型场景 | 文档 |
|--------|------|----------|------|
| ★★★ | HTTP Server | Web 服务、API | [http-server](https://docs.deno.com/api/deno/http-server/) |
| ★★★ | File System | 读写配置、静态资源 | [file-system](https://docs.deno.com/api/deno/file-system/) |
| ★★★ | Runtime | 环境变量、进程信息、信号 | [runtime](https://docs.deno.com/api/deno/runtime/) |
| ★★★ | Permissions | 权限查询、降级 | [permissions](https://docs.deno.com/api/deno/permissions/) |
| ★★★ | Testing | 单元测试 | [testing](https://docs.deno.com/api/deno/testing/) |
| ★★☆ | Subprocess | 调用外部命令 | [subprocess](https://docs.deno.com/api/deno/subprocess/) |
| ★★☆ | WebSockets | 实时通信 | [websockets](https://docs.deno.com/api/deno/websockets/) |
| ★★☆ | Errors | 权限/IO 异常 | [errors](https://docs.deno.com/api/deno/errors/) |
| ★★☆ | Network | 自定义 TCP/TLS | [network](https://docs.deno.com/api/deno/network/) |
| ★★☆ | Fetch | 自定义 CA / 代理 | [fetch](https://docs.deno.com/api/deno/fetch/) |
| ★★☆ | I/O | stdin/stdout、调试输出 | [io](https://docs.deno.com/api/deno/io/) |
| ★☆☆ | Cloud | KV 存储、定时任务 | [cloud](https://docs.deno.com/api/deno/cloud/) |
| ★☆☆ | Telemetry | OpenTelemetry | [telemetry](https://docs.deno.com/api/deno/telemetry/) |
| ★☆☆ | Bundle | 打包分发 | [bundle](https://docs.deno.com/api/deno/bundle/) |
| ☆☆☆ | FFI / GPU / Jupyter / Linter | 原生库、桌面、笔记本、lint 插件 | 按需查阅 |

本地速查：`deno doc Deno.serve` 或 `deno doc jsr:@std/http`

---

## 阶段 0：Web 标准 API（前置基础）

Deno 完整实现 Web 平台 API，**写 HTTP 客户端/服务端应优先使用这些**，而非 `Deno.*` 网络 API。

```ts
// 客户端：与浏览器相同
const res = await fetch("https://api.example.com/data", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ id: 1 }),
});
const data = await res.json();

// 路由匹配（内置，无需框架）
const pattern = new URLPattern({ pathname: "/users/:id" });
const match = pattern.exec(req.url);
```

**最佳实践**

- 服务端用 `Deno.serve` + `Request`/`Response`，不写 Node `http` 模块（除非迁移遗留代码）
- 流式响应用 `ReadableStream`，大文件用 `res.body` 管道而非一次性读入内存
- 需要 Deno 特有 TLS/代理能力时，才用 `Deno.createHttpClient`（见阶段 3）

---

## 阶段 1：核心 API

### 1.1 HTTP Server — `Deno.serve`

[文档](https://docs.deno.com/api/deno/~/Deno.serve) · 权限：`--allow-net`

```ts
// 最小服务器
Deno.serve((_req) => new Response("Hello"));

// 生产常用模式
const server = Deno.serve({ port: 8000 }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/api/health") {
    return Response.json({ ok: true });
  }

  if (req.method === "POST" && url.pathname === "/api/items") {
    const body = await req.json();
    return Response.json({ created: body }, { status: 201 });
  }

  return new Response("Not Found", { status: 404 });
});

// 优雅关闭
Deno.addSignalListener("SIGINT", async () => {
  await server.shutdown();
  Deno.exit(0);
});
```

**`deno serve` 模式**（适合 Deploy / 无框架部署）：

```ts
export default {
  fetch(req: Request) {
    return new Response(`User-Agent: ${req.headers.get("user-agent")}`);
  },
} satisfies Deno.ServeDefaultExport;
```

```sh
deno serve --allow-net server.ts
```

| API | 用途 |
|-----|------|
| `Deno.serve(handler)` | 默认 `0.0.0.0:8000` |
| `Deno.serve({ port, hostname, cert, key, signal }, handler)` | 自定义监听 / HTTPS / AbortSignal |
| `server.shutdown()` | 停止接受新连接，等待进行中请求完成 |
| `server.addr` | 实际监听地址 |
| `onError` 选项 | 统一处理 handler 抛出的错误 |

**最佳实践**

- handler 内用 `URL` + `URLPattern` 做路由，复杂场景用 Hono / Oak
- 读取 `req.body` 时处理客户端断开（`req.text()` 可能抛错）
- 流式响应必须在 `cancel` 中清理定时器/资源，避免内存泄漏
- Windows 开发时向用户展示 `localhost` 而非 `0.0.0.0`

---

### 1.2 File System — 文件读写

[文档](https://docs.deno.com/api/deno/file-system/) · 权限：`--allow-read` / `--allow-write`

```ts
// 读写文本（最常用）
const config = await Deno.readTextFile("./config.json");
await Deno.writeTextFile("./output.log", "line\n", { append: true });

// 读写二进制
const bytes = await Deno.readFile("./image.png");
await Deno.writeFile("./copy.png", bytes);

// 目录遍历
for await (const entry of Deno.readDir("./src")) {
  if (entry.isFile) console.log(entry.name);
}

// 文件信息
const info = await Deno.stat("./data.db");
console.log(info.size, info.mtime);

// 自动关闭文件句柄（推荐）
using file = await Deno.open("./large.bin", { read: true });
const buf = new Uint8Array(4096);
await file.read(buf);
```

| 高频 API | 说明 |
|----------|------|
| `readTextFile` / `writeTextFile` | UTF-8 文本 |
| `readFile` / `writeFile` | `Uint8Array` 二进制 |
| `readDir` | 异步迭代目录项 |
| `stat` / `lstat` | 文件元信息（`lstat` 不跟随符号链接） |
| `mkdir` / `remove` / `rename` / `copyFile` | 目录与文件管理 |
| `makeTempFile` / `makeTempDir` | 临时文件/目录 |
| `watchFs` | 监听文件系统变更 |
| `Deno.open` + `using` | 流式读写大文件 |

**最佳实践**

- 优先 `readTextFile`/`writeTextFile`，二进制用 `readFile`/`writeFile`
- 大文件用 `Deno.open` 分块读，避免一次性加载
- `using` 关键字确保 `FsFile` 自动关闭
- 路径尽量相对 `import.meta.dirname` 解析，避免硬编码 CWD

```ts
const configPath = new URL("./config.json", import.meta.url);
const config = await Deno.readTextFile(configPath);
```

---

### 1.3 Runtime — 进程与环境

[文档](https://docs.deno.com/api/deno/runtime/)

```ts
// 命令行参数（deno run app.ts -- --port 3000）
const port = Deno.args[0] ?? "8000";

// 环境变量（需 --allow-env 或 --env-file）
const apiKey = Deno.env.get("API_KEY");
if (!apiKey) throw new Error("API_KEY is required");
Deno.env.set("RUNTIME", "deno");

// 进程信息
console.log(Deno.pid, Deno.cwd(), Deno.mainModule);
console.log(Deno.version.deno); // 运行时版本

// 平台信息（仅用于日志，勿做分支逻辑）
console.log(Deno.build.os, Deno.build.arch);

// 信号处理（优雅退出）
Deno.addSignalListener("SIGTERM", () => {
  console.log("shutting down...");
  Deno.exit(0);
});
```

| 变量 / API | 说明 |
|------------|------|
| `Deno.args` | CLI 传入参数（`--` 之后） |
| `Deno.env` | `get` / `set` / `has` / `delete` / `toObject` |
| `Deno.cwd` / `Deno.chdir` | 工作目录 |
| `Deno.execPath` | 当前 `deno` 可执行文件路径 |
| `Deno.mainModule` | 入口模块 URL |
| `Deno.pid` / `Deno.ppid` | 进程 ID |
| `Deno.exit` / `Deno.exitCode` | 退出 |
| `Deno.memoryUsage` | 堆内存统计 |
| `Deno.hostname` / `Deno.loadavg` | 需 `--allow-sys` |

**最佳实践**

- 配置优先环境变量；本地开发用 `deno run --env-file=.env`
- 结构化 CLI 参数用 `@std/cli/parse-args`，不要手写 `Deno.args` 解析
- `Deno.build` / `Deno.version` 仅用于日志，功能检测用 `try/catch` 或 feature flag

---

### 1.4 Permissions — 权限管理

[文档](https://docs.deno.com/api/deno/~/Deno.permissions)

```ts
// 查询权限状态
const status = await Deno.permissions.query({ name: "read", path: "./data" });
if (status.state !== "granted") {
  console.error("需要读权限：deno run --allow-read=./data");
  Deno.exit(1);
}

// 运行时请求（TTY 下可交互授权）
const net = await Deno.permissions.request({ name: "net", host: "api.example.com" });

// 启动后降级权限（缩小攻击面）
const secret = await Deno.readTextFile("./secret.txt");
await Deno.permissions.revoke({ name: "read" });

// 捕获权限拒绝
try {
  await Deno.readTextFile("/etc/hosts");
} catch (err) {
  if (err instanceof Deno.errors.NotCapable) {
    console.error("缺少 --allow-read");
  }
  throw err;
}
```

**最佳实践**

- 生产用 CLI flag 精确授权：`--allow-net=api.example.com --allow-read=./data`
- 读完敏感文件后立即 `revoke`，避免依赖链滥用
- 库代码应明确文档所需权限，并优雅处理 `NotCapable`
- `--allow-run` / `--allow-ffi` 等同放开沙箱，极度谨慎

---

## 阶段 2：常用扩展

### 2.1 Testing — `Deno.test`

[文档](https://docs.deno.com/api/deno/~/Deno.test)

```ts
import { assertEquals } from "@std/assert";

Deno.test("同步测试", () => {
  assertEquals(1 + 1, 2);
});

Deno.test("异步测试", async () => {
  const res = await fetch("https://example.com");
  assertEquals(res.status, 200);
});

// 测试步骤
Deno.test("多步骤", async (t) => {
  await t.step("setup", () => { /* ... */ });
  await t.step("action", async () => { /* ... */ });
});

// 钩子
Deno.test.beforeAll(() => { /* 初始化 DB */ });
Deno.test.afterAll(() => { /* 清理 */ });

// 权限隔离：仅可拒绝，不能授予
Deno.test({
  name: "无读权限时的降级",
  permissions: { read: false },
  fn() { /* 测试 fallback 逻辑 */ },
});
```

| API | 说明 |
|-----|------|
| `Deno.test(name, fn)` | 注册测试 |
| `Deno.test({ name, fn, permissions, timeout, ... })` | 完整配置 |
| `Deno.test.beforeAll/Each/afterAll/Each` | 钩子 |
| `t.step(name, fn)` | 子步骤 |
| `Deno.test.ignore` / `.only` | 跳过 / 仅运行 |
| `Deno.bench` | 基准测试（`deno bench`） |

**最佳实践**

- 断言用 `@std/assert` 或 `@std/expect`，与 `deno test` 默认类型检查配合
- 需要读文件的测试在命令行授 `--allow-read=.`；测试内 `permissions` 只用于模拟拒绝
- 异步测试设置 `timeout` 防止挂起；CI 加 `--fail-fast`

---

### 2.2 Subprocess — `Deno.Command`

[文档](https://docs.deno.com/api/deno/~/Deno.Command) · 权限：`--allow-run`

```ts
// 一次性执行，收集输出（最常用）
const { code, success, stdout, stderr } = await new Deno.Command("git", {
  args: ["rev-parse", "HEAD"],
  cwd: "./repo",
  stdout: "piped",
  stderr: "piped",
}).output();

if (!success) {
  console.error(new TextDecoder().decode(stderr));
  Deno.exit(code);
}
console.log(new TextDecoder().decode(stdout).trim());

// 流式子进程
const child = new Deno.Command("deno", {
  args: ["run", "worker.ts"],
  stdin: "piped",
  stdout: "piped",
}).spawn();

await child.stdin.getWriter().write(new TextEncoder().encode("ping\n"));
child.stdin.close();
console.log(await child.stdout.text());
const status = await child.status;
```

| API | 说明 |
|-----|------|
| `new Deno.Command(cmd, options)` | 构建器 |
| `.output()` / `.outputSync()` | 等待结束，返回 stdout/stderr |
| `.spawn()` | 返回 `ChildProcess`，可流式交互 |
| `child.stdout.text()` | 读取子进程输出 |
| `Deno.kill(pid, signal)` | 向进程发信号 |

**最佳实践**

- 优先 `Deno.Command`（稳定）；`Deno.spawn` 为 unstable API
- `--allow-run=git` 限定可执行文件，**禁止** `--allow-run=deno`（可逃逸沙箱）
- `output()` 会缓冲全部输出，大输出用 `spawn()` 流式处理
- `clearEnv: true` + `env: { ... }` 可构建干净子进程环境

---

### 2.3 WebSockets — `Deno.upgradeWebSocket`

[文档](https://docs.deno.com/api/deno/~/Deno.upgradeWebSocket)

```ts
Deno.serve((req) => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 426 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.addEventListener("open", () => console.log("connected"));
  socket.addEventListener("message", (e) => {
    if (e.data === "ping") socket.send("pong");
  });
  socket.addEventListener("close", () => console.log("closed"));

  return response; // 必须返回此 Response 完成升级
});
```

客户端仍用标准 `WebSocket`：

```ts
const ws = new WebSocket("ws://localhost:8000");
ws.onopen = () => ws.send("ping");
ws.onmessage = (e) => console.log(e.data);
```

**最佳实践**

- 升级前不要读取 `req.body`，否则升级失败
- 设置 `idleTimeout` 检测死连接；生产环境配合心跳 `ping/pong`
- 服务端 WebSocket 目前仅 HTTP/1.1

---

### 2.4 Errors — `Deno.errors`

[文档](https://docs.deno.com/api/deno/errors/)

```ts
import { assertRejects } from "@std/assert";

// 权限错误
Deno.errors.NotCapable       // 缺少 Deno 权限
Deno.errors.PermissionDenied // OS 级拒绝

// 文件系统
Deno.errors.NotFound
Deno.errors.AlreadyExists
Deno.errors.IsADirectory

// 网络
Deno.errors.ConnectionRefused
Deno.errors.ConnectionReset
Deno.errors.TimedOut

// 用法
await assertRejects(
  () => Deno.readTextFile("/nonexistent"),
  Deno.errors.NotFound,
);
```

**最佳实践**

- 用 `instanceof Deno.errors.*` 区分错误类型，提供可操作的错误信息
- 权限错误提示用户重新运行并附加正确 flag
- 不要吞掉 `NotCapable`，应在设计层解决权限配置

---

## 阶段 3：进阶 API

### 3.1 Network — 底层 TCP/TLS

[文档](https://docs.deno.com/api/deno/network/) · 权限：`--allow-net`

仅在 `Deno.serve` 无法满足时使用（自定义协议、非 HTTP 服务）。

```ts
// TCP 监听
const listener = Deno.listen({ port: 9000 });
for await (const conn of listener) {
  const buf = new Uint8Array(1024);
  const n = await conn.read(buf);
  await conn.write(buf.subarray(0, n!));
  conn.close();
}

// TLS 连接
const conn = await Deno.connectTls({
  hostname: "example.com",
  port: 443,
});

// DNS 解析
const ips = await Deno.resolveDns("example.com", "A");
```

| API | 说明 |
|-----|------|
| `Deno.listen` / `Deno.connect` | TCP / Unix socket |
| `Deno.listenTls` / `Deno.connectTls` | TLS |
| `Deno.resolveDns` | DNS 查询 |
| `Deno.networkInterfaces` | 网卡信息（`--allow-sys`） |
| `Deno.connectQuic` | QUIC（实验性） |

---

### 3.2 Fetch 扩展 — `Deno.createHttpClient`

[文档](https://docs.deno.com/api/deno/~/Deno.createHttpClient)

```ts
// 自定义 CA 证书
const caCert = await Deno.readTextFile("./corp-ca.pem");
const client = Deno.createHttpClient({ caCerts: [caCert] });
const res = await fetch("https://internal.api.local/data", { client });
client.close();

// HTTP 代理
const proxyClient = Deno.createHttpClient({
  proxy: { url: "http://127.0.0.1:8080" },
});
```

**最佳实践**

- 用完调用 `client.close()` 释放资源
- 普通 HTTPS 请求直接用全局 `fetch`，无需自定义 client

---

### 3.3 I/O 与调试

[文档](https://docs.deno.com/api/deno/io/)

```ts
// 标准流
await Deno.stdout.write(new TextEncoder().encode("hello\n"));
const input = new TextDecoder().decode(await Deno.stdin.read(new Uint8Array(1024)));

// 调试输出（类 console.log 格式）
console.log(Deno.inspect({ nested: { a: 1 } }, { depth: 2, colors: true }));

// 终端尺寸
const { columns, rows } = Deno.consoleSize();
```

---

### 3.4 文件监听 — `Deno.watchFs`

```ts
const watcher = Deno.watchFs("./src");
for await (const event of watcher) {
  console.log(event.kind, event.paths); // "modify" | "create" | "delete" ...
}
watcher.close();
```

适合 `--watch` 之外的自定义热重载逻辑；开发服务器优先 `deno run --watch`。

---

## 阶段 4：平台与运维

### 4.1 Cloud — KV 与 Cron

[文档](https://docs.deno.com/api/deno/cloud/) · 主要用于 Deno Deploy

```ts
// KV 键值存储
const kv = await Deno.openKv();
await kv.set(["users", "alice"], { name: "Alice", score: 100 });
const entry = await kv.get(["users", "alice"]);
console.log(entry.value); // { name: "Alice", score: 100 }

// 原子操作
const atomic = kv.atomic()
  .check({ key: ["counter"], versionstamp: null })
  .sum(["counter"], 1n);
await atomic.commit();

// 定时任务（Deploy 环境）
Deno.cron("每 5 分钟同步", { minute: { every: 5 } }, async () => {
  await syncData();
});
```

| API | 说明 |
|-----|------|
| `Deno.openKv(path?)` | 打开 KV（本地或远程） |
| `kv.get/set/delete/list` | CRUD |
| `kv.atomic()` | 事务性原子操作 |
| `kv.listenQueue` / `enqueue` | 消息队列 |
| `kv.watch` | 监听键变更 |
| `Deno.cron` | 定时任务 |

---

### 4.2 Telemetry — OpenTelemetry

[文档](https://docs.deno.com/api/deno/telemetry/)

```sh
OTEL_DENO=true deno run --allow-net main.ts
```

```ts
// 编程式访问（与 @opentelemetry/api 兼容）
const tracer = Deno.telemetry.tracerProvider.getTracer("my-app");
const meter = Deno.telemetry.meterProvider.getMeter("my-app");
```

自动采集 HTTP 请求追踪、运行时指标、console 日志。生产环境配合 OTLP exporter 使用。

---

### 4.3 基准测试 — `Deno.bench`

```ts
Deno.bench({
  name: "JSON parse",
  fn() {
    JSON.parse('{"a":1}');
  },
});
```

```sh
deno bench bench.ts
```

---

## 阶段 5：专项 API（按需）

### FFI — 调用原生库

[文档](https://docs.deno.com/api/deno/ffi/) · 权限：`--allow-ffi`（等同放开沙箱）

```ts
const lib = Deno.dlopen("./libfoo.so", {
  add: { parameters: ["i32", "i32"], result: "i32" },
} as const);
console.log(lib.symbols.add(1, 2));
lib.close();
```

### Bundle — 打包

[文档](https://docs.deno.com/api/deno/~/Deno.bundle)

```ts
const result = await Deno.bundle({
  entrypoints: ["./main.ts"],
  format: "esm",
});
```

CLI 等场景也可用 `deno compile` 生成独立可执行文件。

### GPU — WebGPU 扩展

[文档](https://docs.deno.com/api/deno/gpu/) · `Deno.webgpu.*` 补充 WebGPU 规范未覆盖的桌面集成能力。

### Jupyter — `Deno.jupyter.*`

[文档](https://docs.deno.com/api/deno/jupyter/) · 在 Jupyter 内核中展示 HTML/Markdown/图片。

### Linter — `Deno.lint.*`

[文档](https://docs.deno.com/api/deno/linter/) · 编写自定义 `deno lint` 插件（AST 访问）。

---

## 权限与 API 对照速查

| API 类别 | 所需权限 |
|----------|----------|
| `Deno.serve` / `fetch` | `--allow-net` |
| `readTextFile` / `readDir` / `stat` | `--allow-read[=path]` |
| `writeTextFile` / `mkdir` / `remove` | `--allow-write[=path]` |
| `Deno.env.*` | `--allow-env[=VAR]` |
| `Deno.Command` | `--allow-run[=cmd]` |
| `Deno.dlopen` | `--allow-ffi` |
| `Deno.hostname` / `networkInterfaces` | `--allow-sys` |
| `Deno.chdir` / `Deno.mainModule` | `--allow-read`（CWD） |
| 动态远程 `import()` | `--allow-import` 或 `--allow-net` |

在 `deno.json` 中声明默认权限：

```json
{
  "tasks": {
    "dev": "deno run --allow-net --allow-read=. --watch main.ts"
  }
}
```

---

## 综合示例：带最佳实践的 API 服务

```ts
// main.ts — 演示阶段 1~2 核心 API 的组合用法
import { assertEquals } from "@std/assert";

const PORT = Number(Deno.env.get("PORT") ?? "8000");

async function loadConfig(): Promise<Record<string, unknown>> {
  const path = new URL("./config.json", import.meta.url);
  try {
    return JSON.parse(await Deno.readTextFile(path));
  } catch (err) {
    if (err instanceof Deno.errors.NotFound) return {};
    throw err;
  }
}

const config = await loadConfig();

const server = Deno.serve({ port: PORT }, async (req) => {
  const url = new URL(req.url);

  if (url.pathname === "/api/health") {
    return Response.json({ ok: true, pid: Deno.pid });
  }

  if (url.pathname === "/api/run" && req.method === "POST") {
    const { code, stdout } = await new Deno.Command(Deno.execPath(), {
      args: ["eval", "console.log('hello')"],
      stdout: "piped",
    }).output();
    return Response.json({
      success: code === 0,
      output: new TextDecoder().decode(stdout).trim(),
    });
  }

  return new Response("Not Found", { status: 404 });
});

Deno.addSignalListener("SIGINT", async () => {
  await server.shutdown();
});

if (import.meta.main) {
  console.log(`Listening on http://localhost:${PORT}`);
}

// main_test.ts
Deno.test("health endpoint", async () => {
  const res = await fetch(`http://localhost:${PORT}/api/health`);
  assertEquals(res.status, 200);
});
```

---

## 与 `doc/deno.md` 的关系

| 文档 | 内容 |
|------|------|
| [deno.md](./deno.md) | Runtime 概念、工具链、配置、迁移 |
| **api.md**（本文） | `Deno.*` 命名空间 API 学习路线与代码 |

Web 标准 API 文档：[MDN Web APIs](https://developer.mozilla.org/en-US/docs/Web/API) · Deno 内置类型：`deno types`

---

*基于 [docs.deno.com/api/deno](https://docs.deno.com/api/deno/) 整理。API 稳定性以各符号文档页标注（stable / unstable）为准。*

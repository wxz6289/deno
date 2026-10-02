# Deno Runtime 学习文档

> 基于 [Deno 官方 Runtime 文档](https://docs.deno.com/runtime/) 整理，力求简洁、准确。

---

## 1. 概述

**Deno**（/ˈdiːnoʊ/）是开源的 JavaScript、TypeScript、WebAssembly 运行时，核心特点：

| 特性 | 说明 |
|------|------|
| TypeScript 优先 | 直接运行 `.ts`，无需 `tsc` 或构建步骤 |
| 安全默认 | 沙箱运行，文件/网络/环境变量等需显式授权 |
| 现代模块 | ES Modules + JSR 包注册表 + Workspace |
| 内置工具链 | `fmt` / `lint` / `test` / `check` / `bench` 等，无需额外 devDependencies |
| Node 兼容 | 支持 `package.json`、`npm:` 包、`node:` 内置模块 |

```sh
deno init my_project   # 脚手架：deno.json + main.ts + main_test.ts
deno -N main.ts        # 运行（-N = --allow-net）
deno test              # 测试
```

---

## 2. 安装与升级

```sh
# macOS / Linux
curl -fsSL https://deno.land/install.sh | sh

# Windows (PowerShell)
irm https://deno.land/install.ps1 | iex

deno --version
deno upgrade              # 升级 Deno 运行时本身（非项目依赖）
```

- 二进制默认路径：`~/.deno/bin/deno`（可用 `DENO_INSTALL` 覆盖）
- 缓存目录：`DENO_DIR`（默认 Linux `~/.cache/deno`，macOS `~/Library/Caches/deno`）
- 查看缓存：`deno info`

---

## 3. 项目配置

Deno 同时支持 **`deno.json`** 与 **`package.json`**，均可单独或组合使用。

### 3.1 职责划分

| 文件 | 用途 |
|------|------|
| `package.json` | npm 依赖、`scripts`（`deno task` 可运行） |
| `deno.json` / `deno.jsonc` | Deno 工具链配置：tasks、imports、fmt/lint、TS 选项、权限、lockfile |

```jsonc
// deno.json 最小示例
{
  "tasks": {
    "dev": "deno run --watch main.ts"
  },
  "imports": {
    "@std/assert": "jsr:@std/assert@^1"
  },
  "fmt": { "lineWidth": 100 }
}
```

- 自动向上查找 `deno.json`；可用 `--config` 指定
- Monorepo 根 `deno.json` 通过 `workspace` 字段管理子包

### 3.2 Workspace（Monorepo）

```json
{
  "workspace": ["./add", "./subtract"],
  "imports": { "chalk": "npm:chalk@5" }
}
```

子包 `deno.json` 需定义 `name`、`version`、`exports`，即可用裸说明符跨包引用（如 `@scope/add`）。支持通配符 `packages/*`、`**` 递归匹配。

---

## 4. TypeScript

### 4.1 执行 vs 类型检查（分离设计）

| 操作 | 命令 | 行为 |
|------|------|------|
| 执行 | `deno run main.ts` | 剥离类型后交给 V8，**不验证类型** |
| 类型检查 | `deno check` | 等同 `tsc --noEmit`，默认 strict |
| 执行前检查 | `deno run --check main.ts` | 有类型错误则拒绝运行 |
| 测试 | `deno test` | 默认类型检查（`--no-check` 可跳过） |

- 不生成 `dist/`；输出缓存在内部（`deno info` 可见）
- 需要 `.js` 文件时用 `deno transpile` 或 `deno pack`
- `compilerOptions` 写在 `deno.json`；也自动检测 `tsconfig.json` / `jsconfig.json`

### 4.2 与 Node/tsc 的关键差异

1. **导入必须带真实扩展名**：`import { x } from "./foo.ts"`（非 `./foo.js`）
2. **完整 TS 语法**：enum、namespace、参数属性等无需额外 flag
3. **emit 相关 tsconfig 选项被忽略**（`target`、`outDir`、`sourceMap` 等）

### 4.3 JavaScript 类型检查

- 文件顶部 `// @ts-check`
- 或 `compilerOptions.checkJs: true`
- 或 `deno check --check-js main.js`

---

## 5. 模块系统

### 5.1 ES Modules（推荐）

```ts
import { add } from "./calc.ts";           // 本地：必须含扩展名
import { assertEquals } from "@std/assert"; // 第三方：通过 import map
```

- **动态导入**：`const m = await import("./calc.ts")`
  - 字面量 specifier → 静态图，无需额外权限
  - 运行时计算 specifier → 需 `--allow-read`（本地）或 `--allow-import`（远程）
- **`import.meta`**：`url`、`main`、`filename`、`dirname`、`resolve()`
- **Import attributes**：`import data from "./x.json" with { type: "json" }`；还支持 `text`、`bytes`（实验性）
- **延迟求值**：`import defer * as m from "./heavy.ts"`（实验性，Stage 3）
- **Wasm**：`import { add } from "./add.wasm"`

### 5.2 第三方包来源（优先级）

1. **JSR**（`jsr:`）— 首选，内置类型，标准库在 `@std/*`
2. **npm**（`npm:`）— 无 JSR 替代时使用
3. **HTTPS URL** — 适合单文件脚本；应用推荐 JSR/npm

```sh
deno add jsr:@std/http    # 写入 deno.json imports
deno add express          # npm 包
deno install              # 安装全部依赖
```

`deno.json` 的 `imports` 是扩展版 import map，**无需**为每个包写尾随 `/` 条目。

### 5.3 CommonJS

- `.mjs` → ESM；`.cjs` → CJS
- `.js` / `.ts` 默认 ESM，除非 `package.json` 设 `"type": "commonjs"`
- `require()` 在 CJS 文件中可用，与 ESM 互操作

---

## 6. 依赖管理

### 6.1 常用命令

| 命令 | 作用 |
|------|------|
| `deno install` | 安装项目依赖 |
| `deno add` / `deno remove` | 增删依赖 |
| `deno outdated` / `deno update` | 查看/更新版本 |
| `deno why` | 解释依赖为何存在 |
| `deno info` | 依赖图与缓存信息 |
| `deno audit` | 漏洞扫描 |
| `deno ci` | 严格按 lockfile 安装（类 `npm ci`） |
| `deno publish` | 发布到 JSR |
| `deno pack` | 生成 npm 兼容 tarball |

### 6.2 版本与锁文件

- Semver：`^1.2.3`、`~1.2.3`、`>=1.2.3` 等
- `deno.lock` 记录精确版本与完整性哈希，**应提交到版本控制**
- CI：`deno ci`；离线：`--cached-only`；强制锁文件：`--frozen`
- 全局缓存：`DENO_DIR`；强制刷新：`--reload`

### 6.3 其他机制

- **vendor**：`"vendor": true` → 依赖缓存到 `vendor/` 目录
- **links**：本地覆盖依赖（类 `npm link`）
- **scopes**：覆盖 HTTPS 导入路径
- **生命周期脚本**：默认**不执行** `preinstall`/`postinstall`；需 `--allow-scripts` 或 `deno approve-scripts`
- **生产依赖**：`deno install --prod` 或 `--entrypoint` 只装实际用到的包

---

## 7. 权限与安全模型

### 7.1 核心原则

- 默认**无**文件读写、网络、环境变量、子进程访问
- 权限可**细粒度**授予，也可用 `--deny-*` 在宽泛授权中排除
- 同一线程内所有模块共享同一权限级别
- 静态模块图加载（`import`、字面量 `import()`）**不受**权限限制；运行时 I/O 才检查
- `-A` / `--allow-all` 关闭沙箱，等同 Node 安全级别

### 7.2 主要权限标志

| 权限 | 标志 | 说明 |
|------|------|------|
| 读文件 | `-R` / `--allow-read[=path]` | 可读指定路径 |
| 写文件 | `-W` / `--allow-write[=path]` | 可写指定路径 |
| 网络 | `-N` / `--allow-net[=host:port]` | 可访问网络 |
| 环境变量 | `-E` / `--allow-env[=VAR]` | 可读环境变量 |
| 子进程 | `--allow-run[=cmd]` | ⚠️ 子进程不受 Deno 沙箱约束 |
| FFI | `--allow-ffi` | ⚠️ 原生库可绕过 JS 层权限 |
| 导入 | `--allow-import` | 动态远程模块导入 |
| 系统信息 | `--allow-sys` | 主机名、系统调用等 |

- 终端交互时可弹窗授权；`--no-prompt` 禁用
- 拒绝时抛出 `Deno.errors.NotCapable`
- 运行时 API：`Deno.permissions.query` / `request` / `revoke`
- 可在 `deno.json` 的 `permissions` 字段声明默认权限

### 7.3 不可信代码建议

- 最小权限 + `--frozen` + `--cached-only`
- Web Worker 隔离 + 缩减权限集
- OS 级沙箱（seccomp、VM 等）

---

## 8. HTTP 服务器

### 8.1 `Deno.serve`（推荐）

```ts
Deno.serve({ port: 8000 }, (req) => {
  const url = new URL(req.url);
  return new Response(`Hello ${url.pathname}`);
});
```

```sh
deno run --allow-net server.ts
```

- 基于 Web 标准 `Request` / `Response`
- 自动 HTTP/1.1、HTTP/2；支持 HTTPS（传入 PEM `cert`/`key`）
- 自动 gzip/brotli 压缩（满足条件时）
- WebSocket：`Deno.upgradeWebSocket(req)`
- 优雅关闭：`const server = Deno.serve(...); await server.shutdown()`
- 路由：`URLPattern` 或 `@std/http` 的 `route`；静态文件用 `serveDir`

### 8.2 `deno serve`（导出 fetch）

```ts
export default {
  fetch(request) {
    return new Response("OK");
  },
} satisfies Deno.ServeDefaultExport;
```

```sh
deno serve server.ts
```

---

## 9. Node.js 兼容性

| 能力 | 状态 |
|------|------|
| `node:` 内置模块 | 几乎全部实现 |
| npm 包 | `npm:` 或 `package.json` |
| `process`、`setTimeout` 等全局 | 支持（`Buffer` 需 `import from "node:buffer"`） |
| `__dirname` / `__filename` | 用 `import.meta.dirname` / `import.meta.filename` |
| CommonJS | 支持 |
| `node_modules` | 可选（`nodeModulesDir`：`auto` / `manual` / `none`） |
| 原生插件 (N-API) | 需本地 `node_modules` + `--allow-ffi` |

```ts
import { createServer } from "node:http";
import * as emoji from "npm:node-emoji";
```

现有 Node 项目可直接 `deno install` + `deno task` 渐进迁移。

---

## 10. 测试

### 10.1 编写与运行

```ts
import { assertEquals } from "@std/assert";

Deno.test("add", () => {
  assertEquals(1 + 1, 2);
});

Deno.test({ name: "async", fn: async () => { /* ... */ } });
```

```sh
deno test                    # 自动发现 *test.ts 等
deno test --filter "my"      # 按名称过滤
deno test --allow-read=.     # 授予权限
deno test --coverage         # 覆盖率
```

- 同时支持 `Deno.test` 与 `node:test`
- 测试步骤：`t.step()`；钩子：`beforeAll` / `beforeEach` / `afterEach` / `afterAll`
- 每测试可设 `permissions`（仅**拒绝**，不能授予）
- 其他：`--fail-fast`、snapshot、`@std/testing/bdd`、`deno test --doc`（文档测试）

---

## 11. 内置工具链

### 11.1 代码质量

```sh
deno fmt              # 格式化
deno fmt --check      # CI：未格式化则失败
deno lint             # 静态检查
deno check            # 类型检查
```

### 11.2 执行类

| 命令 | 用途 |
|------|------|
| `deno run` | 运行脚本 |
| `deno serve` | 运行导出 `fetch` 的服务 |
| `deno task` | 运行 `deno.json` / `package.json` 中定义的 task |
| `deno eval` | 执行代码片段 |
| `deno repl` | 交互式 REPL |
| `deno bench` | 基准测试 |
| `deno compile` | 编译为独立可执行文件 |
| `deno x` | 运行 npm/JSR 包（类 `npx`） |

### 11.3 其他

```sh
deno doc jsr:@std/http   # 查看包文档
deno types               # 打印运行时类型
deno init / deno create  # 创建项目
```

---

## 12. 标准库（@std）

发布在 JSR，按功能拆分为独立包：

| 包 | 用途 |
|----|------|
| `@std/assert` | 断言（测试） |
| `@std/expect` | Jest 风格 expect |
| `@std/async` | delay、debounce、pool 等 |
| `@std/http` | HTTP 工具、文件服务器、路由 |
| `@std/path` | 路径处理 |
| `@std/fs` | 文件系统辅助 |
| `@std/encoding` | hex、base64 等编解码 |
| `@std/json` / `@std/yaml` / `@std/csv` | 数据格式 |
| `@std/testing` | snapshot、BDD、mock、FakeTime |
| `@std/cli` | CLI 交互工具 |

```sh
deno add jsr:@std/http
```

---

## 13. 调试与可观测性

```sh
deno run --inspect-brk main.ts   # 等待调试器，首行断点
deno run --inspect-wait main.ts  # 等待调试器连接后执行
deno run --log-level=debug main.ts
deno run --strace-ops main.ts    # 打印 Deno ops 时序
```

- 调试协议：V8 Inspector（Chrome DevTools `chrome://inspect`、VS Code Deno 扩展）
- Deno 2.8+：DevTools Network 面板可查看 `fetch`、`node:http`、`WebSocket` 流量
- Web Worker 自 2.7 起可独立调试
- OpenTelemetry：`OTEL_DENO=true deno run main.ts`
- CPU profiling：内置，可输出火焰图 / Markdown 报告

---

## 14. 常用 Deno API 速览

| API | 说明 |
|-----|------|
| `Deno.readTextFile` / `Deno.writeTextFile` | 文件读写（需权限） |
| `Deno.env.get` / `Deno.env.set` | 环境变量（需 `--allow-env`） |
| `Deno.serve` | HTTP 服务器 |
| `Deno.upgradeWebSocket` | WebSocket 升级 |
| `Deno.cwd` / `Deno.chdir` | 工作目录 |
| `Deno.Command` | 子进程（需 `--allow-run`） |
| `Deno.listen` / `Deno.connect` | 底层 TCP/Unix socket |
| `Deno.openKv` | Deno KV 键值存储 |
| `new Worker(url, { type: "module" })` | Web Worker |

同时完整实现 **Web 平台 API**：`fetch`、`Request`/`Response`、`URL`/`URLPattern`、`ReadableStream`、`crypto`、`WebSocket`、`structuredClone` 等。

---

## 15. 推荐学习路径

```
安装 → deno init → 运行 main.ts（理解权限）
  ├─ TypeScript（run vs check）
  ├─ 模块与依赖（JSR / npm / deno.json imports）
  ├─ HTTP 服务（Deno.serve）
  ├─ 测试（deno test + @std/assert）
  ├─ 工具链（fmt / lint / check）
  └─ 按需深入：Node 迁移 / Workspace / 编译部署 / 调试
```

### 官方文档入口

| 主题 | 链接 |
|------|------|
| 快速开始 | https://docs.deno.com/runtime/getting_started/ |
| 核心概念 | https://docs.deno.com/runtime/fundamentals/ |
| TypeScript | https://docs.deno.com/runtime/fundamentals/typescript/ |
| 模块 | https://docs.deno.com/runtime/fundamentals/modules/ |
| 依赖管理 | https://docs.deno.com/runtime/fundamentals/dependency_management/ |
| 安全与权限 | https://docs.deno.com/runtime/fundamentals/security/ |
| 配置 | https://docs.deno.com/runtime/fundamentals/configuration/ |
| HTTP 服务 | https://docs.deno.com/runtime/fundamentals/http_server/ |
| Node 兼容 | https://docs.deno.com/runtime/fundamentals/node/ |
| 测试 | https://docs.deno.com/runtime/fundamentals/testing/ |
| 标准库 | https://docs.deno.com/runtime/fundamentals/standard_library/ |
| CLI 参考 | https://docs.deno.com/runtime/reference/cli/ |
| 权限参考 | https://docs.deno.com/runtime/reference/permissions/ |
| API 文档 | https://docs.deno.com/api/deno/~/ |

---

*文档版本对应官方 Runtime 文档（2025–2026）。部分特性标记为 UNSTABLE / 实验性，以当前 `deno --version` 为准。*

# Fresh 项目说明（中文）

这是一个基于 Deno + Fresh + Preact 的轻量级 SSR 项目，采用 Islands 架构以尽量减少客户端 JS。

## 快速开始

1. 安装 Deno（推荐最新版）。
2. 在项目根目录启动开发流程：

```bash
deno task dev
```

开发模式会启动 Vite（前端热重载）并运行 Fresh 的开发流程，保存后会自动刷新。

## 常用任务

```bash
deno task dev     # 启动开发（Vite + Fresh dev）
deno task build   # 构建前端资源（vite）
deno task start   # 启动生产服务器（使用 _fresh/server.js）
deno task check   # 格式化/静态检查/类型检查
deno task update  # 更新 jsr 依赖（辅助脚本）
```

## 目录说明

- `routes/`：基于文件的页面与 API 路由（服务端渲染）。
- `islands/`：可交互的小组件（仅对需要的区域注入客户端脚本）。
- `components/`：共享 UI 组件。
- `static/`、`assets/`：静态资源与样式。

构建后会在 `_fresh` 目录生成运行时文件（包含 `_fresh/server.js`）。

## 构建与部署

构建并在本地运行生产包：

```bash
deno task build
deno task start
```

在其他平台部署时，确保 `_fresh` 输出和 `server.js` 可用，运行时需授权读取静态文件与监听网络。

## 健康检查

运行下列命令进行格式化、lint 和类型检查：

```bash
deno task check
```

若遇到导入解析错误，可尝试 `deno cache` 或检查 `deno.json` 中的 `imports` 配置。

## 开发建议

- 优先将交互逻辑放入 `islands/`，避免整页客户端化。
- 页面需要的数据尽量在服务端路由中获取，提升 SEO 与首屏速度。
- 复用的 UI 放在 `components/`。

## 常见问题与排查

- 客户端资源未更新：重新运行 `deno task build` 并重启服务器。
- 插件或 Vite 兼容问题：确认 `deno.json` 中 `imports` 指向的版本一致性。

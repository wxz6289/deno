# Fresh 快速参考（精简）

简短说明：Fresh 是基于 Deno 的轻量全栈框架，默认服务器端渲染（SSR），采用 islands 架构以最小化客户端 JavaScript。

---

## 核心概念

- Islands：仅对需要交互的组件在客户端水合，其余由服务器渲染，减少初始 JS。
- 文件路由：`routes/` 目录映射 URL，支持页面与 API 路由。
- 使用 Preact/JSX：组件基于 Preact，支持 TypeScript，运行在 Deno 环境。
- Edge 优先：适合在边缘平台（如 Deno Deploy）运行，依赖少、启动快。

---

## 快速开始（要点）

1. 初始化（示例）：

    ```bash
    deno run -A --unstable https://deno.land/x/fresh@latest/init.ts my-app
    cd my-app
    deno task start
    ```

2. 目录要点：
   - `routes/`：页面与 API（如 `routes/api/hello.ts`）
   - `islands/`：交互组件（会被部分水合）
   - `static/`：静态资源

---

## 常见示例

- 页面引用 island：

    ```tsx
    // routes/index.tsx
    import Counter from "../islands/Counter.tsx";
    export default function Home() {
      return (<main><h1>Hello</h1><Counter/></main>);
    }
    ```

- 简单 API 路由：

    ```ts
    // routes/api/time.ts
    export const handler = () => new Response(JSON.stringify({t: Date.now()}), {headers:{"Content-Type":"application/json"}});
    ```

---

## 优势与局限（简述）

- 优势：首屏快、客户端 JS 小、与 Deno 原生集成、适合边缘部署、TypeScript 开箱即用。
- 局限：生态比 Node/React 小、某些 npm 库需适配、对大量客户端交互项目可能需更多 islands 管理。

---

## 选型建议（何时选 Fresh）

- 选择 Fresh：需要极小客户端开销、边缘部署优先、希望直接用 Deno + TypeScript。
- 优先考虑其他框架（Next.js / SvelteKit / Astro）：项目依赖大型 React 生态、需要丰富插件或复杂客户端交互时。

---

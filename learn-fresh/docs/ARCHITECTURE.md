# Fresh 项目架构说明

本文档说明本项目使用的 Fresh 架构约定与常见开发模式，帮助你快速上手并扩展功能。

## 核心概念

- Fresh: Deno 原生的 SSR 框架，使用文件系统路由与 islands 架构减少客户端 JS。
- Islands: 仅在需要交互的页面部分注入客户端 JS（位于 `islands/`）。
- Routes: 文件放在 `routes/` 下自动成为页面或 API（例如 `routes/api/*.tsx`）。
- Components: 可复用的 UI 组件放在 `components/`，可被 routes 或 islands 使用。

## 文件夹约定

- `routes/` — 页面（`.tsx`）与 API（以 `api/` 子目录为常规）
- `islands/` — 小型交互组件，会被客户端 hydrate
- `components/` — 无状态或轻态组件（SSR 与客户端均可使用）
- `static/`, `assets/` — 静态资源和样式

## 示例：添加页面与 Island

1. 新页面：创建 `routes/about.tsx` 导出默认 page 组件。

```tsx
// routes/about.tsx
import { Head } from "fresh/runtime";

export default function About() {
  return (
    <div>
      <Head><title>About</title></Head>
      <h1>About</h1>
    </div>
  );
}
```

2. 添加 interactive Island：在 `islands/` 下创建 `LikeButton.tsx` 并在页面中导入并使用它。

```tsx
// islands/LikeButton.tsx
import { useState } from "preact/hooks";

export default function LikeButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>Like {count}</button>;
}
```

在页面中使用：

```tsx
import LikeButton from "../islands/LikeButton.tsx";

export default function Home() {
  return <div><LikeButton /></div>;
}
```

## 状态与中间件

项目使用 `utils.ts` 中的 `define` 来指定 `ctx.state` 类型并创建中间件与页面类型：

```ts
import { createDefine } from "fresh";
export interface State { shared: string }
export const define = createDefine<State>();
```

在 `main.ts` 中你可以注册中间件并访问 `ctx.state` 来共享数据。

## 性能提示

- 优先使用 islands 而不是整个页面的客户端化。
- 在可能情况下将数据获取放在服务器端（route 模块），减少客户端负担。

## 常见问题

- Q: 为什么我的 island 没有 hydrate？
  - A: 确认你导出的组件在 `islands/` 下并在页面中以默认导入使用，且构建没有错误。

---

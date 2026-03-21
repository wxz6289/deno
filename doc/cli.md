# Deno CLI 快速参考（精简）

---

## 一、日常开发（最常用）

- 运行脚本：

   ```bash
   deno run --allow-read main.ts
   ```

- 交互 / 快速执行：

   ```bash
   deno repl
   deno eval "console.log('hi')"
   ```

- 代码风格与静态检查：

   ```bash
   deno fmt
   deno lint
   deno check mod.ts
   ```

- 测试（单元测试）：

   ```bash
   deno test
   deno test --filter add
   deno test --watch
   ```

---

## 二、依赖与包管理（常用）

- 添加/移除依赖（更新 import_map 或 package 列表）：

   ```bash
   deno add jsr:@std/path
   deno add npm:react
   deno remove some_pkg
   ```

- 查看依赖信息：

   ```bash
   deno info
   ```

- 更新与检查过期：

   ```bash
   deno update
   deno outdated
   ```

---

## 三、构建 / 打包 / 发布（发布与运维）

- 打包为单文件：

   ```bash
   deno bundle mod.ts > bundle.js
   ```

- 编译为本地可执行文件：

   ```bash
   deno compile --unstable --allow-all -o myprog mod.ts
   ```

- 部署（Deno Deploy）：

   ```bash
   deno deploy --project=myproj script.ts
   deno deploy env add KEY VALUE
   ```

---

## 四、项目与任务（中高频）

- 初始化项目：

   ```bash
   deno init
   deno init --lib mylib
   ```

- 任务运行（package.json scripts 类似）：

   ```bash
   deno task build
   deno task --list
   ```

---

## 五、调试与性能（按需）

- 调试：

   ```bash
   deno run --inspect-brk --allow-net main.ts
   ```

- 基准测试：

   ```bash
   deno bench --filter fib
   ```

- 覆盖率：

   ```bash
   deno coverage cov_profile
   deno coverage --lcov --output=cov.lcov cov_profile
   ```

---

## 六、常用全局选项与权限（关键）

- 权限控制（推荐最小权限原则）：

  `--allow-read`, `--allow-write`, `--allow-net`, `--allow-env`, `--allow-run`, `-A`（允许全部）

- 类型检查与重载：

  `--check` / `--no-check`
  `--reload`（重新下载依赖）

- 输出与格式：

   `--output/-o`, `--json`, `--html`

---

## 七、常用示例（速查）

- 本地运行并允许网络与读取：

   ```bash
   deno run --allow-net --allow-read app.ts
   ```

- 开发时热重载（serve）：

   ```bash
   deno run --allow-net --allow-read --watch server.ts
   deno serve --watch --port=8080 server.ts
   ```

- 安装可执行脚本到本机：

   ```bash
   deno install -n mycmd --allow-net --allow-read mod.ts
   ```

---

## 八、快速参考与帮助

- 查看命令帮助：

   ```bash
   deno help
   deno help <subcommand>
   ```

---

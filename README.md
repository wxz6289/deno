# Deno

Deno是基于V8、Rust和Tokio建立的默认安全并致力于提升开发者体验的JavaScript/TypeScript/WebAssembly运行环境。

无需任何配置文件、依赖清单或者构建脚本。

## 特性

- 默认安全
- TypeScript开箱即用
- 单一执行命令
- 内置多种工具
- deno官方维护的标准模块
- 打包到单一文件

## 安装 Deno

```sh
curl -fsSL https://deno.land/install.sh | sh
```

环境配置 添加如下环境变量到`$HOME/.zshrc`

```sh
export DENO_INSTALL="/Users/dreamerking/.deno"
export PATH="$DENO_INSTALL/bin:$PATH"
```

```sh
# `-` 表示从标准输入中读取
cat main.ts | deno run -
cat ../test/dateTime.ts | deno run -
```

## 常用命令

```sh
# 升级到最新版本
deno upgrade
# 安装指定版本
deno upgrade --version 1.0.1

# 获取帮助信息
deno help
deno -h
deno help bundle
deno bundle -h

# 初始化项目
deno init project-name

# 执行脚本
deno run main.ts
cat main.ts | deno run -

# 格式化
deno fmt
deno fmt file1.ts file2.ts
deno fmt .

# 检查
deno lint
deno lint file1.ts file2.ts
deno lint src/
# 测试
deno test
```

注意: 选项在前,参数在后

### 常用选项

- 锁定文件
  适应子命令: cache、run、test、bundle、compile、doc
  --lock file 检查lock文件
  --lock-write 写lock文件

- 缓存和编译标记
  适用子命令: cache/run/test/bundle/doc/compile
  --config file 加载tsconfig.json
  --import-map file 导入map文件
  --no-remote 不解析远程模块
  --reload=<CACHE_BLOCKLIST> 重载源码缓存
  --unstable 启用不稳定API

- 运行时选项
  适用子命令:run/test
  - 权限选项
    -A, --allow-all 允许所有权限
    --allow-env 允许访问和设置环境变量
    --allow-hrtime 允许高精度时间
    --allow-net=<allow-net> 允许网路访问
    --allow-plugin 允许加载插件
    --allow-read=<allow-read>
    --allow-run
    --allow-write=<allow-write>

  - 其他
    --cached-only
    --inspect=<HOST:PORT>
    --inspect-brk=<HOST:PORT>
    --seed <NUMBER>  指定 Math.random() 的随机种子
    --v8-flags=<v8-flags>
    --no-check 禁用ts类型检查 import/export type

- watch 选项
适用子命令: run、test、fmt、bundle

```shell
deno run --watch --unstale test.ts
deno run --watch --watch-exclude=file1.ts,file2.ts main.ts
deno run --watch --watch-hmr main.ts # 启用HMR
```

类型检查

```zsh
deno check main.ts
deno run --check main.ts
```

代理设置 安装denon

```sh
set http_proxy http://host:port
deno install -qAf --unstable https://deno.land/x/denon@2.4.4/denon.ts
set PATH=%PATH%;C:\Users\Dreamer\.deno\bin
```

## 脚本参数

脚本名称后指定参数,而命令参数在脚本之前
Deno运行时选项参数在脚本名称之前

项目配置文件
deno.json/dene.jsonc
类似Node中的package.json 和 import map文件，不是必须的

## 兼容Node

- 通过`node:`前缀支持Node内置模块
- 使用 npm: 前缀可直接导入 npm 包，无需 npm install，Deno 会自动管理依赖缓存
- 支持通过 deno run npm:包名@版本 直接执行 npm 脚本（类似 npx）

## CommonJS模块的支持

- Deno 自动识别 CommonJS 包并兼容,其权限系统仍然有效。
- .cjs 文件会被视为 CommonJS 模块；若使用 .js，需在 package.json 中添加 "type": "commonjs"。
- 可通过 --unstable-detect-cjs 标志让 Deno 自动检测 CommonJS 模块（非默认行为）
- 在 ES 模块中可通过 import { createRequire } from "node:module" 手动创建 require 函数。

## 依赖管理模式

```jsonc
denon.json
{ "nodeModulesDir": "manual" }
```

- 默认模式（none）：Deno 使用全局缓存，不生成 node_modules，推荐新Deno项目使用。
- 自动模式（auto）：生成本地 node_modules，适用于依赖 node_modules 结构的框架（如 Next.js）。
- 手动模式（manual）：需手动运行 deno install 或 npm install 生成 node_modules，适用于传统 Node 项目。使用`package.json`管理的Node项目。
- 配置 .npmrc 指定私有源，通过 deno.json 或 package.json 导入私有包。
- 使用`--node-modules-dir`选项使用`node_modules`。

## 类型导入

- 使用`/// <reference types="npm:@types/node" />`

## 关键对象替代方案

- process：Deno 提供同名全局对象，建议显式导入 import process from "node:process"。
- Buffer：从 node:buffer 导入（如 import { Buffer } from "node:buffer"），推荐使用 Uint8Array代替。
- __filename/__dirname：替换为 import.meta.filename/import.meta.dirname。
- Deno 支持 esbuild、sqlite3 等使用 Node-API 的包，但需配置 nodeModulesDir 并手动处理生命周期脚本。

### Node-API addons

配置`deno.json`中`nodeModulesDir`值为:"auto"或"manual"在项目中生成`node_modules`目录。

## 执行npm命令

```zsh
deno run -A npm:cowsay@1.5.0/cowthink "Hello there"
```

## Deno CLI 命令详解

### 1. 运行脚本

- **`deno run`**
  用于运行 JavaScript 或 TypeScript 文件。

  ```bash
  deno run <file>
  ```

  **选项**：
  - `--allow-read`：允许读取文件系统。
  - `--allow-net`：允许网络访问。
  - `--allow-write`：允许写入文件系统。
  - `--allow-env`：允许访问环境变量。
  - `--allow-run`：允许运行子进程。
  - `--watch`：监视文件变化并重新运行。

  **示例**：

  ```bash
  deno run --allow-read script.ts
  ```

### 2. 测试

- **`deno test`**
  用于运行测试文件。

  ```bash
  deno test
  ```

  **选项**：
  - `--filter`：仅运行匹配的测试。
  - `--allow-net`：允许网络访问。
  - `--coverage`：生成代码覆盖率报告。

  **示例**：

  ```bash
  deno test --allow-net
  ```

### 3. 格式化代码

- **`deno fmt`**
  格式化代码文件。

  ```bash
  deno fmt [files...]
  ```

  **示例**：

  ```bash
  deno fmt main.ts
  ```

### 4. 检查代码

- **`deno lint`**
  检查代码中的潜在问题。

  ```bash
  deno lint [files...]
  ```

  **示例**：

  ```bash
  deno lint main.ts
  ```

### 5. 编译

- **`deno compile`**
  将脚本编译为可执行文件。

  ```bash
  deno compile [options] <file>
  ```

  **选项**：
  - `--output`：指定输出文件名。
  - `--allow-net`：允许网络访问。
  - `--allow-read`：允许读取文件系统。

  **示例**：

  ```bash
  deno compile --output my_app main.ts
  ```

### 6. 打包模块

- **`deno bundle`**
  将模块及其依赖打包为单个文件。

  ```bash
  deno bundle <source> <output>
  ```

  **示例**：

  ```bash
  deno bundle main.ts bundle.js
  ```

### 7. 权限检查

- **`deno permissions`**
  管理和检查权限。
  - `deno permissions query`：查询权限状态。
  - `deno permissions revoke`：撤销权限。

  **示例**：

  ```bash
  deno permissions query --allow-net
  ```

### 8. 运行基准测试

- **`deno bench`**
  用于运行基准测试。

  ```bash
  deno bench
  ```

  **选项**：
  - `--filter`：仅运行匹配的基准测试。

  **示例**：

  ```bash
  deno bench --filter="http"
  ```

### 9. 模块缓存

- **`deno cache`**
  缓存依赖模块。

  ```bash
  deno cache <file>
  ```

  **示例**：

  ```bash
  deno cache deps.ts
  ```

### 10. 文档生成

- **`deno doc`**
  查看模块的文档。

  ```bash
  deno doc [file]
  ```

  **示例**：

  ```bash
  deno doc main.ts
  ```

### 11. 信息查看

- **`deno info`**
  查看模块依赖信息。

  ```bash
  deno info [file]
  ```

  **示例**：

  ```bash
  deno info main.ts
  ```

### 12. 升级 Deno

- **`deno upgrade`**
  升级到最新版本的 Deno。

  ```bash
  deno upgrade
  ```

  **选项**：
  - `--version`：指定版本。
  - `--output`：指定输出路径。

  **示例**：

  ```bash
  deno upgrade --version 1.36.0
  ```

### 13. REPL 模式

- **`deno repl`**
  启动交互式 REPL 环境。

  ```bash
  deno repl
  ```

### 14. 权限运行

- **`deno task`**
  运行在 `deno.json` 中定义的任务。

  ```bash
  deno task <task_name>
  ```

  **示例**：

  ```bash
  deno task start
  ```

### 15. 锁文件

- **`deno lock`**
  管理依赖锁文件。
  - `--lock`：指定锁文件。
  - `--lock-write`：更新锁文件。

  **示例**：

  ```bash
  deno run --lock=deno.lock --lock-write main.ts
  ```

### 总结

Deno CLI 提供了丰富的命令行工具，涵盖了从开发、测试到部署的全流程。通过合理使用这些命令，可以大大提高开发效率并确保代码质量。

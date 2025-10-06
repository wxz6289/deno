# Node-API 构建问题解决方案

## 🚫 构建问题

在 macOS 上构建 Node-API 模块时遇到了以下问题：

1. **malloc.h 文件不存在** - 已修复，改用 `stdlib.h`
2. **node-gyp 构建复杂性** - Node-API 模块构建需要复杂的工具链

## 🛠️ 修复的问题

### 1. 头文件问题

```cpp
// 错误的写法 (在 macOS 上不工作)
#include <malloc.h>

// 正确的写法 (跨平台兼容)
#include <stdlib.h>
#include <stdio.h>
```

### 2. binding.gyp 配置

```json
{
  "targets": [
    {
      "target_name": "napi_addon",
      "sources": ["napi_addon.cpp"],
      "xcode_settings": {
        "GCC_ENABLE_CPP_EXCEPTIONS": "YES",
        "CLANG_CXX_LIBRARY": "libc++",
        "MACOSX_DEPLOYMENT_TARGET": "10.9"
      }
    }
  ]
}
```

## 🔧 手动构建步骤

如果要继续尝试构建 Node-API 模块：

### 前置要求

1. **安装 Xcode Command Line Tools**:
   ```bash
   xcode-select --install
   ```

2. **安装 Python** (node-gyp 需要):
   ```bash
   brew install python
   ```

3. **安装 node-gyp**:
   ```bash
   npm install -g node-gyp
   ```

### 构建命令

```bash
# 清理之前的构建
rm -rf build node_modules package-lock.json

# 安装依赖
npm install

# 配置构建
node-gyp configure

# 编译
node-gyp build
```

## 🎯 推荐的替代方案

由于 Node-API 构建的复杂性，推荐使用以下替代方案：

### 1. 纯 Deno FFI

```typescript
// 使用预编译的 C 共享库
const library = Deno.dlopen("./mylibrary.so", {
  add: { parameters: ["i32", "i32"], result: "i32" }
});

const result = library.symbols.add(10, 20);
```

### 2. WebAssembly (WASM)

```typescript
// 使用 WebAssembly 模块
const wasmModule = await WebAssembly.instantiateStreaming(
  fetch("./module.wasm")
);

const result = wasmModule.instance.exports.add(10, 20);
```

### 3. Rust + wasm-pack

```bash
# 使用 Rust 编译为 WASM
wasm-pack build --target web

# 在 Deno 中使用
import init, { add } from "./pkg/module.js";
await init();
const result = add(10, 20);
```

## 📝 总结

- **Node-API 构建复杂**: 需要复杂的工具链和配置
- **平台兼容性问题**: 不同操作系统需要不同的配置
- **替代方案更简单**: FFI、WASM 等方案更容易实现和维护

## 🚀 运行模拟示例

如果只是想了解 Node-API 的概念，可以运行我们的模拟示例：

```bash
deno run --allow-all mock-napi.ts
```

这个示例展示了 Node-API 的核心概念，而不需要复杂的构建过程。
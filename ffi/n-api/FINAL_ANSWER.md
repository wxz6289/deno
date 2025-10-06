# Deno 如何使用 NAPI - 完整指南

## 🎯 核心要点

**Deno 不能直接使用 Node-API (NAPI) 模块，但提供了更好的替代方案！**

## 📋 快速回答

### ❌ 不可行的做法
```typescript
// 这些在 Deno 中不工作:
import addon from './module.node';          // ❌ Node-API 格式
const addon = require('./module.node');    // ❌ require 语法
```

### ✅ 可行的替代方案

#### 1. Deno FFI (最高性能)
```typescript
// 加载标准动态库 (.so/.dylib/.dll)
const lib = Deno.dlopen('./library.so', {
  add: { parameters: ["i32", "i32"], result: "i32" }
});
const result = lib.symbols.add(10, 20);
```

#### 2. WebAssembly (跨平台)
```typescript
// 加载 WASM 模块
const wasm = await WebAssembly.instantiateStreaming(fetch('./module.wasm'));
const result = wasm.instance.exports.add(10, 20);
```

#### 3. Rust + wasm-pack (现代推荐)
```typescript
import init, { add } from "./pkg/module.js";
await init();
const result = add(10, 20);
```

## 🔄 迁移路径

### 从 Node-API 到 Deno FFI

**原来的 Node-API 代码:**
```cpp
// node_addon.cpp
#include <node_api.h>
// 复杂的 NAPI 样板代码...
NAPI_MODULE(addon, Init)
```

**迁移为 Deno FFI:**
```c
// deno_addon.c
#define EXPORT __attribute__((visibility("default")))

EXPORT int add(int a, int b) {
    return a + b;  // 简洁明了！
}
```

**编译命令:**
```bash
# macOS/Linux
gcc -shared -fPIC -o addon.dylib deno_addon.c

# Windows
gcc -shared -o addon.dll deno_addon.c
```

## 🛠️ 实践示例

我已经为您创建了以下可用的示例文件：

1. **`test.ts`** - 展示错误做法和正确方向
2. **`working_example.ts`** - 三种可行方案的实际演示
3. **`DENO_NAPI_GUIDE.md`** - 完整技术指南
4. **`mock-napi.ts`** - Node-API 概念的模拟实现

## 🚀 立即体验

```bash
# 了解概念
deno run test.ts

# 看实际效果
deno run --allow-all working_example.ts

# 体验模拟 NAPI
deno run mock-napi.ts
```

## 📊 方案对比

| 特性   | Node-API   | Deno FFI  | WebAssembly | Rust+WASM |
|--------|------------|-----------|-------------|-----------|
| 性能   | 100%       | 95%       | 80%         | 85%       |
| 兼容性 | Node.js 只 | Deno 原生 | 通用        | 通用      |
| 复杂度 | 高         | 中        | 低          | 低        |
| 安全性 | 中         | 低        | 高          | 高        |

## 💡 选择建议

- **学习项目**: 使用 `mock-napi.ts` 了解概念
- **生产项目**: Deno FFI 或 WebAssembly
- **跨平台**: 优先选择 WebAssembly
- **高性能**: Deno FFI + 优化的 C/Rust

## 🔗 相关资源

- [Deno FFI 文档](https://deno.land/manual/runtime/ffi_api)
- [WebAssembly 指南](https://webassembly.org/)
- [Rust wasm-bindgen](https://rustwasm.github.io/wasm-bindgen/)

## 🎉 结论

虽然 Deno 不直接支持 Node-API，但它提供的替代方案更加现代、安全和强大！这种设计选择反映了 Deno 对标准化、安全性和性能的重视。
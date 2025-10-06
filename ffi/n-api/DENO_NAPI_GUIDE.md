# Deno 如何使用 Node-API (NAPI)

## 🚨 重要事实

**Deno 无法直接使用传统的 Node-API 模块！**

这是因为：
- Node-API 模块依赖 Node.js 运行时
- Deno 使用不同的模块系统和 FFI 机制
- 符号导出方式完全不同

## 🔍 技术原理

### Node-API 模块的工作原理
```
Node.js 环境:
┌─ require('./module.node')
├─ Node.js 加载器识别 .node 文件
├─ 调用模块的 NAPI_MODULE 入口点
├─ 执行 napi_set_named_property
└─ 返回 JavaScript 对象
```

### Deno FFI 的工作原理
```
Deno 环境:
┌─ Deno.dlopen('./library.so', signatures)
├─ 系统 dlopen() 加载动态库
├─ dlsym() 查找 C 函数符号
└─ 返回函数指针包装器
```

## ✅ Deno 中使用原生代码的正确方法

### 方法 1: Deno FFI (推荐)

#### 1.1 创建纯 C 库

```c
// math.c
#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

EXPORT int add(int a, int b) {
    return a + b;
}

EXPORT int multiply(int a, int b) {
    return a * b;
}
```

#### 1.2 编译动态库

```bash
# macOS
gcc -shared -fPIC -o math.dylib math.c

# Linux
gcc -shared -fPIC -o math.so math.c

# Windows
gcc -shared -o math.dll math.c
```

#### 1.3 在 Deno 中使用

```typescript
// math_ffi.ts
const libPath = {
  darwin: "./math.dylib",
  linux: "./math.so",
  windows: "./math.dll"
}[Deno.build.os];

const lib = Deno.dlopen(libPath!, {
  add: { parameters: ["i32", "i32"], result: "i32" },
  multiply: { parameters: ["i32", "i32"], result: "i32" },
});

console.log(lib.symbols.add(10, 20));      // 30
console.log(lib.symbols.multiply(6, 7));   // 42

lib.close();
```

### 方法 2: WebAssembly (WASM)

#### 2.1 使用 Emscripten 编译 C

```bash
# 安装 Emscripten
git clone https://github.com/emscripten-core/emsdk.git
cd emsdk && ./emsdk install latest && ./emsdk activate latest

# 编译 C 为 WASM
emcc math.c -o math.js -s EXPORTED_FUNCTIONS='["_add","_multiply"]'
```

#### 2.2 在 Deno 中使用 WASM

```typescript
// math_wasm.ts
const wasmCode = await Deno.readFile("./math.wasm");
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule);

const { add, multiply } = wasmInstance.exports;

console.log(add(10, 20));      // 30
console.log(multiply(6, 7));   // 42
```

### 方法 3: Rust + wasm-pack (现代推荐)

#### 3.1 创建 Rust 项目

```rust
// src/lib.rs
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[wasm_bindgen]
pub fn multiply(a: i32, b: i32) -> i32 {
    a * b
}
```

#### 3.2 编译和使用

```bash
# 编译
wasm-pack build --target web

# 在 Deno 中使用
```

```typescript
// math_rust.ts
import init, { add, multiply } from "./pkg/math.js";

await init();

console.log(add(10, 20));      // 30
console.log(multiply(6, 7));   // 42
```

## 🔄 从 Node-API 迁移到 Deno

### 原有 Node-API 代码
```cpp
// node_addon.cpp (Node-API)
#include <node_api.h>

napi_value Add(napi_env env, napi_callback_info info) {
    // 复杂的 Node-API 样板代码...
    return result;
}

napi_value Init(napi_env env, napi_value exports) {
    napi_set_named_property(env, exports, "add", /* ... */);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
```

### 迁移为 Deno FFI
```c
// deno_addon.c (纯 C)
#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

EXPORT int add(int a, int b) {
    return a + b;  // 简洁明了！
}
```

## 🛠️ 实践示例

让我为您创建一个完整的工作示例：

### 1. 创建 C 源文件
```c
// calculator.c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#ifdef _WIN32
    #define EXPORT __declspec(dllexport)
#else
    #define EXPORT __attribute__((visibility("default")))
#endif

EXPORT int add(int a, int b) {
    return a + b;
}

EXPORT int subtract(int a, int b) {
    return a - b;
}

EXPORT double divide(double a, double b) {
    return b != 0 ? a / b : 0;
}

EXPORT const char* get_version() {
    return "1.0.0";
}
```

### 2. 编译脚本
```bash
#!/bin/bash
# compile.sh

case "$OSTYPE" in
    darwin*)  gcc -shared -fPIC -o calculator.dylib calculator.c ;;
    linux*)   gcc -shared -fPIC -o calculator.so calculator.c ;;
    msys*)    gcc -shared -o calculator.dll calculator.c ;;
esac
```

### 3. Deno 使用代码
```typescript
// calculator.ts
const getLibPath = () => {
  const paths = {
    darwin: "./calculator.dylib",
    linux: "./calculator.so",
    windows: "./calculator.dll"
  };
  return paths[Deno.build.os as keyof typeof paths];
};

const calculator = Deno.dlopen(getLibPath(), {
  add: { parameters: ["i32", "i32"], result: "i32" },
  subtract: { parameters: ["i32", "i32"], result: "i32" },
  divide: { parameters: ["f64", "f64"], result: "f64" },
  get_version: { parameters: [], result: "pointer" },
});

// 使用函数
console.log("加法:", calculator.symbols.add(10, 5));
console.log("减法:", calculator.symbols.subtract(10, 5));
console.log("除法:", calculator.symbols.divide(10, 3));

// 读取字符串
const versionPtr = calculator.symbols.get_version();
if (versionPtr) {
  const version = new Deno.UnsafePointerView(versionPtr as Deno.PointerObject).getCString();
  console.log("版本:", version);
}

calculator.close();
```

## 📊 方案对比

| 方案        | 性能 | 复杂度 | 跨平台 | 生态系统   |
|-------------|------|--------|--------|------------|
| Deno FFI    | 95%  | 中     | ✅      | Deno 原生  |
| WebAssembly | 80%  | 低     | ✅      | 通用标准   |
| Rust + WASM | 85%  | 低     | ✅      | 现代工具链 |
| Node-API    | 100% | 高     | ❌      | 仅 Node.js |

## 🎯 最佳实践建议

1. **新项目**: 使用 Deno FFI 或 Rust + WASM
2. **迁移项目**: 重构 Node-API 为纯 C 函数
3. **跨平台**: 优先考虑 WebAssembly
4. **性能关键**: 使用 Deno FFI + 优化的 C/Rust 代码

## 🔗 相关资源

- [Deno FFI 官方文档](https://deno.land/manual/runtime/ffi_api)
- [WebAssembly 入门](https://webassembly.org/getting-started/)
- [Rust wasm-bindgen 指南](https://rustwasm.github.io/wasm-bindgen/)
- [Emscripten 文档](https://emscripten.org/docs/getting_started/)

总之，虽然 Deno 不能直接使用 Node-API 模块，但它提供了更现代、更强大的原生代码集成方案！
## 🦀 Deno-bindgen 使用方法总结

### 🎯 什么是 Deno-bindgen？

`deno-bindgen` 是一个强大的工具，它可以：

- 自动为 Rust 函数生成 TypeScript 绑定
- 让您在 Deno 中无缝使用 Rust 的高性能代码
- 提供类型安全的 FFI 接口

### 🚀 核心使用流程

#### 1. 项目设置

```toml
# Cargo.toml
[package]
name = "my_project"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
deno_bindgen = "0.8"
serde = { version = "1.0", features = ["derive"] }
```

#### 2. Rust 代码示例

```rust
// src/lib.rs
use deno_bindgen::prelude::*;

#[deno_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[deno_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}
```

#### 3. 构建步骤

```bash
# 1. 安装工具
deno install -Arf --name deno_bindgen https://deno.land/x/deno_bindgen/cli.ts

# 2. 构建 Rust 库
cargo build --release

# 3. 生成绑定
deno_bindgen

# 4. 使用绑定
deno run --allow-ffi your_script.ts
```

#### 4. TypeScript 使用

```typescript
import { add, greet } from "./bindings/mod.ts";

console.log(add(5, 3));        // 8
console.log(greet("World"));   // "Hello, World!"
```

### 📊 支持的数据类型

| Rust 类型        | TypeScript 类型 | 用途     |
|------------------|-----------------|----------|
| `i32`, `i64`     | `number`        | 整数     |
| `f32`, `f64`     | `number`        | 浮点数   |
| `bool`           | `boolean`       | 布尔值   |
| `String`, `&str` | `string`        | 字符串   |
| `Vec<T>`         | `T[]`           | 数组     |
| `Option<T>`      | `T \| null`     | 可选值   |
| `Result<T, E>`   | `T` (throws)    | 错误处理 |
| 自定义结构体     | 对象            | 复杂数据 |

### 💡 主要优势

1. **性能提升** - Rust 的计算性能
2. **类型安全** - 自动生成的类型定义
3. **开发效率** - 无需手写 FFI 绑定
4. **错误处理** - 内置的 Result 和 Option 支持
5. **跨平台** - 支持所有主要操作系统

### 🎯 适用场景

- **计算密集型任务** - 数学运算、算法
- **数据处理** - 大数据分析、转换
- **加密解密** - 安全相关操作
- **图像/音频处理** - 媒体文件操作
- **性能关键路径** - 需要优化的核心逻辑

### ⚡ 性能对比示例

```typescript
// JavaScript 实现
function fibonacciJS(n: number): number {
  if (n <= 1) return n;
  return fibonacciJS(n - 1) + fibonacciJS(n - 2);
}

// Rust 实现（通过 deno-bindgen）
import { fibonacci } from "./bindings/mod.ts";

// 性能测试
console.time("JavaScript");
const jsResult = fibonacciJS(40);
console.timeEnd("JavaScript"); // ~1000ms

console.time("Rust");
const rustResult = fibonacci(40);
console.timeEnd("Rust"); // ~0.1ms
```

### 📁 项目文件结构

```
my_project/
├── Cargo.toml          # Rust 配置
├── src/lib.rs          # Rust 源代码
├── bindings/           # 生成的绑定（自动）
│   ├── mod.ts
│   └── bindings.json
├── test.ts             # TypeScript 测试
├── build.sh            # 构建脚本
└── README.md           # 文档
```

### 🔧 构建脚本模板

```bash
#!/bin/bash
set -e

echo "🔨 Building Rust library..."
cargo build --release

echo "🔗 Generating TypeScript bindings..."
deno_bindgen

echo "🧪 Running tests..."
deno run --allow-ffi test.ts

echo "✅ Build complete!"
```

### 📚 学习资源

- **官方文档**: [deno-bindgen GitHub](https://github.com/denoland/deno_bindgen)
- **示例项目**: 查看 `examples/` 目录
- **详细指南**: 参考 `GUIDE.md`
- **Rust 学习**: [Rust 官方书籍](https://doc.rust-lang.org/book/)

### 🐛 常见问题

1. **绑定生成失败** → 检查 `deno_bindgen` CLI 安装
2. **编译错误** → 确认 `crate-type = ["cdylib"]` 配置
3. **运行时错误** → 添加 `--allow-ffi` 权限
4. **类型不匹配** → 使用 `serde` 属性标记结构体

通过 `deno-bindgen`，您可以轻松地将 Rust 的强大性能带入 TypeScript/JavaScript 世界！

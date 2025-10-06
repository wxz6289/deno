# 🦀 Deno-bindgen 完整使用指南

`deno-bindgen` 是一个强大的工具，它允许您轻松地将 Rust 函数绑定到 TypeScript/JavaScript，让您能够在 Deno 项目中利用 Rust 的性能优势。

## 📋 目录

1. [安装和设置](#安装和设置)
2. [基础用法](#基础用法)
3. [支持的数据类型](#支持的数据类型)
4. [高级功能](#高级功能)
5. [实际示例](#实际示例)
6. [构建和部署](#构建和部署)
7. [性能优化](#性能优化)
8. [故障排除](#故障排除)

## 🚀 安装和设置

### 1. 安装必要工具

```bash
# 安装 Rust（如果尚未安装）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Deno（如果尚未安装）
curl -fsSL https://deno.land/x/install/install.sh | sh

# 安装 deno_bindgen CLI
deno install -Arf --name deno_bindgen https://deno.land/x/deno_bindgen/cli.ts
```

### 2. 项目初始化

```bash
# 创建新的 Rust 项目
cargo init --lib my_deno_project
cd my_deno_project
```

### 3. 配置 Cargo.toml

```toml
[package]
name = "my_deno_project"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib"]

[dependencies]
deno_bindgen = "0.8"
serde = { version = "1.0", features = ["derive"] }
```

## 🔧 基础用法

### 1. 简单函数绑定

```rust
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

### 2. TypeScript 中使用

```typescript
import { add, greet } from "./bindings/mod.ts";

console.log(add(5, 3)); // 8
console.log(greet("World")); // "Hello, World!"
```

## 🎯 支持的数据类型

### 基础类型

| Rust 类型        | TypeScript 类型       | 说明     |
|------------------|-----------------------|----------|
| `i32`, `i64`     | `number`              | 整数     |
| `f32`, `f64`     | `number`              | 浮点数   |
| `bool`           | `boolean`             | 布尔值   |
| `String`, `&str` | `string`              | 字符串   |
| `Vec<T>`         | `T[]`                 | 数组     |
| `Option<T>`      | `T \| null`           | 可选值   |
| `Result<T, E>`   | `T` (throws on error) | 错误处理 |

### 复杂类型示例

```rust
use deno_bindgen::prelude::*;
use serde::{Deserialize, Serialize};

// 结构体
#[derive(Serialize, Deserialize)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[deno_bindgen]
pub fn distance(p1: Point, p2: Point) -> f64 {
    let dx = p1.x - p2.x;
    let dy = p1.y - p2.y;
    (dx * dx + dy * dy).sqrt()
}

// 枚举
#[derive(Serialize, Deserialize)]
pub enum Color {
    Red,
    Green,
    Blue,
    RGB(u8, u8, u8),
}

#[deno_bindgen]
pub fn color_to_hex(color: Color) -> String {
    match color {
        Color::Red => "#FF0000".to_string(),
        Color::Green => "#00FF00".to_string(),
        Color::Blue => "#0000FF".to_string(),
        Color::RGB(r, g, b) => format!("#{:02X}{:02X}{:02X}", r, g, b),
    }
}
```

## 🏗️ 高级功能

### 1. 错误处理

```rust
#[deno_bindgen]
pub fn safe_divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}
```

```typescript
try {
    const result = safe_divide(10, 0);
    console.log(result);
} catch (error) {
    console.error("Error:", error); // "Error: Division by zero"
}
```

### 2. 字节数组处理

```rust
#[deno_bindgen]
pub fn hash_bytes(data: &[u8]) -> Vec<u8> {
    // 简单的哈希函数示例
    data.iter().map(|&b| b.wrapping_mul(2)).collect()
}
```

### 3. 回调函数

```rust
use deno_bindgen::prelude::*;

#[deno_bindgen]
pub fn process_with_callback(
    numbers: Vec<i32>,
    callback: deno_bindgen::Callback<fn(i32) -> i32>,
) -> Vec<i32> {
    numbers.into_iter().map(|n| callback.call(n)).collect()
}
```

## 🛠️ 构建和部署

### 1. 构建流程

```bash
# 1. 构建 Rust 库
cargo build --release

# 2. 生成 TypeScript 绑定
deno_bindgen

# 3. 运行测试
deno run --allow-ffi your_test.ts
```

### 2. 自动化脚本

创建 `build.sh`:

```bash
#!/bin/bash
set -e

echo "🔨 Building Rust library..."
cargo build --release

echo "🔗 Generating TypeScript bindings..."
deno_bindgen

echo "🧪 Running tests..."
deno run --allow-ffi --allow-read test.ts

echo "✅ Build complete!"
```

## ⚡ 性能优化

### 1. 编译优化

在 `Cargo.toml` 中添加：

```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
```

### 2. 内存优化

```rust
#[deno_bindgen]
pub fn process_large_data(data: Vec<f64>) -> f64 {
    // 使用迭代器避免额外内存分配
    data.iter().fold(0.0, |acc, &x| acc + x) / data.len() as f64
}
```

### 3. 并行处理

```rust
use rayon::prelude::*;

#[deno_bindgen]
pub fn parallel_sum(numbers: Vec<i32>) -> i32 {
    numbers.par_iter().sum()
}
```

## 🎨 实际应用示例

### 1. 图像处理

```rust
#[derive(Serialize, Deserialize)]
pub struct Image {
    width: u32,
    height: u32,
    data: Vec<u8>,
}

#[deno_bindgen]
pub fn blur_image(image: Image, radius: f32) -> Image {
    // 实现图像模糊算法
    // 这里只是示例
    Image {
        width: image.width,
        height: image.height,
        data: image.data, // 实际应该应用模糊算法
    }
}
```

### 2. 数据分析

```rust
#[derive(Serialize, Deserialize)]
pub struct Statistics {
    mean: f64,
    median: f64,
    std_dev: f64,
}

#[deno_bindgen]
pub fn calculate_stats(data: Vec<f64>) -> Statistics {
    let mean = data.iter().sum::<f64>() / data.len() as f64;

    let mut sorted_data = data.clone();
    sorted_data.sort_by(|a, b| a.partial_cmp(b).unwrap());
    let median = sorted_data[sorted_data.len() / 2];

    let variance = data.iter()
        .map(|x| (x - mean).powi(2))
        .sum::<f64>() / data.len() as f64;
    let std_dev = variance.sqrt();

    Statistics { mean, median, std_dev }
}
```

### 3. 加密和哈希

```rust
use sha2::{Sha256, Digest};

#[deno_bindgen]
pub fn sha256_hash(input: &str) -> String {
    let mut hasher = Sha256::new();
    hasher.update(input.as_bytes());
    format!("{:x}", hasher.finalize())
}
```

## 🐛 故障排除

### 常见问题

1. **编译错误**: 检查 Rust 版本和依赖
2. **绑定生成失败**: 确保 `deno_bindgen` CLI 已正确安装
3. **运行时错误**: 检查 FFI 权限 (`--allow-ffi`)
4. **类型不匹配**: 确保 Rust 和 TypeScript 类型对应

### 调试技巧

```rust
#[deno_bindgen]
pub fn debug_function(input: String) -> String {
    eprintln!("Debug: Processing input: {}", input);
    format!("Processed: {}", input)
}
```

```typescript
// 在 TypeScript 中也可以添加调试信息
const result = debug_function("test");
console.log("Result:", result);
```

## 📦 项目结构示例

```
my_deno_project/
├── Cargo.toml          # Rust 配置
├── src/
│   └── lib.rs          # Rust 源代码
├── bindings/           # 生成的 TypeScript 绑定（自动生成）
│   ├── mod.ts
│   └── bindings.json
├── test.ts             # TypeScript 测试
├── build.sh            # 构建脚本
└── README.md           # 文档
```

## 🎯 最佳实践

1. **类型安全**: 始终使用 Rust 的类型系统
2. **错误处理**: 使用 `Result<T, E>` 处理可能的错误
3. **性能**: 对于计算密集型任务，优先使用 Rust
4. **文档**: 为导出的函数添加文档注释
5. **测试**: 在 Rust 和 TypeScript 层面都要有测试

这样，您就可以充分利用 `deno-bindgen` 的强大功能，在 Deno 项目中享受 Rust 的性能优势！
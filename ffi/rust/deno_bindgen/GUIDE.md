# 🦀 Deno-bindgen 使用方法指南

## 概述

`deno-bindgen` 是一个工具，它可以自动为 Rust 代码生成 TypeScript/JavaScript 绑定，让您能够在 Deno 项目中无缝使用 Rust 函数。

## 🚀 快速开始

### 1. 安装必要工具

```bash
# 安装 Rust（如果还没有）
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 安装 Deno（如果还没有）
curl -fsSL https://deno.land/x/install/install.sh | sh

# 安装 deno_bindgen CLI
deno install -Arf --name deno_bindgen https://deno.land/x/deno_bindgen/cli.ts
```

### 2. 项目设置

#### Cargo.toml 配置
```toml
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

#### src/lib.rs 示例
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

### 3. 构建流程

```bash
# 1. 构建 Rust 库
cargo build --release

# 2. 生成 TypeScript 绑定
deno_bindgen

# 3. 使用生成的绑定
# import { add, greet } from "./bindings/mod.ts";
```

## 📊 支持的数据类型

### 基础类型
- `i32`, `i64`, `u32`, `u64` → `number`
- `f32`, `f64` → `number`
- `bool` → `boolean`
- `String`, `&str` → `string`
- `Vec<T>` → `T[]`
- `&[u8]` → `Uint8Array`

### 复杂类型
```rust
use serde::{Deserialize, Serialize};

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
```

### 错误处理
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

### 可选值
```rust
#[deno_bindgen]
pub fn find_max(numbers: Vec<i32>) -> Option<i32> {
    numbers.into_iter().max()
}
```

## 🎯 实际应用示例

### 数学运算
```rust
#[deno_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => {
            let mut a = 0;
            let mut b = 1;
            for _ in 2..=n {
                let temp = a + b;
                a = b;
                b = temp;
            }
            b
        }
    }
}
```

### 字符串处理
```rust
#[deno_bindgen]
pub fn reverse_string(input: &str) -> String {
    input.chars().rev().collect()
}

#[deno_bindgen]
pub fn word_count(text: &str) -> usize {
    text.split_whitespace().count()
}
```

### 数组操作
```rust
#[deno_bindgen]
pub fn sum_array(numbers: Vec<i32>) -> i32 {
    numbers.iter().sum()
}

#[deno_bindgen]
pub fn filter_even(numbers: Vec<i32>) -> Vec<i32> {
    numbers.into_iter().filter(|&n| n % 2 == 0).collect()
}
```

## 🔧 TypeScript 使用示例

```typescript
// 假设绑定已生成在 ./bindings/mod.ts
import {
  add,
  greet,
  fibonacci,
  safe_divide,
  find_max,
  distance
} from "./bindings/mod.ts";

// 基础函数调用
console.log(add(5, 3)); // 8
console.log(greet("World")); // "Hello, World!"

// 复杂数据结构
const point1 = { x: 0.0, y: 0.0 };
const point2 = { x: 3.0, y: 4.0 };
console.log(distance(point1, point2)); // 5.0

// 错误处理
try {
  const result = safe_divide(10, 0);
  console.log(result);
} catch (error) {
  console.error("Error:", error); // "Error: Division by zero"
}

// 可选值
const max = find_max([1, 5, 3, 9, 2]);
console.log(max); // 9

// 性能测试
console.time("fibonacci");
const fib = fibonacci(40);
console.timeEnd("fibonacci");
console.log(fib); // 102334155
```

## 🏗️ 构建脚本示例

### build.sh
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

### 使用 Makefile
```makefile
.PHONY: build test clean

build:
	cargo build --release
	deno_bindgen

test: build
	deno run --allow-ffi test.ts

clean:
	cargo clean
	rm -rf bindings/

dev: build test
```

## ⚡ 性能优化技巧

### 1. 编译优化
```toml
[profile.release]
opt-level = 3
lto = true
codegen-units = 1
panic = "abort"
```

### 2. 避免不必要的克隆
```rust
// 好的做法：使用引用
#[deno_bindgen]
pub fn process_string(input: &str) -> String {
    input.to_uppercase()
}

// 避免：不必要的所有权转移
#[deno_bindgen]
pub fn process_string_bad(input: String) -> String {
    input.to_uppercase()
}
```

### 3. 批量处理
```rust
#[deno_bindgen]
pub fn batch_process(items: Vec<f64>) -> Vec<f64> {
    items.into_iter()
         .map(|x| x * x)
         .collect()
}
```

## 🐛 常见问题和解决方案

### 1. 编译错误
```bash
# 错误：link `libdeno_bindgen.dylib` not found
# 解决：检查 crate-type 配置
[lib]
crate-type = ["cdylib"]
```

### 2. 绑定生成失败
```bash
# 错误：deno_bindgen command not found
# 解决：重新安装 CLI
deno install -Arf --name deno_bindgen https://deno.land/x/deno_bindgen/cli.ts
```

### 3. 运行时错误
```bash
# 错误：Permission denied
# 解决：添加 FFI 权限
deno run --allow-ffi your_script.ts
```

### 4. 类型不匹配
```rust
// 确保使用正确的序列化属性
#[derive(Serialize, Deserialize)]
pub struct MyStruct {
    pub field: String,
}
```

## 📁 项目结构最佳实践

```
my_project/
├── Cargo.toml          # Rust 配置
├── src/
│   ├── lib.rs          # 主要绑定
│   ├── math.rs         # 数学函数模块
│   └── string.rs       # 字符串处理模块
├── tests/
│   └── integration.rs  # Rust 集成测试
├── bindings/           # 生成的 TS 绑定（自动）
├── examples/
│   └── demo.ts         # TypeScript 示例
├── build.sh            # 构建脚本
└── README.md          # 文档
```

## 🎊 总结

`deno-bindgen` 让您能够：

1. **提升性能** - 在 TypeScript 中使用 Rust 的高性能计算
2. **类型安全** - 自动生成类型定义
3. **简化开发** - 无需手动编写 FFI 绑定
4. **跨平台** - 支持 Windows、macOS、Linux

这使得在 Deno 项目中集成 Rust 变得非常简单和高效！

## 📚 更多资源

- [deno-bindgen GitHub](https://github.com/denoland/deno_bindgen)
- [Deno FFI 文档](https://deno.land/manual/runtime/ffi_api)
- [Rust Serde 文档](https://serde.rs/)
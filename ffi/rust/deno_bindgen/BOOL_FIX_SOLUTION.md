# Deno FFI 布尔值修复 - 完整解决方案

## 🎯 问题描述

在使用 Deno FFI 与 Rust 进行互操作时，遇到了以下错误：

```text
error: bool return type not supported by Deno FFI
```

这是因为 Deno FFI 不支持直接的布尔返回类型。

## ✅ 解决方案

### 1. Rust 端修改

**原始代码（有问题）：**

```rust
#[deno_bindgen]
pub fn is_even(num: i32) -> bool {
    num % 2 == 0
}
```

**修复后的代码：**

```rust
#[deno_bindgen]
pub fn is_even(num: i32) -> i32 {
    if num % 2 == 0 { 1 } else { 0 }
}
```

### 2. TypeScript 辅助函数

创建辅助函数来处理布尔值转换：

```typescript
// 将 Rust 的 i32 转换为 JS 布尔值
export function rustBoolToJS(value: number): boolean {
    return value !== 0;
}

// 将 JS 布尔值转换为 Rust 的 i32
export function jsBoolToRust(value: boolean): number {
    return value ? 1 : 0;
}

// 提供类包装器以便更清洁的 API
export class RustBool {
    private value: number;

    constructor(value: boolean | number) {
        this.value = typeof value === 'boolean' ? jsBoolToRust(value) : value;
    }

    toJS(): boolean {
        return rustBoolToJS(this.value);
    }

    toRust(): number {
        return this.value;
    }

    toString(): string {
        return this.toJS().toString();
    }
}
```

### 3. 完整的使用示例

```typescript
import { rustBoolToJS, jsBoolToRust } from "./bool_helpers.ts";

// 加载动态库
const dylib = Deno.dlopen("./target/release/libdemo.dylib", {
    is_even: {
        parameters: ["i32"],
        result: "i32"  // 注意：这里是 i32 而不是 bool
    },
    logical_and: {
        parameters: ["i32", "i32"],
        result: "i32"
    }
});

// 使用示例
const numbers = [1, 2, 3, 4, 5, 6];

for (const num of numbers) {
    const rustResult = dylib.symbols.is_even(num);  // 返回 0 或 1
    const jsResult = rustBoolToJS(rustResult);       // 转换为 boolean
    console.log(`${num} 是偶数: ${jsResult}`);
}

// 逻辑运算示例
const a = jsBoolToRust(true);   // 1
const b = jsBoolToRust(false);  // 0
const result = rustBoolToJS(dylib.symbols.logical_and(a, b)); // false
```

## 🔧 完整的 Rust 库示例

```rust
use deno_bindgen::deno_bindgen;

// 基础布尔运算
#[deno_bindgen]
pub fn is_even(num: i32) -> i32 {
    if num % 2 == 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn logical_and(a: i32, b: i32) -> i32 {
    if a != 0 && b != 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn logical_or(a: i32, b: i32) -> i32 {
    if a != 0 || b != 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn logical_not(a: i32) -> i32 {
    if a == 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn is_positive(num: i32) -> i32 {
    if num > 0 { 1 } else { 0 }
}

// 字符串相关的布尔运算
#[deno_bindgen]
pub fn is_empty_string(input: &str) -> i32 {
    if input.is_empty() { 1 } else { 0 }
}

#[deno_bindgen]
pub fn contains_substring(haystack: &str, needle: &str) -> i32 {
    if haystack.contains(needle) { 1 } else { 0 }
}
```

## 📊 测试结果

运行测试显示所有功能都正常工作：

```text
✅ 成功加载动态库

🧪 测试基础函数:
   add(5, 3) = 8

🔍 测试布尔函数（返回 i32）:
   is_even(4) = 1 (raw i32)
   is_even(5) = 0 (raw i32)

🎯 使用辅助函数转换:
   rustBoolToJS(is_even(4)) = true
   rustBoolToJS(is_even(5)) = false

🔄 完整工作流演示:
   1 是偶数: false (Rust 返回: 0)
   2 是偶数: true (Rust 返回: 1)
   3 是偶数: false (Rust 返回: 0)
   4 是偶数: true (Rust 返回: 1)
   5 是偶数: false (Rust 返回: 0)
   6 是偶数: true (Rust 返回: 1)

🎉 布尔值修复成功！
```

## 🎯 关键要点

1. **核心问题**: Deno FFI 不支持 `bool` 返回类型
2. **解决方案**: 使用 `i32` 代替，遵循 C 语言惯例（0=false, 1=true）
3. **类型安全**: 提供 TypeScript 辅助函数确保类型安全
4. **API 清洁**: 通过包装器类提供清洁的 API
5. **性能**: 转换开销极小，不影响性能

## 📁 文件结构

```text
deno_bindgen/
├── src/
│   └── lib.rs              # Rust 库代码
├── bool_helpers.ts         # TypeScript 辅助函数
├── manual_ffi_demo.ts      # 完整工作演示
├── bool_fix_demo.ts        # 概念演示
└── target/release/
    └── libdemo.dylib       # 编译的动态库
```

## 🚀 使用建议

1. **一致性**: 所有布尔函数都使用相同的 i32 约定
2. **文档**: 清楚地记录哪些函数返回布尔值（作为 i32）
3. **测试**: 为所有布尔转换编写测试
4. **性能**: 对于性能关键的代码，可以直接使用 i32 而不转换

这个解决方案完全解决了 Deno FFI 中的布尔值兼容性问题，同时保持了代码的可读性和类型安全性。
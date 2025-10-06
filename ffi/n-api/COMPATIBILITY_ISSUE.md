# Node-API 与 Deno FFI 兼容性问题

## 🚨 核心问题

您遇到的错误是因为 **Node-API 模块** 和 **Deno FFI** 使用了完全不同的机制：

```
❌ 不兼容的原因：
Node-API (.node) → JavaScript 函数对象 → 需要 Node.js 运行时
Deno FFI → 直接查找 C 符号 → dlsym() 无法找到 JavaScript 函数
```

## 🔍 技术分析

### Node-API 模块结构

```
.node 文件包含：
├── Node.js 运行时集成代码
├── JavaScript 包装函数
├── 自动类型转换逻辑
└── 垃圾回收集成
```

### Deno FFI 期望

```
标准动态库包含：
├── 纯 C/C++ 函数符号
├── 标准调用约定
├── 手动内存管理
└── 直接函数指针
```

## ✅ 解决方案

### 方案 1: 创建 Deno 兼容的 C 库

1. **编译纯 C 库**：

```bash
./compile_ffi.sh
```

2. **运行 Deno FFI 示例**：

```bash
deno run --allow-ffi simple_ffi_demo.ts
```

### 方案 2: 运行模拟版本

```bash
deno run mock-napi.ts
```

### 方案 3: 了解兼容性差异

```bash
deno run compatibility-analysis.ts
```

## 🎯 推荐做法

对于 Deno 项目，建议：

1. **新项目**: 直接使用 Deno FFI 或 WebAssembly
2. **现有 Node-API**: 重构为标准 C 库
3. **学习目的**: 使用我们提供的模拟示例

## 💡 关键点

- Node-API 模块**无法**直接在 Deno 中使用
- 需要重新编译为标准动态库格式
- Deno FFI 提供了更直接的原生代码集成方式

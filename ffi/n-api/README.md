# Deno Node-API 示例

这个示例演示了如何在 Deno 中使用 Node-API 原生模块。

## 📁 文件结构

```
n-api/
├── napi.ts              # 完整的 Node-API 示例
├── simple-napi.ts       # 简化的演示版本
├── napi_addon.cpp       # C++ Node-API 模块源码
├── binding.gyp          # 构建配置
├── package.json         # Node.js 依赖配置
├── build.sh            # 自动构建脚本
└── README.md           # 说明文档
```

## 🚀 快速开始

### 1. 安装依赖

确保已安装 Node.js 和 npm：

```bash
node --version  # 需要 v16+
npm --version
```

### 2. 构建原生模块

运行自动构建脚本：

```bash
# 方法 1: 使用构建脚本
./build.sh

# 方法 2: 手动构建
npm install
npm run build
```

### 3. 运行示例

```bash
# 运行简化版本 (推荐新手)
deno run --allow-ffi --allow-read simple-napi.ts

# 运行完整版本 (需要成功构建原生模块)
deno run --allow-ffi --allow-read napi.ts
```

## 🔧 技术细节

### Node-API 模块功能

C++ 模块提供以下功能：

- **数学运算**: `add()`, `multiply()`
- **字符串处理**: `hello()`
- **数组操作**: `sumArray()`
- **对象创建**: `createObject()`

### Deno FFI 集成

```typescript
// 定义函数签名
const napiSignatures = {
  add: {
    parameters: ["i32", "i32"],
    result: "i32",
  },
  // ... 其他函数
} as const;

// 加载模块
const addon = Deno.dlopen("./build/Release/napi_addon.node", napiSignatures);

// 调用函数
const result = addon.symbols.add(10, 20);
```

## 📊 性能对比

Node-API 模块相比纯 JavaScript 的优势：

- ✅ **高性能计算**: C++ 实现，性能接近原生
- ✅ **内存效率**: 直接内存操作，减少 GC 压力
- ✅ **类型安全**: 强类型检查和转换
- ✅ **生态兼容**: 可复用现有 Node.js 原生模块

## ⚠️ 注意事项

### 1. 构建要求

- 需要 C++ 编译器 (gcc, clang, MSVC)
- 需要 Python (用于 node-gyp)
- 需要 node-gyp 构建工具

### 2. 平台兼容性

- ✅ macOS (clang)
- ✅ Linux (gcc)
- ✅ Windows (MSVC)

### 3. Deno 限制

```bash
# 需要 FFI 权限
--allow-ffi

# 需要文件读取权限
--allow-read
```

## 🛠️ 故障排除

### 构建失败

```bash
# 清理并重新构建
npm run clean
npm run build

# 检查构建工具
node-gyp --version
python --version
```

### 模块加载失败

```bash
# 检查文件是否存在
ls -la build/Release/napi_addon.node

# 检查权限
chmod +x build/Release/napi_addon.node
```

### Deno 权限错误

```bash
# 确保包含必要权限
deno run --allow-ffi --allow-read napi.ts
```

## 📚 相关资源

- [Node-API 官方文档](https://nodejs.org/api/n-api.html)
- [Deno FFI 文档](https://deno.land/manual/runtime/ffi_api)
- [node-gyp 构建工具](https://github.com/nodejs/node-gyp)
- [C++ Node.js 插件指南](https://nodejs.org/api/addons.html)

## 💡 最佳实践

1. **错误处理**: 始终检查 Node-API 函数返回状态
2. **内存管理**: 正确释放分配的内存
3. **类型转换**: 谨慎处理 JavaScript 和 C++ 类型转换
4. **性能优化**: 减少频繁的边界跨越调用
5. **平台兼容**: 考虑不同操作系统的差异

## 🔮 扩展示例

这个基础示例可以扩展为：

- 🖼️ **图像处理**: 使用 OpenCV 等 C++ 库
- 🔢 **科学计算**: 集成 BLAS、LAPACK 等数学库
- 🗄️ **数据库驱动**: 高性能数据库连接器
- 🔐 **加密算法**: 硬件加速的加密运算
- 🎮 **游戏引擎**: 实时图形和物理计算
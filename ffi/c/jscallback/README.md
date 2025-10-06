# 🔄 JavaScript 回调函数 FFI 示例

这个项目演示了如何在 C 代码和 JavaScript 之间实现回调函数机制，包括新增的 `checkStatus` 函数。

## 📁 文件结构

```
jscallback/
├── jscallback.c              # C 实现文件
├── jscallback.h              # C 头文件
├── jscallback.ts             # 基础 FFI 接口
├── test_status.ts            # 详细状态测试
├── simple_status_test.ts     # 简化状态测试
├── build.sh                  # 编译脚本
└── README.md                 # 此文档
```

## 🔧 新增的 checkStatus 函数

### C 函数签名

```c
int checkStatus(void);
```

### 功能说明

- **返回值**:
  - `1` - 回调函数已设置且可用
  - `0` - 回调函数未设置或不可用
- **用途**: 检查当前回调函数的状态，用于状态验证和错误处理

### C 实现细节

```c
int checkStatus() {
    if (stored_callback != NULL) {
        printf("C: Callback status - ACTIVE (function is set)\n");
        return 1; // 回调函数已设置
    } else {
        printf("C: Callback status - INACTIVE (no function set)\n");
        return 0; // 回调函数未设置
    }
}
```

## 🚀 快速开始

### 1. 编译 C 库

```bash
chmod +x build.sh
./build.sh
```

### 2. 运行基础测试

```bash
deno run --allow-ffi jscallback.ts
```

### 3. 运行状态功能测试

```bash
deno run --allow-ffi simple_status_test.ts
```

### 4. 运行详细测试（如果可用）

```bash
deno run --allow-ffi test_status.ts
```

## 📖 API 文档

### C 函数

```c
// 设置 JavaScript 回调函数
void setCallback(js_callback_t callback);

// 执行已设置的回调函数
void runCallback(void);

// 检查回调函数状态（新增）
int checkStatus(void);
```

### TypeScript 接口

```typescript
const signatures = {
  setCallback: {
    parameters: ["function"],
    result: "void",
  },
  runCallback: {
    parameters: [],
    result: "void",
  },
  checkStatus: {
    parameters: [],
    result: "i32",
  }
};
```

## 🎯 使用示例

### 基础状态检查

```typescript
// 加载库
const dylib = Deno.dlopen("./libjscallback.dylib", signatures);

// 检查初始状态
let status = dylib.symbols.checkStatus();
console.log(`状态: ${status ? '已设置' : '未设置'}`);

// 设置回调
const callback = new Deno.UnsafeCallback(
  { parameters: ["i32"], result: "void" },
  (value) => console.log(`收到: ${value}`)
);

dylib.symbols.setCallback(callback.pointer);

// 再次检查状态
status = dylib.symbols.checkStatus();
console.log(`状态: ${status ? '已设置' : '未设置'}`);
```

### 安全的回调执行

```typescript
// 在执行回调前检查状态
if (dylib.symbols.checkStatus() === 1) {
  dylib.symbols.runCallback();
  console.log("✅ 回调执行成功");
} else {
  console.log("⚠️ 警告: 回调函数未设置");
}
```

### 事件处理系统示例

```typescript
class EventSystem {
  private dylib: any;

  constructor() {
    this.dylib = Deno.dlopen("./libjscallback.dylib", signatures);
  }

  // 检查事件处理器是否就绪
  isReady(): boolean {
    return this.dylib.symbols.checkStatus() === 1;
  }

  // 安全地触发事件
  triggerEvent(): boolean {
    if (this.isReady()) {
      this.dylib.symbols.runCallback();
      return true;
    }
    return false;
  }
}
```

## 🧪 测试结果示例

运行 `simple_status_test.ts` 的输出：

```
🔍 测试 checkStatus 函数
✅ 库加载成功

1. 检查初始状态:
C: Callback status - INACTIVE (no function set)
   状态: 0 (未设置)

2. 设置回调函数:
C: Callback function set
C: Callback status - ACTIVE (function is set)
   状态: 1 (已设置)

3. 运行回调:
C: Calling JavaScript callback with value 42
   🎯 回调接收: 42

4. 最终状态检查:
C: Callback status - ACTIVE (function is set)
   状态: 1 (已设置)

✅ 测试完成
```

## 🔍 应用场景

### 1. 状态验证

- 在执行回调前验证函数是否已设置
- 避免空指针调用导致的程序崩溃

### 2. 错误处理

- 提供明确的错误信息
- 实现优雅的降级处理

### 3. 调试支持

- 帮助开发者诊断回调设置问题
- 提供运行时状态信息

### 4. 事件系统

- 构建可靠的事件处理机制
- 支持动态的回调管理

## 🚨 注意事项

1. **内存管理**: 确保正确关闭 `UnsafeCallback` 和 `DynamicLibrary`
2. **线程安全**: 当前实现不是线程安全的
3. **错误处理**: 生产环境中应添加更完善的错误处理
4. **资源清理**: 程序退出前应清理所有 FFI 资源

## 🔧 故障排除

### 编译错误

```bash
# 确保有 GCC 编译器
gcc --version

# macOS 安装开发工具
xcode-select --install
```

### 运行时错误

```bash
# 检查库文件是否存在
ls -la *.dylib *.so *.dll

# 确保文件权限正确
chmod +x build.sh
```

### FFI 权限错误

```bash
# 使用正确的权限标志
deno run --allow-ffi your_script.ts
```

## 📚 扩展阅读

- [Deno FFI 文档](https://deno.land/manual/runtime/ffi_api)
- [C 函数指针详解](https://en.cppreference.com/w/c/language/pointer)
- [JavaScript 与 C 的互操作](https://developer.mozilla.org/en-US/docs/WebAssembly/C_to_wasm)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

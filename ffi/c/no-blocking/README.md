# 🚀 跨平台睡眠函数 - Deno FFI 实现

这是一个使用 C 语言实现的跨平台毫秒级睡眠函数，通过 Deno FFI 接口在 TypeScript 中调用。

## 📁 文件结构

```
no-blocking/
├── sleep.c          # C 睡眠函数实现
├── sleep.h          # C 头文件
├── test_sleep.c     # C 测试程序
├── build.sh         # 编译脚本
├── sleep_ffi.ts     # Deno FFI 接口
├── simple_test.ts   # 简单 FFI 测试
├── demo.ts          # 完整演示程序
└── README.md        # 此文档
```

## 🔧 修复的问题

### 原始代码问题

1. ❌ 缺少头文件包含语句
2. ❌ 函数没有返回值
3. ❌ 函数名与标准库冲突

### 修复后的改进

1. ✅ 添加了正确的头文件引用
2. ✅ 函数返回适当的状态码
3. ✅ 重命名为 `sleep_ms` 避免冲突
4. ✅ 添加了跨平台支持
5. ✅ 提供了完整的 FFI 接口

## 🚀 快速开始

### 1. 编译 C 代码

```bash
chmod +x build.sh
./build.sh
```

### 2. 运行简单测试

```bash
deno run --allow-ffi --allow-read simple_test.ts
```

### 3. 运行完整演示

```bash
deno run --allow-ffi --allow-read demo.ts
```

## 📖 API 文档

### C 函数

```c
int sleep_ms(unsigned int ms);
```

- **参数**: `ms` - 睡眠时间（毫秒）
- **返回值**: `0` 成功，`-1` 失败

### TypeScript 接口

```typescript
// 基础睡眠函数
async function sleepMs(ms: number): Promise<number>

// 精确睡眠函数
async function precisionSleep(ms: number): Promise<void>

// 测试函数
async function testSleep(): Promise<void>
```

## 🎯 使用示例

### 基础用法

```typescript
import { sleepMs } from "./sleep_ffi.ts";

// 睡眠 500 毫秒
await sleepMs(500);
console.log("睡眠完成！");
```

### 精确睡眠

```typescript
import { precisionSleep } from "./sleep_ffi.ts";

// 更精确的睡眠
await precisionSleep(1000);
```

### 并发睡眠

```typescript
// 并发执行多个睡眠操作
await Promise.all([
  sleepMs(300),
  sleepMs(300),
  sleepMs(300)
]);
```

## 🏗️ 技术细节

### 跨平台实现

- **Windows**: 使用 `Sleep()` API
- **Linux/macOS**: 使用 `nanosleep()` 系统调用

### FFI 类型映射

- C `unsigned int` → Deno `"u32"`
- C `int` → Deno `"i32"`

### 性能特性

- 毫秒级精度
- 非阻塞异步实现
- 支持并发调用
- 低开销 FFI 绑定

## 🧪 测试结果

编译并运行测试会显示：

```
=== 跨平台睡眠函数测试 ===

测试 1: 睡眠 100 毫秒...
  - 返回值: 0
  - 预期时间: 100 ms
  - 实际时间: 102 ms
  - 误差: +2 ms
  - 状态: ✅ 成功
```

## ⚡ 性能对比

C FFI 实现 vs JavaScript setTimeout:

- **精确度**: C 实现更精确
- **开销**: FFI 调用有轻微开销
- **并发性**: 两者都支持并发

## 🔍 故障排除

### 编译错误

```bash
# 确保有 GCC 编译器
gcc --version

# macOS 可能需要安装 Xcode Command Line Tools
xcode-select --install
```

### FFI 权限错误

```bash
# 确保使用正确的权限标志
deno run --allow-ffi --allow-read your_script.ts
```

### 共享库找不到

```bash
# 确保在正确目录运行
ls -la libsleep.so

# 检查库是否可执行
file libsleep.so
```

## 📚 扩展阅读

- [Deno FFI 文档](https://deno.land/manual/runtime/ffi_api)
- [C nanosleep 手册](https://man7.org/linux/man-pages/man2/nanosleep.2.html)
- [Windows Sleep API](https://docs.microsoft.com/en-us/windows/win32/api/synchapi/nf-synchapi-sleep)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request 来改进这个项目！

## 📄 许可证

MIT License - 详见 LICENSE 文件

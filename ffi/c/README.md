# 距离计算 FFI 示例 - 类型问题修复

## 🎯 本示例说明

这个目录包含一个完整的距离计算 FFI 示例，展示了如何修复常见的 Deno FFI 类型问题。

### 文件说明

- `distance.c` - C 源代码，包含距离计算函数
- `distance.ts` - 基础的 FFI 调用示例（已修复类型问题）
- `distance-complete.ts` - 完整的 FFI 示例，包含测试和性能对比
- `build-distance.sh` - 编译脚本

### 🚀 快速开始

```bash
# 1. 编译 C 代码
chmod +x build-distance.sh && ./build-distance.sh

# 2. 运行测试
deno run --allow-ffi distance-complete.ts
```

### 🔧 修复的类型问题

原始 `distance.ts` 存在的问题：
1. ❌ 缺少 `dylib` 定义
2. ❌ 复杂的指针创建方式 (`UnsafePointerView` + `BigInt64Array`)
3. ❌ 类型不匹配

修复后的正确方式：
```typescript
// ✅ 正确的指针创建
const pointData = new Float64Array([x, y]);
const pointer = Deno.UnsafePointer.of(pointData);
```

---

# 生成共享库（.so文件）并在 Deno FFI 中使用

## 🔧 编译 C 代码为共享库

### 1. 基本编译命令

对于 `add.c` 文件，使用以下命令编译为共享库：

```bash
# Linux/macOS - 生成 .so 文件
gcc -shared -fPIC -o libadd.so add.c

# macOS - 生成 .dylib 文件（推荐）
gcc -shared -fPIC -o libadd.dylib add.c

# Windows - 生成 .dll 文件
gcc -shared -o add.dll add.c
```

### 2. 参数说明

- `-shared`: 生成共享库
- `-fPIC`: Position Independent Code，生成位置无关代码
- `-o`: 指定输出文件名
- `libadd.so`: 输出的共享库文件名

### 3. 针对不同平台的命令

```bash
# 检测当前平台并编译
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    gcc -shared -fPIC -o libadd.dylib add.c
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    gcc -shared -fPIC -o libadd.so add.c
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    # Windows
    gcc -shared -o add.dll add.c
fi
```

## 📝 创建 Deno FFI 调用代码

现在创建 Deno 代码来调用生成的共享库：

### 基本 FFI 调用示例：

```typescript
// ffi-add.ts
const libPath = Deno.build.os === "darwin"
  ? "./libadd.dylib"
  : Deno.build.os === "windows"
    ? "./add.dll"
    : "./libadd.so";

// 加载动态库
const dylib = Deno.dlopen(libPath, {
  add: {
    parameters: ["i32", "i32"],  // 两个 32 位整数参数
    result: "i32",               // 返回 32 位整数
  },
});

// 调用 C 函数
const result = dylib.symbols.add(5, 3);
console.log(`5 + 3 = ${result}`);

// 关闭动态库
dylib.close();
```

## 🚀 完整的编译和运行流程

### 1. 编译脚本

创建一个自动化编译脚本：

```bash
#!/bin/bash
# build.sh

echo "🔨 编译 C 代码为共享库..."

case "$OSTYPE" in
  darwin*)
    echo "检测到 macOS 系统"
    gcc -shared -fPIC -o libadd.dylib add.c
    echo "✅ 生成文件: libadd.dylib"
    ;;
  linux-gnu*)
    echo "检测到 Linux 系统"
    gcc -shared -fPIC -o libadd.so add.c
    echo "✅ 生成文件: libadd.so"
    ;;
  msys*|win32*)
    echo "检测到 Windows 系统"
    gcc -shared -o add.dll add.c
    echo "✅ 生成文件: add.dll"
    ;;
  *)
    echo "❌ 未知系统类型: $OSTYPE"
    exit 1
    ;;
esac

echo "🎉 编译完成！"
```

### 2. 运行步骤

```bash
# 1. 给脚本执行权限
chmod +x build.sh

# 2. 编译共享库
./build.sh

# 3. 运行 Deno FFI 代码
deno run --allow-ffi ffi-add.ts
```

## 📋 常见问题和解决方案

### 1. 权限问题
如果遇到权限错误，需要添加 `--allow-ffi` 标志：
```bash
deno run --allow-ffi your-script.ts
```

### 2. 找不到库文件
确保共享库文件在正确的路径下，或使用绝对路径：
```typescript
const libPath = new URL("./libadd.dylib", import.meta.url).pathname;
```

### 3. 类型匹配
确保 C 函数的参数和返回值类型与 Deno FFI 定义匹配：

| C 类型 | Deno FFI 类型 |
|--------|---------------|
| int    | "i32"         |
| long   | "i64"         |
| float  | "f32"         |
| double | "f64"         |
| void*  | "pointer"     |
| char*  | "pointer"     |

## 🔍 调试技巧

### 1. 验证共享库
```bash
# Linux/macOS - 查看符号
nm -D libadd.so  # Linux
nm -gU libadd.dylib  # macOS

# 查看库依赖
ldd libadd.so  # Linux
otool -L libadd.dylib  # macOS
```

### 2. 添加调试信息
编译时添加调试标志：
```bash
gcc -shared -fPIC -g -o libadd.dylib add.c
```

## 💡 最佳实践

1. **错误处理**: 总是检查 `dlopen` 是否成功
2. **资源清理**: 使用完毕后调用 `dylib.close()`
3. **跨平台兼容**: 使用条件判断处理不同平台的库文件
4. **类型安全**: 确保参数类型匹配，避免内存错误
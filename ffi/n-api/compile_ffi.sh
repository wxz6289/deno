#!/bin/bash

# 编译简单的 C FFI 库
# 这个库可以直接被 Deno FFI 使用

echo "🔧 编译 C FFI 库"
echo "==============="

# 根据操作系统选择编译参数
case "$OSTYPE" in
    darwin*)
        echo "🍎 检测到 macOS"
        gcc -shared -fPIC -o simple_ffi.dylib simple_ffi.c
        LIB_FILE="simple_ffi.dylib"
        ;;
    linux*)
        echo "🐧 检测到 Linux"
        gcc -shared -fPIC -o simple_ffi.so simple_ffi.c
        LIB_FILE="simple_ffi.so"
        ;;
    msys*|cygwin*)
        echo "🪟 检测到 Windows"
        gcc -shared -o simple_ffi.dll simple_ffi.c
        LIB_FILE="simple_ffi.dll"
        ;;
    *)
        echo "❌ 未知操作系统: $OSTYPE"
        exit 1
        ;;
esac

# 检查编译结果
if [ -f "$LIB_FILE" ]; then
    echo "✅ 编译成功: $LIB_FILE"
    echo "📁 文件信息:"
    ls -la "$LIB_FILE"

    echo ""
    echo "🚀 测试 FFI 库:"
    echo "deno run --allow-ffi simple_ffi_demo.ts"
else
    echo "❌ 编译失败"
    exit 1
fi
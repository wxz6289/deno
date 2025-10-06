#!/bin/bash
# 编译 distance.c 为共享库

echo "🔨 编译 distance.c 为共享库..."

# 检查文件是否存在
if [ ! -f "distance.c" ]; then
    echo "❌ 错误: 找不到 distance.c 文件"
    exit 1
fi

# 根据操作系统编译
case "$OSTYPE" in
  darwin*)
    echo "🍎 检测到 macOS 系统"
    gcc -shared -fPIC -o libdistance.dylib distance.c -lm
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: libdistance.dylib"
        ls -la libdistance.dylib
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  linux-gnu*)
    echo "🐧 检测到 Linux 系统"
    gcc -shared -fPIC -o libdistance.so distance.c -lm
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: libdistance.so"
        ls -la libdistance.so
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  msys*|win32*|cygwin*)
    echo "🪟 检测到 Windows 系统"
    gcc -shared -o distance.dll distance.c -lm
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: distance.dll"
        ls -la distance.dll
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  *)
    echo "❌ 未知系统类型: $OSTYPE"
    exit 1
    ;;
esac

echo ""
echo "🎉 编译完成！现在可以运行 FFI 测试了："
echo "deno run --allow-ffi distance.ts"
echo "deno run --allow-ffi distance-complete.ts"
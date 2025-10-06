#!/bin/bash
# 编译 jscallback.c 为共享库

echo "🔨 编译 jscallback.c 为共享库..."

# 检查文件是否存在
if [ ! -f "jscallback.c" ]; then
    echo "❌ 错误: 找不到 jscallback.c 文件"
    exit 1
fi

# 根据操作系统编译
case "$OSTYPE" in
  darwin*)
    echo "🍎 检测到 macOS 系统"
    gcc -shared -fPIC -o libjscallback.dylib jscallback.c
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: libjscallback.dylib"
        ls -la libjscallback.dylib
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  linux-gnu*)
    echo "🐧 检测到 Linux 系统"
    gcc -shared -fPIC -o libjscallback.so jscallback.c
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: libjscallback.so"
        ls -la libjscallback.so
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  msys*|win32*|cygwin*)
    echo "🪟 检测到 Windows 系统"
    gcc -shared -o jscallback.dll jscallback.c
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: jscallback.dll"
        ls -la jscallback.dll
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
echo "🎉 编译完成！现在可以运行 JavaScript 回调测试："
echo "deno run --allow-ffi jscallback.ts"
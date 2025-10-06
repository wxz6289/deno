#!/bin/bash
# 自动编译 C 代码为共享库的脚本

echo "🔨 开始编译 C 代码为共享库..."

# 检查是否存在 add.c 文件
if [ ! -f "add.c" ]; then
    echo "❌ 错误: 找不到 add.c 文件"
    exit 1
fi

# 检查是否安装了 gcc
if ! command -v gcc &> /dev/null; then
    echo "❌ 错误: 未找到 gcc 编译器"
    echo "请安装 gcc:"
    echo "  macOS: xcode-select --install"
    echo "  Ubuntu: sudo apt install gcc"
    echo "  CentOS: sudo yum install gcc"
    exit 1
fi

# 根据操作系统编译
case "$OSTYPE" in
  darwin*)
    echo "🍎 检测到 macOS 系统"
    gcc -shared -fPIC -o libadd.dylib add.c
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: libadd.dylib"
        ls -la libadd.dylib
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  linux-gnu*)
    echo "🐧 检测到 Linux 系统"
    gcc -shared -fPIC -o libadd.so add.c
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: libadd.so"
        ls -la libadd.so
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  msys*|win32*|cygwin*)
    echo "🪟 检测到 Windows 系统"
    gcc -shared -o add.dll add.c
    if [ $? -eq 0 ]; then
        echo "✅ 成功生成: add.dll"
        ls -la add.dll
    else
        echo "❌ 编译失败"
        exit 1
    fi
    ;;
  *)
    echo "❌ 未知系统类型: $OSTYPE"
    echo "手动编译命令:"
    echo "  Linux: gcc -shared -fPIC -o libadd.so add.c"
    echo "  macOS: gcc -shared -fPIC -o libadd.dylib add.c"
    echo "  Windows: gcc -shared -o add.dll add.c"
    exit 1
    ;;
esac

echo ""
echo "🎉 编译完成！"
echo ""
echo "📋 下一步:"
echo "1. 运行 FFI 测试: deno run --allow-ffi ffi-add.ts"
echo "2. 或者查看符号表:"

case "$OSTYPE" in
  darwin*)
    echo "   nm -gU libadd.dylib"
    ;;
  linux-gnu*)
    echo "   nm -D libadd.so"
    ;;
  *)
    echo "   (Windows 使用 objdump -T add.dll)"
    ;;
esac
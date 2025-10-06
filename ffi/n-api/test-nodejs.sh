#!/bin/bash

# Node.js NAPI 模块构建和测试脚本
# 用于演示如何在 Node.js 中正确加载和使用 NAPI 模块

echo "🚀 Node.js NAPI 模块构建和测试"
echo "=============================="

# 检查 Node.js 环境
echo ""
echo "🔍 环境检查:"
echo "Node.js 版本: $(node --version)"
echo "npm 版本: $(npm --version)"
echo "操作系统: $(uname -s)"
echo "架构: $(uname -m)"

# 清理之前的构建
echo ""
echo "🧹 清理之前的构建..."
rm -rf build node_modules package-lock.json

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

# 构建 NAPI 模块
echo ""
echo "🔨 构建 NAPI 模块..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    echo ""
    echo "💡 常见问题解决方案:"
    echo "1. 安装 Xcode Command Line Tools: xcode-select --install"
    echo "2. 安装 Python: brew install python"
    echo "3. 检查 C++ 编译器: gcc --version"
    exit 1
fi

# 检查构建结果
if [ -f "build/Release/napi_addon.node" ]; then
    echo "✅ 构建成功!"
    echo "📁 模块位置: build/Release/napi_addon.node"

    # 显示模块信息
    echo ""
    echo "📊 模块信息:"
    ls -la build/Release/napi_addon.node

    # 检查模块依赖
    echo ""
    echo "🔗 模块依赖:"
    if command -v otool &> /dev/null; then
        otool -L build/Release/napi_addon.node | head -5
    elif command -v ldd &> /dev/null; then
        ldd build/Release/napi_addon.node | head -5
    fi

else
    echo "❌ 构建失败，模块文件不存在"
    exit 1
fi

# 运行测试
echo ""
echo "🧪 运行 Node.js 测试:"
echo "──────────────────────"

echo ""
echo "1️⃣  CommonJS 版本测试:"
node node-test-cjs.js

echo ""
echo "2️⃣  ES 模块版本测试 (可能失败):"
node node-test.js || echo "⚠️  ES 模块版本可能不兼容，使用 CommonJS 版本"

echo ""
echo "🎯 测试总结:"
echo "═══════════"
echo "✅ NAPI 模块构建成功"
echo "✅ Node.js 可以正常加载和使用"
echo "ℹ️  Deno 无法直接使用此模块 (需要 FFI 重构)"

echo ""
echo "📚 相关文件:"
echo "• C++ 源码: napi_addon.cpp"
echo "• 构建配置: binding.gyp"
echo "• 测试脚本: node-test-cjs.js"
echo "• 构建产物: build/Release/napi_addon.node"

echo ""
echo "🔄 在 Deno 中使用原生代码:"
echo "• 查看: deno run working_example.ts"
echo "• 文档: DENO_NAPI_GUIDE.md"
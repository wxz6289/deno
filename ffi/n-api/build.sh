#!/bin/bash

# Node-API 模块构建脚本
# 用于构建原生 Node-API 模块供 Deno 使用

echo "🔧 构建 Deno Node-API 模块"
echo "=========================="

# 检查 Node.js 是否已安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查 npm 是否已安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到 npm"
    echo "请确保 npm 已正确安装"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 安装依赖
echo ""
echo "📦 安装依赖..."
npm install

# 构建原生模块
echo ""
echo "🏗️  构建原生模块..."
npm run build

# 检查构建结果
if [ -f "build/Release/napi_addon.node" ]; then
    echo ""
    echo "✅ 构建成功!"
    echo "📁 模块位置: build/Release/napi_addon.node"

    # 显示模块信息
    echo ""
    echo "📊 模块信息:"
    ls -la build/Release/napi_addon.node

    echo ""
    echo "🚀 运行测试:"
    echo "deno run --allow-ffi --allow-read napi.ts"

else
    echo ""
    echo "❌ 构建失败!"
    echo "请检查错误信息并重试"
    exit 1
fi
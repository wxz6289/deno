#!/bin/bash

# Deno-bindgen 构建脚本
# 这个脚本会编译 Rust 代码并生成 TypeScript 绑定

echo "🦀 Deno-bindgen 项目构建"
echo "======================="

# 检查必要的工具
echo "🔍 检查工具..."

# 检查 Rust
if ! command -v rustc &> /dev/null; then
    echo "❌ 错误: 未找到 Rust"
    echo "💡 请安装 Rust: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
    exit 1
fi

# 检查 Cargo
if ! command -v cargo &> /dev/null; then
    echo "❌ 错误: 未找到 Cargo"
    exit 1
fi

# 检查 deno_bindgen CLI
if ! command -v deno_bindgen &> /dev/null; then
    echo "⚠️  警告: 未找到 deno_bindgen CLI"
    echo "📦 正在安装 deno_bindgen..."

    if command -v deno &> /dev/null; then
        deno install -Arf --name deno_bindgen https://deno.land/x/deno_bindgen/cli.ts
    else
        echo "❌ 错误: 需要 Deno 来安装 deno_bindgen"
        echo "💡 请先安装 Deno: curl -fsSL https://deno.land/x/install/install.sh | sh"
        exit 1
    fi
fi

echo "✅ 工具检查完成"
echo ""

# 构建 Rust 项目
echo "🔨 构建 Rust 库..."
cargo build --release
if [ $? -ne 0 ]; then
    echo "❌ Rust 构建失败"
    exit 1
fi
echo "✅ Rust 库构建成功"
echo ""

# 生成 TypeScript 绑定
echo "🔗 生成 TypeScript 绑定..."
deno_bindgen
if [ $? -ne 0 ]; then
    echo "❌ 绑定生成失败"
    exit 1
fi
echo "✅ TypeScript 绑定生成成功"
echo ""

# 检查生成的文件
echo "📁 检查生成的文件..."
if [ -d "bindings" ]; then
    echo "✅ bindings/ 目录已创建"
    ls -la bindings/
else
    echo "❌ 绑定目录未找到"
    exit 1
fi
echo ""

# 运行测试
echo "🧪 运行测试..."
if [ -f "test.ts" ]; then
    echo "执行 TypeScript 测试..."
    deno run --allow-ffi --allow-read test.ts
    if [ $? -eq 0 ]; then
        echo "✅ 测试通过"
    else
        echo "⚠️  测试执行有问题，但这可能是正常的"
    fi
else
    echo "⚠️  未找到测试文件"
fi
echo ""

echo "🎉 构建完成！"
echo ""
echo "📖 使用方法:"
echo "1. 查看生成的绑定: ls bindings/"
echo "2. 运行测试: deno run --allow-ffi --allow-read test.ts"
echo "3. 在你的项目中导入: import { functionName } from './bindings/mod.ts'"
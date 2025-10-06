#!/bin/bash

# Node-API 兼容性问题完整演示
# 展示问题、分析原因、提供解决方案

clear
echo "🎯 Node-API 与 Deno FFI 兼容性演示"
echo "=================================="

echo ""
echo "📋 演示步骤:"
echo "1. 尝试运行 Node-API 示例 (会失败)"
echo "2. 分析失败原因"
echo "3. 演示可行的替代方案"

echo ""
echo "🔴 步骤 1: 尝试 Node-API 示例"
echo "─────────────────────────────"
echo "$ deno run --allow-ffi --allow-read napi.ts"
echo ""

# 运行 Node-API 示例 (预期会失败)
deno run --allow-ffi --allow-read napi.ts

echo ""
echo "🔍 步骤 2: 技术分析"
echo "──────────────────"
echo "$ deno run compatibility-analysis.ts"
echo ""

# 运行兼容性分析
deno run compatibility-analysis.ts

echo ""
echo "🟢 步骤 3: 可行的解决方案"
echo "────────────────────────"

echo ""
echo "💡 方案 A: 模拟 Node-API (立即可用)"
echo "$ deno run mock-napi.ts"
echo ""
deno run mock-napi.ts

echo ""
echo "💡 方案 B: 编译 Deno 兼容的 C 库"
echo "$ ./compile_ffi.sh && deno run --allow-ffi simple_ffi_demo.ts"
echo ""

# 检查是否已编译
if [ -f "simple_ffi.dylib" ] || [ -f "simple_ffi.so" ] || [ -f "simple_ffi.dll" ]; then
    echo "✅ C 库已编译，运行演示:"
    deno run --allow-ffi simple_ffi_demo.ts
else
    echo "🔧 编译 C 库..."
    ./compile_ffi.sh
    if [ $? -eq 0 ]; then
        echo ""
        echo "🚀 运行 FFI 演示:"
        deno run --allow-ffi simple_ffi_demo.ts
    else
        echo "❌ 编译失败，跳过 FFI 演示"
    fi
fi

echo ""
echo "📊 总结"
echo "══════"
echo "✅ Node-API 概念已演示 (模拟版本)"
echo "✅ Deno FFI 正确用法已展示"
echo "✅ 兼容性问题已解释清楚"

echo ""
echo "🎓 学习要点:"
echo "• Node-API 模块无法直接用于 Deno FFI"
echo "• 需要重新编译为标准动态库"
echo "• Deno 提供了强大的 FFI 和 WASM 支持"

echo ""
echo "🚀 下一步建议:"
echo "• 实际项目中使用 Deno FFI 或 WebAssembly"
echo "• 考虑将现有 Node-API 代码重构为 Deno 兼容格式"
echo "• 探索 Rust + wasm-pack 的高性能方案"
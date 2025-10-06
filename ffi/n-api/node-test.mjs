// Node.js ES 模块版本 - 加载 NAPI 模块
// 演示如何在 ES 模块中使用 NAPI

import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);

console.log("🚀 Node.js NAPI 模块加载示例 (ES Module)");
console.log("====================================");

console.log("🔍 Node.js 版本:", process.version);
console.log("🔍 模块类型: ES Module");

try {
  // 检查模块路径
  const modulePath = resolve(__dirname, 'build/Release/napi_addon.node');
  console.log("📁 模块路径:", modulePath);

  // 使用 createRequire 加载 NAPI 模块
  console.log("\n📦 正在加载 NAPI 模块...");
  const addon = require('./build/Release/napi_addon.node');
  console.log("✅ NAPI 模块加载成功!");

  // 显示导出的函数
  console.log("\n📋 模块导出:");
  console.log("函数列表:", Object.keys(addon));

  // 测试各个函数
  console.log("\n🧪 功能测试:");
  console.log("─────────────");

  if (addon.add) {
    console.log(`✓ add(15, 25) = ${addon.add(15, 25)}`);
  }

  if (addon.multiply) {
    console.log(`✓ multiply(8, 9) = ${addon.multiply(8, 9)}`);
  }

  if (addon.hello) {
    console.log(`✓ hello("ES Module") = "${addon.hello("ES Module")}"`);
  }

  if (addon.sumArray) {
    const arr = [10, 20, 30, 40, 50];
    console.log(`✓ sumArray([10,20,30,40,50]) = ${addon.sumArray(arr)}`);
  }

  if (addon.createObject) {
    const obj = addon.createObject();
    console.log("✓ createObject() =", obj);
  }

  console.log("\n⚡ 性能基准测试:");
  console.log("─────────────────");

  if (addon.add) {
    const iterations = 500000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      addon.add(i % 50, (i + 1) % 50);
    }

    const end = performance.now();
    const duration = end - start;

    console.log(`✓ ${iterations.toLocaleString()} 次调用耗时: ${duration.toFixed(2)}ms`);
    console.log(`✓ 平均每次调用: ${(duration * 1000 / iterations).toFixed(3)}μs`);
    console.log(`✓ 调用频率: ${(iterations / duration * 1000).toFixed(0)} 次/秒`);
  }

  console.log("\n🎉 ES 模块测试完成!");
  console.log("✅ 所有功能正常工作");

} catch (error) {
  console.error("\n❌ 错误:", error.message);

  if (error.code === 'ERR_MODULE_NOT_FOUND' || error.code === 'MODULE_NOT_FOUND') {
    console.log("\n💡 模块未找到解决方案:");
    console.log("1. 确保已构建 NAPI 模块: npm run build");
    console.log("2. 检查文件路径: build/Release/napi_addon.node");
    console.log("3. 尝试重新构建: npm run clean && npm run build");
  }

  if (error.message.includes('createRequire')) {
    console.log("\n💡 ES 模块兼容性问题:");
    console.log("1. 确保 Node.js 版本 >= 12.2.0");
    console.log("2. 考虑使用 CommonJS 版本: node-test.cjs");
  }

  console.log("\n🔧 替代方案:");
  console.log("使用 CommonJS 版本: node node-test.cjs");

  process.exit(1);
}
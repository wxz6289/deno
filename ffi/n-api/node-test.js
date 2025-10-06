import { access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Node.js 加载 NAPI 模块示例
// 演示如何在 Node.js 中正确使用 Node-API 模块

console.log("🚀 Node.js NAPI 模块加载示例");
console.log("============================");

try {
  // 检查模块文件是否存在
  const modulePath = resolve(__dirname, 'build/Release/napi_addon.node');

  const result = await access(modulePath).then(() => true).catch(() => false);
  if (!result) {
    console.log("❌ NAPI 模块未找到:", modulePath);
    console.log("\n💡 请先构建模块:");
    console.log("1. npm install");
    console.log("2. npm run build");
    console.log("3. 或运行: ./build.sh");
    process.exit(1);
  }

  console.log("✅ 找到 NAPI 模块:", modulePath);

  // 加载 NAPI 模块
  const addon = require('./build/Release/napi_addon.node');
  console.log("✅ NAPI 模块加载成功");

  // 检查导出的函数
  console.log("\n📋 模块导出的函数:");
  console.log("exported functions:", Object.keys(addon));

  // 测试基础数学运算
  if (typeof addon.add === 'function') {
    console.log("\n🧮 数学运算测试:");
    console.log(`add(3, 5) = ${addon.add(3, 5)}`);
  }

  if (typeof addon.multiply === 'function') {
    console.log(`multiply(4, 6) = ${addon.multiply(4, 6)}`);
  }

  // 测试字符串处理
  if (typeof addon.hello === 'function') {
    console.log("\n📝 字符串处理测试:");
    console.log(`hello("Node.js") = "${addon.hello("Node.js")}"`);
  }

  // 测试数组处理
  if (typeof addon.sumArray === 'function') {
    console.log("\n📊 数组处理测试:");
    const testArray = [1, 2, 3, 4, 5];
    console.log(`sumArray([1,2,3,4,5]) = ${addon.sumArray(testArray)}`);
  }

  // 测试对象创建
  if (typeof addon.createObject === 'function') {
    console.log("\n🏗️  对象创建测试:");
    const obj = addon.createObject();
    console.log("createObject() =", obj);
  }

  console.log("\n✅ 所有测试完成!");

} catch (error) {
  console.error("❌ 加载错误:", error.message);

  if (error.code === 'MODULE_NOT_FOUND') {
    console.log("\n💡 模块未找到解决方案:");
    console.log("1. 确保已经构建了 NAPI 模块");
    console.log("2. 检查 build/Release/napi_addon.node 是否存在");
    console.log("3. 运行构建命令: npm run build");
  }

  console.log("\n🔧 构建步骤:");
  console.log("npm install && npm run build");
}
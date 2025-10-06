// Node.js CommonJS 版本 - 加载 NAPI 模块
// 使用传统的 require 语法加载 Node-API 模块

const fs = require('fs');
const path = require('path');

console.log("🚀 Node.js NAPI 模块加载示例 (CommonJS)");
console.log("======================================");

console.log("🔍 Node.js 版本:", process.version);
console.log("🔍 平台:", process.platform);
console.log("🔍 架构:", process.arch);

const modulePath = path.resolve(__dirname, 'build/Release/napi_addon.node');

// 检查模块文件是否存在
if (!fs.existsSync(modulePath)) {
  console.log("❌ NAPI 模块未找到:", modulePath);
  console.log("\n💡 构建步骤:");
  console.log("1. npm install");
  console.log("2. npm run build");
  console.log("3. 或者运行: ./build.sh");
  
  console.log("\n🔧 手动构建:");
  console.log("node-gyp configure");
  console.log("node-gyp build");
  
  process.exit(1);
}

console.log("✅ 找到 NAPI 模块:", modulePath);

try {
  // 加载 NAPI 模块
  console.log("\n📦 正在加载 NAPI 模块...");
  const addon = require('./build/Release/napi_addon.node');
  console.log("✅ NAPI 模块加载成功!");
  
  // 显示模块信息
  console.log("\n📋 模块信息:");
  console.log("导出的函数:", Object.keys(addon));
  console.log("模块类型:", typeof addon);
  
  // 测试数学运算
  console.log("\n🧮 数学运算测试:");
  console.log("─────────────────");
  
  if (typeof addon.add === 'function') {
    const addResult = addon.add(10, 20);
    console.log(`✓ add(10, 20) = ${addResult}`);
  } else {
    console.log("❌ add 函数不可用");
  }
  
  if (typeof addon.multiply === 'function') {
    const multiplyResult = addon.multiply(6, 7);
    console.log(`✓ multiply(6, 7) = ${multiplyResult}`);
  } else {
    console.log("❌ multiply 函数不可用");
  }
  
  // 测试字符串处理
  console.log("\n📝 字符串处理测试:");
  console.log("──────────────────");
  
  if (typeof addon.hello === 'function') {
    const greeting = addon.hello("Node.js");
    console.log(`✓ hello("Node.js") = "${greeting}"`);
  } else {
    console.log("❌ hello 函数不可用");
  }
  
  // 测试数组处理
  console.log("\n📊 数组处理测试:");
  console.log("─────────────────");
  
  if (typeof addon.sumArray === 'function') {
    const testArray = [1, 2, 3, 4, 5];
    const sum = addon.sumArray(testArray);
    console.log(`✓ sumArray([1,2,3,4,5]) = ${sum}`);
  } else {
    console.log("❌ sumArray 函数不可用");
  }
  
  // 测试对象创建
  console.log("\n🏗️  对象创建测试:");
  console.log("─────────────────");
  
  if (typeof addon.createObject === 'function') {
    const obj = addon.createObject();
    console.log("✓ createObject() =", obj);
  } else {
    console.log("❌ createObject 函数不可用");
  }
  
  // 性能测试
  console.log("\n⚡ 性能测试:");
  console.log("───────────");
  
  if (typeof addon.add === 'function') {
    const iterations = 1000000;
    console.time("NAPI 调用");
    
    for (let i = 0; i < iterations; i++) {
      addon.add(i % 100, (i + 1) % 100);
    }
    
    console.timeEnd("NAPI 调用");
    console.log(`✓ 完成 ${iterations.toLocaleString()} 次调用`);
  }
  
  console.log("\n🎉 所有测试完成!");
  console.log("✅ Node-API 模块工作正常");
  
} catch (error) {
  console.error("\n❌ 运行时错误:", error.message);
  console.error("错误堆栈:", error.stack);
  
  if (error.message.includes('invalid ELF header') || 
      error.message.includes('wrong architecture')) {
    console.log("\n💡 架构不匹配解决方案:");
    console.log("1. 重新构建模块: npm run clean && npm run build");
    console.log("2. 检查 Node.js 和系统架构是否匹配");
  }
  
  if (error.message.includes('undefined symbol')) {
    console.log("\n💡 符号未定义解决方案:");
    console.log("1. 检查 C++ 代码中的函数导出");
    console.log("2. 确保 binding.gyp 配置正确");
  }
  
  process.exit(1);
}
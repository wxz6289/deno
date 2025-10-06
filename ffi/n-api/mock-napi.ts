// 简化的 Node-API 风格示例（使用 Deno FFI 实现）
// 这个示例展示了如何模拟 Node-API 的功能，而不需要复杂的构建过程

console.log("🦕 Deno 模拟 Node-API 示例");
console.log("==========================");

// 模拟 Node-API 风格的函数定义
interface NodeAPIModule {
  add(a: number, b: number): number;
  multiply(a: number, b: number): number;
  hello(name: string): string;
  sumArray(arr: number[]): number;
  createObject(): { name: string; version: number; platform: string };
}

// 实现模拟的 Node-API 模块
const createMockNodeAPI = (): NodeAPIModule => {
  console.log("🔧 初始化模拟 Node-API 模块...");

  return {
    add: (a: number, b: number): number => {
      const result = a + b;
      console.log(`📊 Native add(${a}, ${b}) = ${result}`);
      return result;
    },

    multiply: (a: number, b: number): number => {
      const result = a * b;
      console.log(`📊 Native multiply(${a}, ${b}) = ${result}`);
      return result;
    },

    hello: (name: string): string => {
      const result = `Hello, ${name} from Node-API!`;
      console.log(`📝 Native hello("${name}") = "${result}"`);
      return result;
    },

    sumArray: (arr: number[]): number => {
      const sum = arr.reduce((acc, val) => acc + val, 0);
      console.log(`🔢 Native sumArray([${arr.join(',')}]) = ${sum}`);
      return sum;
    },

    createObject: () => {
      const obj = {
        name: "Deno Node-API",
        version: 1,
        platform: Deno.build.os
      };
      console.log(`🏗️  Native createObject() =`, obj);
      return obj;
    }
  };
};

// 性能测试函数
const performanceTest = (api: NodeAPIModule) => {
  console.log("\n⚡ 性能测试:");
  console.log("──────────");

  const iterations = 100000;

  // 测试数学运算性能
  console.time("数学运算");
  for (let i = 0; i < iterations; i++) {
    api.add(i, i + 1);
  }
  console.timeEnd("数学运算");

  // 测试字符串处理性能
  console.time("字符串处理");
  for (let i = 0; i < 10000; i++) {
    api.hello(`user${i}`);
  }
  console.timeEnd("字符串处理");

  // 测试数组处理性能
  console.time("数组处理");
  const testArray = [1, 2, 3, 4, 5];
  for (let i = 0; i < 10000; i++) {
    api.sumArray(testArray);
  }
  console.timeEnd("数组处理");
};

// 功能演示
const demonstrateFeatures = (api: NodeAPIModule) => {
  console.log("\n🧪 功能演示:");
  console.log("────────────");

  // 1. 基础数学运算
  console.log("\n1️⃣  数学运算:");
  api.add(15, 25);
  api.multiply(8, 9);

  // 2. 字符串处理
  console.log("\n2️⃣  字符串处理:");
  api.hello("Deno");
  api.hello("TypeScript");

  // 3. 数组操作
  console.log("\n3️⃣  数组操作:");
  api.sumArray([1, 2, 3, 4, 5]);
  api.sumArray([10, 20, 30]);

  // 4. 对象创建
  console.log("\n4️⃣  对象创建:");
  const obj = api.createObject();
  console.log("创建的对象:", obj);
};

// 内存使用监控
const monitorMemory = () => {
  if (Deno.memoryUsage) {
    const usage = Deno.memoryUsage();
    console.log("\n💾 内存使用情况:");
    console.log("────────────────");
    console.log(`RSS: ${(usage.rss / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Used: ${(usage.heapUsed / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Heap Total: ${(usage.heapTotal / 1024 / 1024).toFixed(2)} MB`);
    console.log(`External: ${(usage.external / 1024 / 1024).toFixed(2)} MB`);
  }
};

// 主函数
const main = () => {
  try {
    // 创建模拟的 Node-API 模块
    const api = createMockNodeAPI();

    // 功能演示
    demonstrateFeatures(api);

    // 性能测试
    performanceTest(api);

    // 内存监控
    monitorMemory();

    console.log("\n📋 Node-API 特性说明:");
    console.log("─────────────────────");
    console.log("✅ 高性能原生函数调用");
    console.log("✅ 类型安全的参数传递");
    console.log("✅ 自动内存管理");
    console.log("✅ 跨平台兼容性");
    console.log("✅ 与 JavaScript 无缝集成");

    console.log("\n🛠️  实际 Node-API 构建步骤:");
    console.log("──────────────────────────");
    console.log("1. 安装 Node.js 和 node-gyp");
    console.log("2. 创建 binding.gyp 配置文件");
    console.log("3. 编写 C++ 源代码");
    console.log("4. 运行 node-gyp rebuild");
    console.log("5. 在 Deno 中使用 dlopen 加载");

    console.log("\n💡 替代方案:");
    console.log("─────────────");
    console.log("• 使用 Deno FFI 直接调用 C/Rust 库");
    console.log("• 使用 WebAssembly (WASM) 模块");
    console.log("• 使用 Deno 的原生插件系统");

    console.log("\n✅ 示例运行完成!");

  } catch (error) {
    console.error("❌ 运行错误:", error);
  }
};

// 运行示例
main();

export { createMockNodeAPI, type NodeAPIModule };
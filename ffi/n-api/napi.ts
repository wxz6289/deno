// Deno 使用 Node-API 示例
// Node-API 允许在 Deno 中加载和使用 Node.js 原生模块

// 获取库文件路径
const getNodeApiLibPath = () => {
  switch (Deno.build.os) {
    case "darwin":
      return "./build/Release/napi_addon.node";
    case "windows":
      return "./build/Release/napi_addon.node";
    default:
      return "./build/Release/napi_addon.node";
  }
};

// Node-API 函数签名定义
const napiSignatures = {
  // 基础数学运算
  add: {
    parameters: ["i32", "i32"],
    result: "i32",
  },
  multiply: {
    parameters: ["i32", "i32"],
    result: "i32",
  },
  // 字符串处理
  hello: {
    parameters: ["pointer"],
    result: "pointer",
  },
  // 数组处理
  sumArray: {
    parameters: ["pointer", "i32"],
    result: "i32",
  },
} as const;

console.log("🚀 Deno Node-API 兼容性测试");
console.log("============================");

console.log("\n⚠️  重要提示:");
console.log("Node-API 模块 (.node) 无法直接用于 Deno FFI");
console.log("这是因为技术架构的根本差异");

try {
  // 尝试加载 Node-API 模块（这会失败）
  console.log("\n🔍 尝试加载 Node-API 模块...");
  const addon = Deno.dlopen(getNodeApiLibPath(), napiSignatures);
  console.log("✅ Node-API 模块加载成功");

  // 1. 测试基础数学运算
  console.log("\n🧮 基础数学运算:");
  console.log('addon:', addon.symbols);
  // const addResult = addon.symbols.add(10, 20);
  // console.log(`add(10, 20) = ${addResult}`);

  const multiplyResult = addon.symbols.multiply(6, 7);
  console.log(`multiply(6, 7) = ${multiplyResult}`);

  // 2. 测试字符串处理
  console.log("\n📝 字符串处理:");
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const inputString = "Deno";
  const cString = encoder.encode(inputString + "\0");
  const resultPtr = addon.symbols.hello(Deno.UnsafePointer.of(cString));

  if (resultPtr) {
    // 读取返回的字符串 (假设最大长度100)
    const resultView = new Deno.UnsafePointerView(resultPtr as Deno.PointerObject);
    const resultBytes = resultView.getArrayBuffer(100);
    const resultString = decoder.decode(resultBytes).split('\0')[0];
    console.log(`hello("${inputString}") = "${resultString}"`);
  }

  // 3. 测试数组处理
  console.log("\n📊 数组处理:");
  const numbers = new Int32Array([1, 2, 3, 4, 5]);
  const sum = addon.symbols.sumArray(Deno.UnsafePointer.of(numbers), numbers.length);
  console.log(`sum_array([1,2,3,4,5]) = ${sum}`);

  // 性能测试
  console.log("\n⚡ 性能测试:");
  const iterations = 100000;

  console.time("Node-API calls");
  for (let i = 0; i < iterations; i++) {
    addon.symbols.add(i, i + 1);
  }
  console.timeEnd("Node-API calls");

  addon.close();
  console.log("\n✅ Node-API 模块已关闭");

} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("\n❌ 预期的错误:", errorMessage);

  console.log("\n📚 错误分析:");
  console.log("═══════════════");
  console.log("• Node-API 模块使用 napi_set_named_property 导出 JS 函数");
  console.log("• Deno FFI 使用 dlsym 查找纯 C 函数符号");
  console.log("• 两种机制在符号层面不兼容");

  if (errorMessage.includes("No such file")) {
    console.log("\n💡 文件不存在的解决方案:");
    console.log("1. 确保已安装 Node.js 和 npm");
    console.log("2. 运行构建命令:");
    console.log("   npm install");
    console.log("   npm run build");
    console.log("3. 或者运行自动构建脚本:");
    console.log("   ./build.sh");
  } else if (errorMessage.includes("symbol not found")) {
    console.log("\n🔧 符号未找到的解决方案:");
    console.log("这是正常现象！Node-API 模块不兼容 Deno FFI");

    console.log("\n✅ 可行的替代方案:");
    console.log("━━━━━━━━━━━━━━━━━━");
    console.log("1. � 运行模拟版本 (立即可用):");
    console.log("   deno run mock-napi.ts");

    console.log("\n2. �️  编译 Deno 兼容的 C 库:");
    console.log("   ./compile_ffi.sh");
    console.log("   deno run --allow-ffi simple_ffi_demo.ts");

    console.log("\n3. 🧬 使用 WebAssembly:");
    console.log("   编译 C/Rust 为 WASM 模块");

    console.log("\n4. 🔄 进程间通信:");
    console.log("   通过子进程调用 Node.js 脚本");

    console.log("\n📖 了解技术细节:");
    console.log("   deno run compatibility-analysis.ts");
  }

  console.log("\n🎯 推荐下一步:");
  console.log("━━━━━━━━━━━━━");
  console.log("对于学习目的: deno run mock-napi.ts");
  console.log("对于生产项目: 使用 Deno FFI 或 WebAssembly");
}
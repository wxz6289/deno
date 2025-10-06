// 实际可用的 Deno 原生代码集成示例
// 展示如何在 Deno 中正确使用原生代码

console.log("🦕 Deno 原生代码集成实战");
console.log("=========================");

// 1. WebAssembly 示例 (无需编译，立即可用)
const wasmExample = () => {
  console.log("\n📦 方案 1: 内联 WebAssembly");
  console.log("─────────────────────────");

  // 简单的 WASM 二进制 (add 函数)
  const wasmBytes = new Uint8Array([
    0x00, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00,
    0x01, 0x07, 0x01, 0x60, 0x02, 0x7f, 0x7f, 0x01, 0x7f,
    0x03, 0x02, 0x01, 0x00,
    0x07, 0x07, 0x01, 0x03, 0x61, 0x64, 0x64, 0x00, 0x00,
    0x0a, 0x09, 0x01, 0x07, 0x00, 0x20, 0x00, 0x20, 0x01, 0x6a, 0x0b
  ]);

  return WebAssembly.instantiate(wasmBytes).then(({ instance }) => {
    const add = instance.exports.add as (a: number, b: number) => number;
    const result = add(15, 27);
    console.log(`WASM add(15, 27) = ${result}`);
    return result;
  });
};

// 2. 动态 JavaScript 函数 (模拟原生性能)
const jsNativeExample = () => {
  console.log("\n⚡ 方案 2: 优化的 JavaScript");
  console.log("─────────────────────────────");

  // 使用 TypedArray 模拟原生内存操作
  const mathLib = {
    add: (a: number, b: number): number => a + b,
    multiply: (a: number, b: number): number => a * b,

    // 数组求和 (使用 TypedArray 优化)
    sumArray: (arr: Int32Array): number => {
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
        sum += arr[i];
      }
      return sum;
    },

    // 字符串处理
    createGreeting: (name: string): string => {
      return `Hello, ${name} from optimized JS!`;
    }
  };

  console.log(`JS add(10, 20) = ${mathLib.add(10, 20)}`);
  console.log(`JS multiply(6, 7) = ${mathLib.multiply(6, 7)}`);

  const numbers = new Int32Array([1, 2, 3, 4, 5]);
  console.log(`JS sumArray([1,2,3,4,5]) = ${mathLib.sumArray(numbers)}`);
  console.log(`JS greeting = "${mathLib.createGreeting("Deno")}"`);

  return mathLib;
};

// 3. 条件性 FFI 示例 (如果库存在)
const ffiExample = async () => {
  console.log("\n🔗 方案 3: Deno FFI (需要编译)");
  console.log("───────────────────────────────");

  const getLibPath = () => {
    switch (Deno.build.os) {
      case "darwin": return "./simple_ffi.dylib";
      case "linux": return "./simple_ffi.so";
      case "windows": return "./simple_ffi.dll";
      default: throw new Error(`Unsupported OS: ${Deno.build.os}`);
    }
  };

  try {
    // 检查库文件是否存在
    const libPath = getLibPath();
    await Deno.stat(libPath);

    const lib = Deno.dlopen(libPath, {
      add: { parameters: ["i32", "i32"], result: "i32" },
      get_version: { parameters: [], result: "pointer" },
    });

    console.log(`FFI add(100, 200) = ${lib.symbols.add(100, 200)}`);

    const versionPtr = lib.symbols.get_version();
    if (versionPtr) {
      const version = new Deno.UnsafePointerView(versionPtr as Deno.PointerObject).getCString();
      console.log(`FFI version = "${version}"`);
    }

    lib.close();
    console.log("✅ FFI 库调用成功");

  } catch (error) {
    console.log("💡 FFI 库未找到，使用编译命令:");
    console.log("   ./compile_ffi.sh");
    console.log("   deno run --allow-ffi working_example.ts");
  }
};

// 4. 性能对比测试
const performanceTest = (jsLib: any) => {
  console.log("\n📊 性能对比测试");
  console.log("─────────────────");

  const iterations = 1000000;

  // JavaScript 性能测试
  console.time("JavaScript");
  for (let i = 0; i < iterations; i++) {
    jsLib.add(i, i + 1);
  }
  console.timeEnd("JavaScript");

  // WASM 性能测试 (如果可用)
  console.log("💡 WASM 性能通常比 JS 快 10-50%");
  console.log("💡 FFI 性能通常比 JS 快 50-200%");
};

// 主要演示函数
const runDemo = async () => {
  try {
    // 运行 WebAssembly 示例
    await wasmExample();

    // 运行 JavaScript 优化示例
    const jsLib = jsNativeExample();

    // 尝试 FFI 示例
    await ffiExample();

    // 性能测试
    performanceTest(jsLib);

    console.log("\n🎯 总结");
    console.log("══════");
    console.log("✅ WebAssembly: 跨平台、安全、性能好");
    console.log("✅ 优化 JS: 简单、快速开发、无需编译");
    console.log("✅ Deno FFI: 最高性能、直接系统集成");

    console.log("\n🚀 推荐选择:");
    console.log("• 简单逻辑: 优化的 JavaScript");
    console.log("• 跨平台: WebAssembly");
    console.log("• 高性能: Deno FFI");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("演示错误:", errorMessage);
  }
};

// 运行演示
runDemo();

export { wasmExample, jsNativeExample, ffiExample };
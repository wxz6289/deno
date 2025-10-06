// Deno FFI 示例 - 调用简单的 C 函数
// 这个示例展示了如何正确使用 Deno FFI

console.log("🦕 Deno FFI 示例");
console.log("================");

// 获取库文件路径
const getLibPath = () => {
  switch (Deno.build.os) {
    case "darwin":
      return "./simple_ffi.dylib";
    case "linux":
      return "./simple_ffi.so";
    case "windows":
      return "./simple_ffi.dll";
    default:
      throw new Error(`不支持的操作系统: ${Deno.build.os}`);
  }
};

// 定义 FFI 函数签名
const ffiSignatures = {
  add: {
    parameters: ["i32", "i32"],
    result: "i32",
  },
  multiply: {
    parameters: ["i32", "i32"],
    result: "i32",
  },
  get_greeting: {
    parameters: [],
    result: "pointer",
  },
  sum_array: {
    parameters: ["pointer", "i32"],
    result: "i32",
  },
  create_message: {
    parameters: ["pointer"],
    result: "pointer",
  },
  get_version: {
    parameters: [],
    result: "pointer",
  },
} as const;

const demonstrateFFI = () => {
  try {
    console.log("🔗 加载 C FFI 库...");
    const lib = Deno.dlopen(getLibPath(), ffiSignatures);
    console.log("✅ FFI 库加载成功");

    // 1. 测试数学运算
    console.log("\n🧮 数学运算测试:");
    console.log("─────────────────");
    const addResult = lib.symbols.add(15, 25);
    console.log(`add(15, 25) = ${addResult}`);

    const multiplyResult = lib.symbols.multiply(8, 7);
    console.log(`multiply(8, 7) = ${multiplyResult}`);

    // 2. 测试字符串函数
    console.log("\n📝 字符串处理测试:");
    console.log("──────────────────");

    const greetingPtr = lib.symbols.get_greeting();
    if (greetingPtr) {
      const greetingView = new Deno.UnsafePointerView(greetingPtr as Deno.PointerObject);
      const greeting = greetingView.getCString();
      console.log(`get_greeting() = "${greeting}"`);
    }

    const versionPtr = lib.symbols.get_version();
    if (versionPtr) {
      const versionView = new Deno.UnsafePointerView(versionPtr as Deno.PointerObject);
      const version = versionView.getCString();
      console.log(`get_version() = "${version}"`);
    }

    // 3. 测试字符串参数
    console.log("\n🔤 字符串参数测试:");
    console.log("──────────────────");
    const encoder = new TextEncoder();
    const nameBytes = encoder.encode("Deno\0");
    const messagePtr = lib.symbols.create_message(Deno.UnsafePointer.of(nameBytes));

    if (messagePtr) {
      const messageView = new Deno.UnsafePointerView(messagePtr as Deno.PointerObject);
      const message = messageView.getCString();
      console.log(`create_message("Deno") = "${message}"`);
    }

    // 4. 测试数组处理
    console.log("\n📊 数组处理测试:");
    console.log("─────────────────");
    const numbers = new Int32Array([1, 2, 3, 4, 5]);
    const sum = lib.symbols.sum_array(Deno.UnsafePointer.of(numbers), numbers.length);
    console.log(`sum_array([1,2,3,4,5]) = ${sum}`);

    // 5. 性能测试
    console.log("\n⚡ 性能测试:");
    console.log("───────────");
    const iterations = 1000000;

    console.time("FFI 调用");
    for (let i = 0; i < iterations; i++) {
      lib.symbols.add(i % 100, (i + 1) % 100);
    }
    console.timeEnd("FFI 调用");

    // 关闭库
    lib.close();
    console.log("\n✅ FFI 库已关闭");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ FFI 错误:", errorMessage);

    if (errorMessage.includes("No such file")) {
      console.log("\n💡 解决方案:");
      console.log("1. 编译 C 库:");
      console.log("   ./compile_ffi.sh");
      console.log("2. 检查文件是否存在:");
      console.log(`   ls -la ${getLibPath()}`);
    }
  }
};

const showComparison = () => {
  console.log("\n📊 Node-API vs Deno FFI 对比:");
  console.log("══════════════════════════════");

  console.log("\n🔴 Node-API 模块 (.node):");
  console.log("• 需要 Node.js 运行时");
  console.log("• 自动类型转换");
  console.log("• JavaScript 函数包装");
  console.log("• 不能直接用于 Deno FFI");

  console.log("\n🟢 Deno FFI 库 (.so/.dylib/.dll):");
  console.log("• 原生 C 函数符号");
  console.log("• 手动类型定义");
  console.log("• 直接内存操作");
  console.log("• 更好的性能控制");

  console.log("\n💡 关键区别:");
  console.log("Node-API: napi_set_named_property → JavaScript 对象");
  console.log("Deno FFI: dlsym → 直接 C 函数指针");
};

// 运行演示
console.log("🎯 正在演示正确的 Deno FFI 用法...\n");
showComparison();
demonstrateFFI();

export { };
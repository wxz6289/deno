// 原始 FFI 方式 - 绕过 deno_bindgen 的符号问题
// 这是一个更可靠的解决方案

const libName = (() => {
  switch (Deno.build.os) {
    case "windows": return "./target/release/deno_bindgen_learn.dll";
    case "darwin": return "./target/release/libdeno_bindgen_learn.dylib";
    default: return "./target/release/libdeno_bindgen_learn.so";
  }
})();

console.log("🔧 原始 FFI 解决方案");
console.log("===================");
console.log(`📚 库文件: ${libName}`);
console.log("");

try {
  // 使用原始 FFI 而不是 deno_bindgen 生成的绑定
  const lib = Deno.dlopen(libName, {
    // 基础数学函数
    add: {
      parameters: ["i32", "i32"],
      result: "i32",
    },
    multiply: {
      parameters: ["i32", "i32"],
      result: "i32",
    },
    // 布尔函数（返回 i32）
    is_even: {
      parameters: ["i32"],
      result: "i32",
    },
    // 字符串函数
    greet: {
      parameters: ["buffer", "usize"],
      result: "pointer",
    },
  });

  console.log("✅ 成功加载库文件！");
  console.log("");

  // 测试数学函数
  console.log("🧮 数学函数测试:");
  console.log(`   add(10, 20) = ${lib.symbols.add(10, 20)}`);
  console.log(`   multiply(7, 8) = ${lib.symbols.multiply(7, 8)}`);
  console.log("");

  // 测试布尔函数
  console.log("🔍 布尔函数测试:");
  const numbers = [1, 2, 3, 4, 5, 6, 7, 8];
  for (const num of numbers) {
    const result = lib.symbols.is_even(num);
    const isEven = result !== 0;
    console.log(`   ${num} is even: ${isEven} (raw: ${result})`);
  }
  console.log("");

  // 测试字符串函数（简化版本）
  console.log("📝 字符串函数测试:");
  const name = "Deno";
  const encoder = new TextEncoder();
  const nameBytes = encoder.encode(name);

  try {
    // 注意：这里需要正确处理字符串传递，可能需要调整
    console.log("   字符串函数需要特殊处理，跳过测试");
  } catch (e) {
    console.log(`   字符串测试跳过: ${e}`);
  }

  console.log("");
  console.log("🎉 原始 FFI 方案成功！");
  console.log("💡 优势:");
  console.log("   - 避开 deno_bindgen 符号问题");
  console.log("   - 完全控制函数签名");
  console.log("   - 更好的兼容性");
  console.log("   - 更少的依赖");

  lib.close();

} catch (error) {
  console.error("❌ 错误:", error);
  console.log("");
  console.log("🔧 可能的解决方案:");
  console.log("1. 确保 Rust 库已正确编译");
  console.log("2. 检查函数符号是否正确导出");
  console.log("3. 验证库文件路径");
  console.log("4. 使用 nm 或 objdump 检查符号表");
}
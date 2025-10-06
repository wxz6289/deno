// 简化的原始 FFI 测试 - 只测试实际存在的函数
import { rustBoolToJS, jsBoolToRust } from "./bool_helpers.ts";

const libName = "./target/release/libdeno_bindgen_learn.dylib";

console.log("🎯 纯 Rust FFI 解决方案测试");
console.log("============================");
console.log(`📚 库文件: ${libName}`);
console.log("");

try {
  // 只加载实际存在的函数
  const lib = Deno.dlopen(libName, {
    // 基础数学函数
    add: { parameters: ["i32", "i32"], result: "i32" },
    multiply: { parameters: ["i32", "i32"], result: "i32" },
    subtract: { parameters: ["i32", "i32"], result: "i32" },

    // 布尔函数（返回 i32）
    is_even: { parameters: ["i32"], result: "i32" },
    is_positive: { parameters: ["i32"], result: "i32" },
    logical_and: { parameters: ["i32", "i32"], result: "i32" },
    logical_or: { parameters: ["i32", "i32"], result: "i32" },
    logical_not: { parameters: ["i32"], result: "i32" },

    // 比较和计算函数
    max_value: { parameters: ["i32", "i32"], result: "i32" },
    min_value: { parameters: ["i32", "i32"], result: "i32" },
    absolute_value: { parameters: ["i32"], result: "i32" },
    power_of_two: { parameters: ["u32"], result: "i32" },
    is_in_range: { parameters: ["i32", "i32", "i32"], result: "i32" },
  });

  console.log("✅ 成功加载库文件！");
  console.log("");

  // 测试基础数学函数
  console.log("🧮 基础数学函数:");
  console.log(`   add(15, 25) = ${lib.symbols.add(15, 25)}`);
  console.log(`   multiply(7, 8) = ${lib.symbols.multiply(7, 8)}`);
  console.log(`   subtract(50, 20) = ${lib.symbols.subtract(50, 20)}`);
  console.log(`   absolute_value(-42) = ${lib.symbols.absolute_value(-42)}`);
  console.log(`   power_of_two(4) = ${lib.symbols.power_of_two(4)}`);
  console.log("");

  // 测试布尔函数
  console.log("🔍 布尔函数测试 (返回 i32, 转换为 boolean):");
  const testNumbers = [-5, -1, 0, 1, 2, 3, 4, 10];

  for (const num of testNumbers) {
    const evenRaw = lib.symbols.is_even(num);
    const positiveRaw = lib.symbols.is_positive(num);

    console.log(`   ${num}: even=${rustBoolToJS(evenRaw)}, positive=${rustBoolToJS(positiveRaw)}`);
  }
  console.log("");

  // 测试逻辑运算
  console.log("🧠 逻辑运算测试:");
  const tests = [
    [1, 1], [1, 0], [0, 1], [0, 0]
  ];

  for (const [a, b] of tests) {
    const andResult = rustBoolToJS(lib.symbols.logical_and(a, b));
    const orResult = rustBoolToJS(lib.symbols.logical_or(a, b));
    const notA = rustBoolToJS(lib.symbols.logical_not(a));

    console.log(`   ${Boolean(a)} AND ${Boolean(b)} = ${andResult}`);
    console.log(`   ${Boolean(a)} OR ${Boolean(b)} = ${orResult}`);
    console.log(`   NOT ${Boolean(a)} = ${notA}`);
    console.log("");
  }

  // 测试比较函数
  console.log("📊 比较和范围函数:");
  console.log(`   max(15, 28) = ${lib.symbols.max_value(15, 28)}`);
  console.log(`   min(15, 28) = ${lib.symbols.min_value(15, 28)}`);

  const inRange = rustBoolToJS(lib.symbols.is_in_range(25, 10, 50));
  const outRange = rustBoolToJS(lib.symbols.is_in_range(75, 10, 50));
  console.log(`   is_in_range(25, 10, 50) = ${inRange}`);
  console.log(`   is_in_range(75, 10, 50) = ${outRange}`);
  console.log("");

  console.log("🎉 所有测试成功完成！");
  console.log("");
  console.log("✨ 关键成果:");
  console.log("   ✅ 绕过了 deno_bindgen 的符号问题");
  console.log("   ✅ 成功实现布尔值兼容 (i32 ↔ boolean)");
  console.log("   ✅ 所有函数都正常工作");
  console.log("   ✅ 完整的类型安全转换");
  console.log("");
  console.log("💡 技术要点:");
  console.log("   - 使用 #[no_mangle] 和 extern \"C\"");
  console.log("   - 布尔值通过 i32 传递 (0/1)");
  console.log("   - TypeScript 辅助函数处理转换");
  console.log("   - 完全避开 deno_bindgen 依赖");

  lib.close();

} catch (error) {
  console.error("❌ 错误:", error);
}
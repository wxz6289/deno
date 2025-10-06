// 简化的 FFI 测试
console.log("🚀 开始 FFI 测试...");

try {
  const lib = Deno.dlopen("./libsleep.so", {
    sleep_ms: {
      parameters: ["u32"],
      result: "i32",
    },
  });

  console.log("✅ 共享库加载成功");

  // 测试调用
  console.log("🧪 测试睡眠 100ms...");
  const start = performance.now();
  const result = lib.symbols.sleep_ms(100);
  const end = performance.now();

  console.log(`📊 结果:`);
  console.log(`  - 返回值: ${result}`);
  console.log(`  - 耗时: ${Math.round(end - start)}ms`);
  console.log(`  - 状态: ${result === 0 ? '✅ 成功' : '❌ 失败'}`);

  // 关闭库
  lib.close();
  console.log("🔒 库已关闭");

} catch (error) {
  console.error("❌ 错误:", error);
  console.log("💡 请确保已运行: ./build.sh");
}
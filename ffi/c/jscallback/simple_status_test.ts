// 简化的 checkStatus 函数测试
console.log("🔍 测试 checkStatus 函数");

try {
  const dylib = Deno.dlopen("./libjscallback.dylib", {
    setCallback: { parameters: ["function"], result: "void" },
    runCallback: { parameters: [], result: "void" },
    checkStatus: { parameters: [], result: "i32" }
  });

  console.log("✅ 库加载成功");

  // 测试初始状态
  console.log("\n1. 检查初始状态:");
  let status = dylib.symbols.checkStatus();
  console.log(`   状态: ${status} (${status ? '已设置' : '未设置'})`);

  // 设置回调
  console.log("\n2. 设置回调函数:");
  const callback = new Deno.UnsafeCallback(
    { parameters: ["i32"], result: "void" },
    (value: number) => console.log(`   🎯 回调接收: ${value}`)
  );

  dylib.symbols.setCallback(callback.pointer);

  // 检查设置后状态
  status = dylib.symbols.checkStatus();
  console.log(`   状态: ${status} (${status ? '已设置' : '未设置'})`);

  // 运行回调
  console.log("\n3. 运行回调:");
  dylib.symbols.runCallback();

  // 再次检查状态
  console.log("\n4. 最终状态检查:");
  status = dylib.symbols.checkStatus();
  console.log(`   状态: ${status} (${status ? '已设置' : '未设置'})`);

  dylib.close();
  callback.close();
  console.log("\n✅ 测试完成");

} catch (error) {
  console.error("❌ 错误:", error);
}
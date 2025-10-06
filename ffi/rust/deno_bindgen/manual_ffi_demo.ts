
// 模拟从编译的库中调用函数
const libName = "./target/release/libdeno_bindgen_learn.dylib";

try {
  // 打开动态库
  const dylib = Deno.dlopen(libName, {
    add: {
      parameters: ["i32", "i32"],
      result: "i32"
    },
    is_even: {
      parameters: ["i32"],
      result: "i32"  // 注意：这里是 i32 而不是 bool
    }
  });

  console.log("✅ 成功加载动态库");
  console.log("");

  // 测试基础函数
  console.log("🧪 测试基础函数:");
  const sum = dylib.symbols.add(5, 3);
  console.log(`   add(5, 3) = ${sum}`);
  console.log("");

  console.log("🔍 测试布尔函数（返回 i32）:");
  const even4 = dylib.symbols.is_even(4);
  const even5 = dylib.symbols.is_even(5);

  console.log(`   is_even(4) = ${even4}`);
  console.log(`   is_even(5) = ${even5}`);
  console.log("");
  dylib.close();

} catch (error) {
  console.log(`❌ 错误: ${error instanceof Error ? error.message : String(error)}`);
}

export { };
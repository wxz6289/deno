// 高级 FFI 示例 - 调用 advanced.c 中的函数

const getAdvancedLibPath = () => {
  switch (Deno.build.os) {
    case "darwin":
      return "./libadvanced.dylib";
    case "windows":
      return "./advanced.dll";
    default:
      return "./libadvanced.so";
  }
};

console.log("🚀 高级 FFI 示例");
console.log("================");

try {
  const dylib = Deno.dlopen(getAdvancedLibPath(), {
    // 基础数学运算
    add: { parameters: ["i32", "i32"], result: "i32" },
    multiply: { parameters: ["i32", "i32"], result: "i32" },

    // 浮点数运算
    add_double: { parameters: ["f64", "f64"], result: "f64" },

    // 字符串处理
    string_length: { parameters: ["pointer"], result: "i32" },

    // 数组处理
    sum_array: { parameters: ["pointer", "i32"], result: "i32" },

    // 指针操作
    increment: { parameters: ["pointer"], result: "void" },

    // 调试函数
    debug_print: { parameters: ["pointer"], result: "void" },
  });

  console.log("✅ 高级共享库加载成功\n");

  // 1. 测试基础数学运算
  console.log("🧮 基础数学运算:");
  console.log(`add(10, 20) = ${dylib.symbols.add(10, 20)}`);
  console.log(`multiply(6, 7) = ${dylib.symbols.multiply(6, 7)}`);

  // 2. 测试浮点数运算
  console.log("\n🔢 浮点数运算:");
  console.log(`add_double(3.14, 2.86) = ${dylib.symbols.add_double(3.14, 2.86)}`);

  // 3. 测试字符串长度
  console.log("\n📝 字符串处理:");
  const encoder = new TextEncoder();
  const testString = "Hello, Deno FFI!";
  const cString = encoder.encode(testString + "\0"); // 添加 null 终止符

  const length = dylib.symbols.string_length(Deno.UnsafePointer.of(cString));
  console.log(`string_length("${testString}") = ${length}`);

  // 4. 测试数组求和
  console.log("\n📊 数组处理:");
  const numbers = new Int32Array([1, 2, 3, 4, 5]);
  const sum = dylib.symbols.sum_array(Deno.UnsafePointer.of(numbers), numbers.length);
  console.log(`sum_array([1,2,3,4,5]) = ${sum}`);

  // 5. 测试指针操作
  console.log("\n👆 指针操作:");
  const value = new Int32Array([42]);
  console.log(`Before increment: ${value[0]}`);
  dylib.symbols.increment(Deno.UnsafePointer.of(value));
  console.log(`After increment: ${value[0]}`);

  // 6. 测试调试打印
  console.log("\n🐛 调试输出:");
  const debugMsg = encoder.encode("Hello from Deno!\0");
  dylib.symbols.debug_print(Deno.UnsafePointer.of(debugMsg));

  // 性能测试
  console.log("\n⚡ 性能测试:");
  const iterations = 100000;

  console.time("FFI calls");
  for (let i = 0; i < iterations; i++) {
    dylib.symbols.add(i, i + 1);
  }
  console.timeEnd("FFI calls");

  dylib.close();
  console.log("\n✅ 高级共享库已关闭");

} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ 错误:", errorMessage);

  if (errorMessage.includes("No such file")) {
    console.log("\n💡 解决方案:");
    console.log("1. 编译高级共享库:");
    switch (Deno.build.os) {
      case "darwin":
        console.log("   gcc -shared -fPIC -o libadvanced.dylib advanced.c");
        break;
      case "windows":
        console.log("   gcc -shared -o advanced.dll advanced.c");
        break;
      default:
        console.log("   gcc -shared -fPIC -o libadvanced.so advanced.c");
    }
    console.log("2. 或使用 make 命令: make advanced");
  }
}
// Deno FFI 调用 C 语言共享库示例
// 使用 add.c 编译的共享库

// 根据操作系统确定库文件路径
const getLibPath = () => {
  switch (Deno.build.os) {
    case "darwin":
      return "./libadd.dylib";
    case "windows":
      return "./add.dll";
    default: // linux
      return "./libadd.so";
  }
};

const libPath = getLibPath();
console.log(`📚 加载共享库: ${libPath}`);

try {
  // 打开动态库
  const dylib = Deno.dlopen(libPath, {
    add: {
      parameters: ["i32", "i32"],  // 两个 32 位整数参数
      result: "i32",               // 返回 32 位整数
    },
  });

  console.log("✅ 共享库加载成功");

  // 测试 add 函数
  const testCases = [
    { a: 5, b: 3 },
    { a: 10, b: 20 },
    { a: -5, b: 15 },
    { a: 0, b: 0 },
    { a: 100, b: -50 },
  ];

  console.log("\n🧪 测试 add 函数:");
  console.log("================");

  for (const { a, b } of testCases) {
    const result = dylib.symbols.add(a, b);
    console.log(`add(${a}, ${b}) = ${result}`);
  }

  // 性能测试
  console.log("\n⚡ 性能测试:");
  console.log("===========");

  const iterations = 1000000;
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    dylib.symbols.add(i, i + 1);
  }

  const end = performance.now();
  const totalTime = end - start;
  const avgTime = totalTime / iterations;

  console.log(`执行 ${iterations.toLocaleString()} 次调用`);
  console.log(`总时间: ${totalTime.toFixed(2)}ms`);
  console.log(`平均时间: ${(avgTime * 1000).toFixed(4)}μs per call`);

  // 关闭动态库
  dylib.close();
  console.log("\n✅ 共享库已关闭");

} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ 错误:", errorMessage);

  if (errorMessage.includes("No such file")) {
    console.log("\n💡 解决方案:");
    console.log("1. 确保已编译共享库文件");
    console.log("2. 运行编译命令:");
    switch (Deno.build.os) {
      case "darwin":
        console.log("   gcc -shared -fPIC -o libadd.dylib add.c");
        break;
      case "windows":
        console.log("   gcc -shared -o add.dll add.c");
        break;
      default:
        console.log("   gcc -shared -fPIC -o libadd.so add.c");
    }
    console.log("3. 然后重新运行此脚本");
  }
}
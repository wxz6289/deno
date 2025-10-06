// JavaScript 回调函数 FFI 示例

// 获取库文件路径
const getLibPath = () => {
  switch (Deno.build.os) {
    case "darwin":
      return "./libjscallback.dylib";
    case "windows":
      return "./jscallback.dll";
    default:
      return "./libjscallback.so";
  }
};

const signatures = {
  setCallback: {
    parameters: ["function"],
    result: "void",
  },
  runCallback: {
    parameters: [],
    result: "void",
  },
  checkStatus: {
    parameters: [],
    result: "i32",
  }
} as const;

console.log("🔗 JavaScript 回调函数 FFI 示例");
console.log("===============================");

try {
  // 创建回调函数
  const callback = new Deno.UnsafeCallback(
    {
      parameters: ["i32"],
      result: "void",
    },
    (value: number) => {
      console.log("🎯 JavaScript 回调被调用，接收到值:", value);
    },
  );

  // 加载动态库
  const dylib = Deno.dlopen(getLibPath(), signatures);
  console.log("✅ 共享库加载成功");

  // 设置回调函数
  console.log("📤 设置 JavaScript 回调函数...");
  dylib.symbols.setCallback(callback.pointer);

  // 运行回调函数
  console.log("🚀 从 C 代码触发回调...");
  dylib.symbols.runCallback();

  const status = dylib.symbols.checkStatus();
  console.log("📊 C 代码状态:", status);

  // 清理资源
  dylib.close();
  callback.close();
  console.log("✅ 资源已清理");

} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ 错误:", errorMessage);

  if (errorMessage.includes("No such file")) {
    console.log("\n💡 解决方案:");
    console.log("1. 运行编译脚本:");
    console.log("   chmod +x build.sh && ./build.sh");
    console.log("2. 或手动编译:");
    switch (Deno.build.os) {
      case "darwin":
        console.log("   gcc -shared -fPIC -o libjscallback.dylib jscallback.c");
        break;
      case "windows":
        console.log("   gcc -shared -o jscallback.dll jscallback.c");
        break;
      default:
        console.log("   gcc -shared -fPIC -o libjscallback.so jscallback.c");
    }
  }
}
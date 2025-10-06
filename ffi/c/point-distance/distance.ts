// 计算两点之间距离的 FFI 示例

// 首先需要加载动态库
const getLibPath = () => {
  switch (Deno.build.os) {
    case "darwin":
      return "./libdistance.dylib";
    case "windows":
      return "./distance.dll";
    default:
      return "./libdistance.so";
  }
};

// 定义函数签名
const signatures = {
  distance: {
    parameters: ["pointer", "pointer"],
    result: "f64",
  },
} as const;

try {
  // 加载动态库
  const dylib = Deno.dlopen(getLibPath(), signatures);

  // 创建点的数据结构
  // Point1: (1.0, 2.0)
  const point1Data = new Float64Array([1.0, 2.0]);
  const point1 = Deno.UnsafePointer.of(point1Data);

  // Point2: (4.0, 6.0)
  const point2Data = new Float64Array([4.0, 6.0]);
  const point2 = Deno.UnsafePointer.of(point2Data);

  // 调用 C 函数计算距离
  const dist = dylib.symbols.distance(point1, point2);
  console.log("Distance:", dist);

  // 关闭动态库
  dylib.close();

} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ 错误:", errorMessage);

  if (errorMessage.includes("No such file")) {
    console.log("\n💡 需要先创建 C 源文件和编译:");
    console.log("1. 创建 distance.c 文件");
    console.log("2. 编译命令:");
    switch (Deno.build.os) {
      case "darwin":
        console.log("   gcc -shared -fPIC -o libdistance.dylib distance.c -lm");
        break;
      case "windows":
        console.log("   gcc -shared -o distance.dll distance.c -lm");
        break;
      default:
        console.log("   gcc -shared -fPIC -o libdistance.so distance.c -lm");
    }
  }
}
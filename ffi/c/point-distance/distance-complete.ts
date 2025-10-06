// 完整的距离计算 FFI 示例

const getDistanceLibPath = () => {
  switch (Deno.build.os) {
    case "darwin":
      return "./libdistance.dylib";
    case "windows":
      return "./distance.dll";
    default:
      return "./libdistance.so";
  }
};

const distanceSignatures = {
  distance: {
    parameters: ["pointer", "pointer"],
    result: "f64",
  },
  create_point: {
    parameters: ["f64", "f64"],
    result: { struct: ["f64", "f64"] },
  },
  print_point: {
    parameters: ["pointer"],
    result: "void",
  },
} as const;

try {
  console.log("🧮 距离计算 FFI 示例");
  console.log("==================");

  const dylib = Deno.dlopen(getDistanceLibPath(), distanceSignatures);
  console.log("✅ 共享库加载成功");

  // 方法1: 使用 Float64Array 创建点数据
  console.log("\n📍 方法1: 使用 Float64Array");

  // Point1: (1.0, 2.0)
  const point1Data = new Float64Array([1.0, 2.0]);
  const point1 = Deno.UnsafePointer.of(point1Data);

  // Point2: (4.0, 6.0)
  const point2Data = new Float64Array([4.0, 6.0]);
  const point2 = Deno.UnsafePointer.of(point2Data);

  // 计算距离
  const distance1 = dylib.symbols.distance(point1, point2);
  console.log(`Point1(${point1Data[0]}, ${point1Data[1]}) 到 Point2(${point2Data[0]}, ${point2Data[1]}) 的距离: ${distance1}`);

  // 验证计算结果 (应该是 5.0)
  const expectedDistance = Math.sqrt((4 - 1) ** 2 + (6 - 2) ** 2);
  console.log(`JavaScript 计算结果: ${expectedDistance}`);
  console.log(`结果匹配: ${Math.abs(distance1 - expectedDistance) < 0.0001 ? '✅' : '❌'}`);

  // 方法2: 测试更多点
  console.log("\n📍 方法2: 批量测试");

  const testCases = [
    { p1: [0, 0], p2: [3, 4], expected: 5 },      // 3-4-5 直角三角形
    { p1: [0, 0], p2: [1, 1], expected: Math.sqrt(2) },
    { p1: [-1, -1], p2: [1, 1], expected: Math.sqrt(8) },
    { p1: [10, 20], p2: [13, 24], expected: 5 },
  ];

  for (const testCase of testCases) {
    const p1Data = new Float64Array(testCase.p1);
    const p2Data = new Float64Array(testCase.p2);
    const p1Ptr = Deno.UnsafePointer.of(p1Data);
    const p2Ptr = Deno.UnsafePointer.of(p2Data);

    const result = dylib.symbols.distance(p1Ptr, p2Ptr);
    const isCorrect = Math.abs(result - testCase.expected) < 0.0001;

    console.log(`Point(${testCase.p1[0]}, ${testCase.p1[1]}) 到 Point(${testCase.p2[0]}, ${testCase.p2[1]}): ${result.toFixed(4)} ${isCorrect ? '✅' : '❌'}`);
  }

  // 性能测试
  console.log("\n⚡ 性能测试:");
  const iterations = 100000;
  const perfPoint1 = new Float64Array([0, 0]);
  const perfPoint2 = new Float64Array([3, 4]);
  const perfPtr1 = Deno.UnsafePointer.of(perfPoint1);
  const perfPtr2 = Deno.UnsafePointer.of(perfPoint2);

  console.time("FFI distance calls");
  for (let i = 0; i < iterations; i++) {
    dylib.symbols.distance(perfPtr1, perfPtr2);
  }
  console.timeEnd("FFI distance calls");

  // 对比 JavaScript 原生计算性能
  console.time("JavaScript distance calls");
  for (let i = 0; i < iterations; i++) {
    Math.sqrt((3 - 0) ** 2 + (4 - 0) ** 2);
  }
  console.timeEnd("JavaScript distance calls");

  dylib.close();
  console.log("\n✅ 测试完成，共享库已关闭");

} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.error("❌ 错误:", errorMessage);

  if (errorMessage.includes("No such file")) {
    console.log("\n💡 解决方案:");
    console.log("1. 确保 distance.c 文件存在");
    console.log("2. 编译共享库:");
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
    console.log("3. 然后重新运行: deno run --allow-ffi distance-complete.ts");
  }
}
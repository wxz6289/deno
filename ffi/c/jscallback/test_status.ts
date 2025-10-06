// 增强的 JavaScript 回调函数测试
// 展示 checkStatus 函数的详细功能

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

async function testCallbackStatus() {
  console.log("🧪 JavaScript 回调函数状态测试");
  console.log("================================");

  try {
    // 加载动态库
    const dylib = Deno.dlopen(getLibPath(), signatures);
    console.log("✅ 共享库加载成功\n");

    // 测试 1: 初始状态检查
    console.log("📊 测试 1: 检查初始状态");
    console.log("------------------------");
    let status = dylib.symbols.checkStatus();
    console.log(`状态码: ${status} (${status === 1 ? '已设置' : '未设置'})\n`);

    // 测试 2: 尝试运行未设置的回调
    console.log("📊 测试 2: 尝试运行未设置的回调");
    console.log("---------------------------");
    dylib.symbols.runCallback();
    console.log("");

    // 测试 3: 设置回调函数
    console.log("📊 测试 3: 设置回调函数");
    console.log("--------------------");
    const callback = new Deno.UnsafeCallback(
      {
        parameters: ["i32"],
        result: "void",
      },
      (value: number) => {
        console.log(`🎯 JavaScript 回调被调用！接收值: ${value}`);
      },
    );

    dylib.symbols.setCallback(callback.pointer);

    // 检查设置后的状态
    status = dylib.symbols.checkStatus();
    console.log(`状态码: ${status} (${status === 1 ? '已设置' : '未设置'})\n`);

    // 测试 4: 运行已设置的回调
    console.log("📊 测试 4: 运行已设置的回调");
    console.log("------------------------");
    dylib.symbols.runCallback();
    console.log("");

    // 测试 5: 多次状态检查
    console.log("📊 测试 5: 多次状态检查");
    console.log("--------------------");
    for (let i = 1; i <= 3; i++) {
      status = dylib.symbols.checkStatus();
      console.log(`第${i}次检查 - 状态码: ${status}`);
    }
    console.log("");

    // 测试 6: 状态检查的性能
    console.log("📊 测试 6: 状态检查性能");
    console.log("---------------------");
    const iterations = 10000;
    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      dylib.symbols.checkStatus();
    }

    const end = performance.now();
    const totalTime = end - start;
    const avgTime = totalTime / iterations;

    console.log(`执行${iterations}次状态检查:`);
    console.log(`总时间: ${totalTime.toFixed(2)}ms`);
    console.log(`平均时间: ${(avgTime * 1000).toFixed(3)}μs/次`);
    console.log(`每秒可检查: ${Math.round(iterations / (totalTime / 1000))}次\n`);

    // 清理资源
    dylib.close();
    callback.close();
    console.log("✅ 测试完成，资源已清理");

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ 错误:", errorMessage);

    if (errorMessage.includes("No such file")) {
      console.log("\n💡 解决方案:");
      console.log("1. 运行编译脚本:");
      console.log("   chmod +x build.sh && ./build.sh");
    }
  }
}

// 创建一个演示函数，展示实际应用场景
async function demoRealWorldUsage() {
  console.log("\n🌟 实际应用场景演示");
  console.log("==================");

  try {
    const dylib = Deno.dlopen(getLibPath(), signatures);

    // 模拟一个事件处理系统
    console.log("🎭 模拟事件处理系统...");

    // 检查是否有事件处理器
    if (dylib.symbols.checkStatus() === 0) {
      console.log("⚠️  警告: 没有设置事件处理器");

      // 设置事件处理器
      const eventHandler = new Deno.UnsafeCallback(
        {
          parameters: ["i32"],
          result: "void",
        },
        (eventCode: number) => {
          switch (eventCode) {
            case 42:
              console.log("🔔 收到通知事件");
              break;
            case 100:
              console.log("⚡ 收到高优先级事件");
              break;
            default:
              console.log(`📨 收到未知事件: ${eventCode}`);
          }
        },
      );

      dylib.symbols.setCallback(eventHandler.pointer);
      console.log("✅ 事件处理器已注册");
    }

    // 定期检查状态并触发事件
    for (let i = 0; i < 3; i++) {
      console.log(`\n🔄 第${i + 1}轮事件处理:`);

      if (dylib.symbols.checkStatus() === 1) {
        console.log("   ✓ 事件处理器状态正常");
        dylib.symbols.runCallback();
      } else {
        console.log("   ✗ 事件处理器状态异常");
      }

      // 模拟处理间隔
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    dylib.close();
    console.log("\n✅ 事件系统已关闭");

  } catch (error) {
    console.error("❌ 演示失败:", error);
  }
}

// 运行测试
if (import.meta.main) {
  // await testCallbackStatus();
  await demoRealWorldUsage();
}
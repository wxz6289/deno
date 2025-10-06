// 完整的跨平台睡眠函数演示
import { sleepMs, precisionSleep, testSleep } from "./sleep_ffi.ts";

async function demoUsage() {
  console.log("🎯 跨平台睡眠函数使用演示\n");

  // 1. 基础使用
  console.log("📝 1. 基础使用示例:");
  console.log("   await sleepMs(500); // 睡眠500毫秒");

  const start1 = performance.now();
  await sleepMs(500);
  const end1 = performance.now();
  console.log(`   ✅ 实际耗时: ${Math.round(end1 - start1)}ms\n`);

  // 2. 精确睡眠
  console.log("📝 2. 精确睡眠示例:");
  console.log("   await precisionSleep(1000); // 精确睡眠1秒");

  const start2 = performance.now();
  await precisionSleep(1000);
  const end2 = performance.now();
  console.log(`   ✅ 实际耗时: ${Math.round(end2 - start2)}ms\n`);

  // 3. 并发睡眠
  console.log("📝 3. 并发睡眠示例:");
  console.log("   Promise.all([sleepMs(300), sleepMs(300)]); // 并发执行");

  const start3 = performance.now();
  await Promise.all([
    sleepMs(300),
    sleepMs(300),
    sleepMs(300)
  ]);
  const end3 = performance.now();
  console.log(`   ✅ 三个并发睡眠实际耗时: ${Math.round(end3 - start3)}ms\n`);

  // 4. 循环睡眠
  console.log("📝 4. 循环睡眠示例:");
  console.log("   定时器效果 - 每200ms输出一次");

  for (let i = 1; i <= 5; i++) {
    await sleepMs(200);
    console.log(`   ⏰ 第${i}次输出 (${i * 200}ms)`);
  }

  console.log("\n🎉 演示完成！");
}

async function performanceComparison() {
  console.log("\n⚡ 性能对比测试");
  console.log("================================");

  const iterations = 10;
  const sleepTime = 50;

  // 测试 C FFI 版本
  console.log(`🔬 测试 C FFI 版本 (${iterations}次, 每次${sleepTime}ms):`);
  const start1 = performance.now();
  for (let i = 0; i < iterations; i++) {
    await sleepMs(sleepTime);
  }
  const end1 = performance.now();
  const ffiTime = end1 - start1;
  console.log(`   总耗时: ${Math.round(ffiTime)}ms`);
  console.log(`   平均每次: ${Math.round(ffiTime / iterations)}ms`);

  // 测试 JavaScript 版本
  console.log(`\n🔬 测试 JavaScript 版本 (${iterations}次, 每次${sleepTime}ms):`);
  const start2 = performance.now();
  for (let i = 0; i < iterations; i++) {
    await new Promise(resolve => setTimeout(resolve, sleepTime));
  }
  const end2 = performance.now();
  const jsTime = end2 - start2;
  console.log(`   总耗时: ${Math.round(jsTime)}ms`);
  console.log(`   平均每次: ${Math.round(jsTime / iterations)}ms`);

  // 对比结果
  console.log(`\n📊 性能对比:`);
  console.log(`   C FFI:     ${Math.round(ffiTime)}ms`);
  console.log(`   JavaScript: ${Math.round(jsTime)}ms`);
  console.log(`   差异:      ${Math.round(jsTime - ffiTime)}ms (${((jsTime - ffiTime) / ffiTime * 100).toFixed(1)}%)`);
}

// 主程序
async function main() {
  try {
    // 基础功能测试
    await testSleep();

    // 使用演示
    await demoUsage();

    // 性能对比
    await performanceComparison();

  } catch (error) {
    console.error("❌ 程序执行失败:", error);
  }
}

if (import.meta.url === `file://${Deno.mainModule}`) {
  await main();
}
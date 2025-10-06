// Deno FFI 睡眠函数接口

// 动态加载共享库
const libPath = "./libsleep.so"; // macOS/Linux
// const libPath = "./sleep.dll";   // Windows

let lib: Deno.DynamicLibrary<{
  sleep_ms: {
    parameters: ["u32"];
    result: "i32";
  };
}>;

try {
  lib = Deno.dlopen(libPath, {
    sleep_ms: {
      parameters: ["u32"],
      result: "i32",
      nonblocking: true
    },
  });

  lib.symbols.sleep_ms(500).then(() => { console.log("After") });
  console.log("Before");

} catch (error) {
  console.error("❌ 无法加载共享库:", error);
  console.log("💡 请先运行: chmod +x build.sh && ./build.sh");
  Deno.exit(1);
}

/**
 * 非阻塞睡眠函数
 * @param ms 睡眠时间（毫秒）
 * @returns Promise<number> 返回值（0表示成功）
 */
export async function sleepMs(ms: number): Promise<number> {
  return new Promise((resolve) => {
    // 在下一个事件循环中执行，避免阻塞
    setTimeout(() => {
      const result = lib.symbols.sleep_ms(ms) as number;
      resolve(result);
    }, 0);
  });
}

/**
 * 精确计时的睡眠函数
 * @param ms 睡眠时间（毫秒）
 */
export async function precisionSleep(ms: number): Promise<void> {
  const start = Date.now();
  await sleepMs(ms);
  const elapsed = Date.now() - start;

  // 如果时间不够精确，再等待一下
  if (elapsed < ms) {
    await new Promise(resolve => setTimeout(resolve, ms - elapsed));
  }
}

/**
 * 批量睡眠测试
 */
export async function testSleep() {
  console.log("🧪 测试 Deno FFI 睡眠函数\n");

  const testCases = [50, 100, 500, 1000];

  for (const ms of testCases) {
    console.log(`⏰ 测试睡眠 ${ms}ms...`);

    const start = performance.now();
    const result = await sleepMs(ms);
    const end = performance.now();

    const actualTime = Math.round(end - start);
    const error = actualTime - ms;

    console.log(`  - 返回值: ${result}`);
    console.log(`  - 预期: ${ms}ms`);
    console.log(`  - 实际: ${actualTime}ms`);
    console.log(`  - 误差: ${error > 0 ? '+' : ''}${error}ms`);
    console.log(`  - 状态: ${result === 0 ? '✅ 成功' : '❌ 失败'}\n`);
  }
}

// 如果直接运行此文件，执行测试
if (import.meta.main) {
  try {
    // await testSleep();
  } catch (error) {
    console.error("❌ 测试失败:", error);
  }
}
// Deno 无法直接导入 Node-API 模块的演示
// 这个文件展示了错误的做法和正确的替代方案

console.log("🚨 Deno 中使用 Node-API 的正确姿势");
console.log("===================================");

console.log("\n❌ 错误的做法 (这不会工作):");
console.log("import addon from './build/Release/napi_addon.node';");
console.log("原因: Deno 不支持 require() 和 Node-API 模块格式");

console.log("\n✅ 正确的做法:");
console.log("━━━━━━━━━━━━━");

console.log("\n🎯 方案 1: 使用模拟版本 (立即可用)");
console.log("deno run mock-napi.ts");

console.log("\n🎯 方案 2: 编译 Deno 兼容的 C 库");
console.log("./compile_ffi.sh");
console.log("deno run --allow-ffi simple_ffi_demo.ts");

console.log("\n🎯 方案 3: 使用 WebAssembly");
console.log("emcc math.c -o math.wasm");
console.log("// 然后在 Deno 中加载 WASM");

console.log("\n📚 技术解释:");
console.log("─────────────");
console.log("• Node-API 模块 (.node) 是为 Node.js 设计的");
console.log("• 它们使用 require() 和特殊的模块加载器");
console.log("• Deno 使用 ES 模块和 FFI/WASM");
console.log("• 两者在底层架构上不兼容");

console.log("\n💡 解决方案对比:");
console.log("─────────────────");
console.log("┌─ Node-API (.node)   → 仅限 Node.js");
console.log("├─ Deno FFI (.so/.dylib/.dll) → Deno 原生");
console.log("├─ WebAssembly (.wasm) → 跨平台通用");
console.log("└─ Rust + WASM → 现代高性能");

console.log("\n🚀 推荐下一步:");
console.log("deno run mock-napi.ts  # 了解概念");
console.log("deno run DENO_NAPI_GUIDE.md  # 阅读完整指南");

// 演示正确的错误处理
try {
  // 这会失败，但是是预期的
  console.log("\n🔍 尝试错误的导入方式 (演示用):");
  // import('./build/Release/napi_addon.node');  // 这行注释掉避免语法错误
  throw new Error("模拟导入失败: ES 模块语法不支持 .node 文件");
} catch (error) {
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.log("❌ 预期的错误:", errorMessage);
  console.log("💡 这证明了 Node-API 模块不能直接在 Deno 中使用");
}

console.log("\n🎉 结论:");
console.log("虽然不能直接使用 Node-API，但 Deno 的替代方案更加强大和灵活！");

export { };
// 简化的 deno-bindgen 演示
// 注意：这需要先运行构建脚本生成绑定

console.log("🦀 Deno-bindgen 演示");
console.log("==================");

// 模拟导入（实际需要生成的绑定）
console.log("📝 如果绑定已生成，可以这样使用：");
console.log("");

console.log("```typescript");
console.log('import { add, greet, fibonacci } from "./bindings/mod.ts";');
console.log("");
console.log("// 基础运算");
console.log("console.log(add(5, 3)); // 8");
console.log("");
console.log("// 字符串处理");
console.log('console.log(greet("Deno")); // "Hello, Deno!"');
console.log("");
console.log("// 性能计算");
console.log("console.log(fibonacci(10)); // 55");
console.log("```");
console.log("");

console.log("🔧 构建步骤：");
console.log("1. cargo build --release");
console.log("2. deno_bindgen");
console.log("3. deno run --allow-ffi test.ts");
console.log("");

console.log("💡 Deno-bindgen 的优势：");
console.log("- 🚀 自动生成类型安全的绑定");
console.log("- ⚡ 利用 Rust 的性能优势");
console.log("- 🔄 支持复杂数据类型");
console.log("- 🛡️ 内置错误处理");

console.log("");
console.log("📚 查看 GUIDE.md 获取完整使用指南！");
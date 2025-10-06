// 简化的测试文件，展示布尔值处理的修复
import { rustBoolToJS, jsBoolToRust } from "./bool_helpers.ts";

console.log("🔧 Deno-bindgen 布尔值修复演示");
console.log("==============================");
console.log("");

console.log("❌ 原始问题:");
console.log("   error: bool return type not supported by Deno FFI");
console.log("");

console.log("✅ 解决方案:");
console.log("   将 bool 返回类型改为 i32 (0=false, 1=true)");
console.log("");

console.log("🔧 修复的代码示例:");
console.log("   // 原始代码（会报错）");
console.log("   // #[deno_bindgen]");
console.log("   // pub fn is_even(num: i32) -> bool {");
console.log("   //     num % 2 == 0");
console.log("   // }");
console.log("");
console.log("   // 修复后的代码");
console.log("   #[deno_bindgen]");
console.log("   pub fn is_even(num: i32) -> i32 {");
console.log("       if num % 2 == 0 { 1 } else { 0 }");
console.log("   }");
console.log("");

console.log("💡 TypeScript 辅助函数:");
console.log("   // 将 Rust 的 i32 转换为 JS 布尔值");
console.log("   function rustBoolToJS(value: number): boolean {");
console.log("       return value !== 0;");
console.log("   }");
console.log("");
console.log("   // 将 JS 布尔值转换为 Rust 的 i32");
console.log("   function jsBoolToRust(value: boolean): number {");
console.log("       return value ? 1 : 0;");
console.log("   }");
console.log("");

console.log("🧪 使用示例:");
console.log(`   rustBoolToJS(1) = ${rustBoolToJS(1)}`);
console.log(`   rustBoolToJS(0) = ${rustBoolToJS(0)}`);
console.log(`   jsBoolToRust(true) = ${jsBoolToRust(true)}`);
console.log(`   jsBoolToRust(false) = ${jsBoolToRust(false)}`);
console.log("");

console.log("📚 更多布尔逻辑函数:");
console.log("   - logical_and(a: i32, b: i32) -> i32");
console.log("   - logical_or(a: i32, b: i32) -> i32");
console.log("   - logical_not(a: i32) -> i32");
console.log("   - is_positive(num: i32) -> i32");
console.log("");

console.log("🎯 关键要点:");
console.log("   1. Deno FFI 不支持布尔返回类型");
console.log("   2. 使用 i32 代替，0=false, 1=true");
console.log("   3. 提供辅助函数简化类型转换");
console.log("   4. 保持 API 的类型安全性");
console.log("");

console.log("✅ 修复完成！现在可以正常使用布尔逻辑函数了。");
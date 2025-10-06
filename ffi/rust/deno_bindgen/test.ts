// Deno-bindgen 完整使用示例
// 这个文件演示了如何在 TypeScript 中使用 Rust 函数

// 导入生成的绑定
import {
  add,
  multiply,
  greet,
  reverse_string,
  is_even,
  logical_and,
  logical_or,
  logical_not,
  is_positive,
  sum_array,
  filter_even,
  create_person,
  get_person_info,
  safe_divide,
  find_max,
  calculate_area,
  process_bytes,
  fibonacci
} from "./bindings/mod.ts";

// 导入布尔值辅助函数
import { rustBoolToJS, jsBoolToRust, RustBool } from "./bool_helpers.ts"; console.log("🦀 Deno-bindgen 完整功能演示");
console.log("============================\n");

// 1. 基础数值运算
console.log("📊 1. 基础数值运算");
console.log("---------------");
console.log(`add(5, 3) = ${add(5, 3)}`);
console.log(`multiply(2.5, 4.0) = ${multiply(2.5, 4.0)}`);
console.log("");

// 2. 字符串处理
console.log("📝 2. 字符串处理");
console.log("-------------");
console.log(`greet("Deno") = "${greet("Deno")}"`);
console.log(`reverse_string("hello") = "${reverse_string("hello")}"`);
console.log("");

// 3. 布尔值和逻辑运算（演示布尔值处理）
console.log("🔢 3. 布尔值和逻辑运算");
console.log("------------------");

// 使用基础方式
const isEven4Raw = is_even(4);
const isEven5Raw = is_even(5);
console.log(`is_even(4) = ${isEven4Raw} (${isEven4Raw ? 'true' : 'false'})`);
console.log(`is_even(5) = ${isEven5Raw} (${isEven5Raw ? 'true' : 'false'})`);

// 使用辅助函数
const isEven4 = rustBoolToJS(is_even(4));
const isEven5 = rustBoolToJS(is_even(5));
console.log(`使用辅助函数: is_even(4) = ${isEven4}`);
console.log(`使用辅助函数: is_even(5) = ${isEven5}`);

// 逻辑运算
const logicalResult = rustBoolToJS(logical_and(jsBoolToRust(true), jsBoolToRust(false)));
console.log(`logical_and(true, false) = ${logicalResult}`);

const logicalOrResult = rustBoolToJS(logical_or(jsBoolToRust(true), jsBoolToRust(false)));
console.log(`logical_or(true, false) = ${logicalOrResult}`);

const logicalNotResult = rustBoolToJS(logical_not(jsBoolToRust(true)));
console.log(`logical_not(true) = ${logicalNotResult}`);

// 使用类包装器
const positiveResult = RustBool.fromRust(is_positive(-5));
console.log(`is_positive(-5) = ${positiveResult.toJS()}`);

console.log("");

// 4. 数组操作
console.log("📋 4. 数组操作");
console.log("------------");
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
console.log(`原数组: [${numbers.join(", ")}]`);
console.log(`sum_array = ${sum_array(numbers)}`);
const evenNumbers = filter_even(numbers);
console.log(`filter_even = [${evenNumbers.join(", ")}]`);
console.log("");

// 5. 结构体操作
console.log("👤 5. 结构体操作");
console.log("-------------");
const person = create_person("Alice", 25, "alice@example.com");
console.log(`创建的人员:`, person);
console.log(`人员信息: "${get_person_info(person)}"`);
console.log("");

// 6. 错误处理
console.log("⚠️  6. 错误处理");
console.log("------------");
try {
  const result1 = safe_divide(10.0, 2.0);
  console.log(`safe_divide(10.0, 2.0) = ${result1}`);

  const result2 = safe_divide(10.0, 0.0);
  console.log(`safe_divide(10.0, 0.0) = ${result2}`);
} catch (error) {
  console.log(`错误: ${error}`);
}
console.log("");

// 7. 可选值处理
console.log("🎯 7. 可选值处理");
console.log("-------------");
const numbers2 = [3, 1, 4, 1, 5, 9, 2, 6];
const maxValue = find_max(numbers2);
console.log(`find_max([${numbers2.join(", ")}]) = ${maxValue}`);

const emptyMax = find_max([]);
console.log(`find_max([]) = ${emptyMax}`);
console.log("");

// 8. 复杂数据结构
console.log("🔷 8. 复杂数据结构");
console.log("---------------");
const rectangle = {
  top_left: { x: 0.0, y: 10.0 },
  bottom_right: { x: 5.0, y: 0.0 }
};
console.log(`矩形:`, rectangle);
console.log(`面积: ${calculate_area(rectangle)}`);
console.log("");

// 9. 字节数组处理
console.log("🔢 9. 字节数组处理");
console.log("---------------");
const originalBytes = new Uint8Array([1, 2, 3, 4, 5]);
console.log(`原字节数组: [${Array.from(originalBytes).join(", ")}]`);
const processedBytes = process_bytes(originalBytes);
console.log(`处理后: [${Array.from(processedBytes).join(", ")}]`);
console.log("");

// 10. 性能测试
console.log("⚡ 10. 性能测试");
console.log("------------");
const fibNumbers = [10, 20, 30, 35];
fibNumbers.forEach(n => {
  const start = performance.now();
  const result = fibonacci(n);
  const end = performance.now();
  console.log(`fibonacci(${n}) = ${result} (耗时: ${(end - start).toFixed(3)}ms)`);
});
console.log("");

// 11. 批量操作测试
console.log("📦 11. 批量操作测试");
console.log("----------------");
const batchSize = 1000;
const largeArray = Array.from({ length: batchSize }, (_, i) => i + 1);

console.log(`处理 ${batchSize} 个数字...`);
const start = performance.now();
const batchSum = sum_array(largeArray);
const end = performance.now();
console.log(`批量求和结果: ${batchSum}`);
console.log(`处理时间: ${(end - start).toFixed(3)}ms`);
console.log("");

console.log("🎉 所有测试完成！");
console.log("");
console.log("💡 提示: 这些函数都是用 Rust 编写并通过 deno-bindgen 绑定到 TypeScript 的。");
console.log("🚀 Rust 的性能优势在计算密集型任务中特别明显！");
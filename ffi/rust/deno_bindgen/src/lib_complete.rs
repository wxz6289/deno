use deno_bindgen::deno_bindgen;

// 1. 基础数值运算函数
#[deno_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[deno_bindgen]
pub fn multiply(a: f64, b: f64) -> f64 {
    a * b
}

// 2. 字符串处理函数
#[deno_bindgen]
pub fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[deno_bindgen]
pub fn reverse_string(input: &str) -> String {
    input.chars().rev().collect()
}

// 3. 布尔值和逻辑运算 (返回 i32: 0=false, 1=true)
#[deno_bindgen]
pub fn is_even(num: i32) -> i32 {
    if num % 2 == 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn logical_and(a: i32, b: i32) -> i32 {
    if a != 0 && b != 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn logical_or(a: i32, b: i32) -> i32 {
    if a != 0 || b != 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn logical_not(a: i32) -> i32 {
    if a == 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn is_positive(num: i32) -> i32 {
    if num > 0 { 1 } else { 0 }
}

// 4. 数组和字符串操作
#[deno_bindgen]
pub fn count_characters(input: &str) -> i32 {
    input.len() as i32
}

#[deno_bindgen]
pub fn to_uppercase(input: &str) -> String {
    input.to_uppercase()
}

#[deno_bindgen]
pub fn contains_substring(haystack: &str, needle: &str) -> i32 {
    if haystack.contains(needle) { 1 } else { 0 }
}

// 5. 数学计算
#[deno_bindgen]
pub fn power(base: f64, exponent: f64) -> f64 {
    base.powf(exponent)
}

#[deno_bindgen]
pub fn absolute_value(num: i32) -> i32 {
    num.abs()
}

#[deno_bindgen]
pub fn max_value(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }
}

#[deno_bindgen]
pub fn min_value(a: i32, b: i32) -> i32 {
    if a < b { a } else { b }
}

// 6. 范围和比较
#[deno_bindgen]
pub fn is_in_range(value: i32, min: i32, max: i32) -> i32 {
    if value >= min && value <= max { 1 } else { 0 }
}

#[deno_bindgen]
pub fn compare_values(a: i32, b: i32) -> i32 {
    if a > b {
        1 // a > b
    } else if a < b {
        -1 // a < b
    } else {
        0 // a == b
    }
}

// 7. 字符串验证函数
#[deno_bindgen]
pub fn is_empty_string(input: &str) -> i32 {
    if input.is_empty() { 1 } else { 0 }
}

#[deno_bindgen]
pub fn starts_with_prefix(input: &str, prefix: &str) -> i32 {
    if input.starts_with(prefix) { 1 } else { 0 }
}

#[deno_bindgen]
pub fn ends_with_suffix(input: &str, suffix: &str) -> i32 {
    if input.ends_with(suffix) { 1 } else { 0 }
}

// 8. 便捷的转换函数
#[deno_bindgen]
pub fn bool_to_int(value: i32) -> i32 {
    if value != 0 { 1 } else { 0 }
}

#[deno_bindgen]
pub fn int_to_bool_string(value: i32) -> String {
    if value != 0 { "true".to_string() } else { "false".to_string() }
}

// 9. 简单的状态函数
#[deno_bindgen]
pub fn increment(value: i32) -> i32 {
    value + 1
}

#[deno_bindgen]
pub fn decrement(value: i32) -> i32 {
    value - 1
}

#[deno_bindgen]
pub fn double_value(value: i32) -> i32 {
    value * 2
}

#[deno_bindgen]
pub fn half_value(value: i32) -> i32 {
    value / 2
}

// 10. 组合逻辑函数
#[deno_bindgen]
pub fn xor_operation(a: i32, b: i32) -> i32 {
    if (a != 0) != (b != 0) { 1 } else { 0 }
}

#[deno_bindgen]
pub fn nand_operation(a: i32, b: i32) -> i32 {
    if !(a != 0 && b != 0) { 1 } else { 0 }
}

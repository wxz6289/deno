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

// 4. 计算密集型函数
#[deno_bindgen]
pub fn fibonacci(n: u32) -> u64 {
    match n {
        0 => 0,
        1 => 1,
        _ => {
            let mut a = 0;
            let mut b = 1;
            for _ in 2..=n {
                let temp = a + b;
                a = b;
                b = temp;
            }
            b
        }
    }
}

// 5. 字符串工具函数
#[deno_bindgen]
pub fn string_length(input: &str) -> u32 {
    input.len() as u32
}

#[deno_bindgen]
pub fn string_uppercase(input: &str) -> String {
    input.to_uppercase()
}

// 6. 数学函数
#[deno_bindgen]
pub fn square(x: f64) -> f64 {
    x * x
}

#[deno_bindgen]
pub fn abs_value(x: i32) -> i32 {
    x.abs()
}

// 7. 简单的数学计算
#[deno_bindgen]
pub fn sum_three_numbers(a: i32, b: i32, c: i32) -> i32 {
    a + b + c
}

#[deno_bindgen]
pub fn average_two_numbers(a: f64, b: f64) -> f64 {
    (a + b) / 2.0
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_greet() {
        assert_eq!(greet("World"), "Hello, World!");
    }

    #[test]
    fn test_is_even() {
        assert_eq!(is_even(4), 1);
        assert_eq!(is_even(5), 0);
    }

    #[test]
    fn test_fibonacci() {
        assert_eq!(fibonacci(10), 55);
    }

    #[test]
    fn test_logical_operations() {
        assert_eq!(logical_and(1, 1), 1);
        assert_eq!(logical_and(1, 0), 0);
        assert_eq!(logical_or(1, 0), 1);
        assert_eq!(logical_not(0), 1);
    }
}

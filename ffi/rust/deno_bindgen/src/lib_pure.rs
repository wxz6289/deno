// 纯 Rust 库 - 不使用 deno_bindgen
// 这样可以避免符号问题

// 基础数学函数
#[no_mangle]
pub extern "C" fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[no_mangle]
pub extern "C" fn multiply(a: i32, b: i32) -> i32 {
    a * b
}

#[no_mangle]
pub extern "C" fn subtract(a: i32, b: i32) -> i32 {
    a - b
}

// 布尔函数（返回 i32: 0=false, 1=true）
#[no_mangle]
pub extern "C" fn is_even(num: i32) -> i32 {
    if num % 2 == 0 { 1 } else { 0 }
}

#[no_mangle]
pub extern "C" fn is_positive(num: i32) -> i32 {
    if num > 0 { 1 } else { 0 }
}

#[no_mangle]
pub extern "C" fn logical_and(a: i32, b: i32) -> i32 {
    if a != 0 && b != 0 { 1 } else { 0 }
}

#[no_mangle]
pub extern "C" fn logical_or(a: i32, b: i32) -> i32 {
    if a != 0 || b != 0 { 1 } else { 0 }
}

#[no_mangle]
pub extern "C" fn logical_not(a: i32) -> i32 {
    if a == 0 { 1 } else { 0 }
}

// 比较函数
#[no_mangle]
pub extern "C" fn max_value(a: i32, b: i32) -> i32 {
    if a > b { a } else { b }
}

#[no_mangle]
pub extern "C" fn min_value(a: i32, b: i32) -> i32 {
    if a < b { a } else { b }
}

// 数学计算
#[no_mangle]
pub extern "C" fn absolute_value(num: i32) -> i32 {
    num.abs()
}

#[no_mangle]
pub extern "C" fn power_of_two(exponent: u32) -> i32 {
    (2_i32).pow(exponent)
}

// 范围检查
#[no_mangle]
pub extern "C" fn is_in_range(value: i32, min: i32, max: i32) -> i32 {
    if value >= min && value <= max { 1 } else { 0 }
}

// 简单的字符串长度函数（传入 C 字符串）
#[no_mangle]
pub extern "C" fn string_length(ptr: *const u8, len: usize) -> i32 {
    if ptr.is_null() {
        return 0;
    }

    unsafe {
        let slice = std::slice::from_raw_parts(ptr, len);
        match std::str::from_utf8(slice) {
            Ok(s) => s.len() as i32,
            Err(_) => -1, // 错误返回 -1
        }
    }
}

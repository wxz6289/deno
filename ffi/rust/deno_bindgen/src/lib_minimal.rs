use deno_bindgen::deno_bindgen;

#[deno_bindgen]
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[deno_bindgen]
pub fn is_even(num: i32) -> i32 {
    if num % 2 == 0 { 1 } else { 0 }
}

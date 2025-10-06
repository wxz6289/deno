#[no_mangle]
pub extern "C" fn fibonacci(n: u32) -> u32 {
    if n <= 1 {
        return n;
    }
    fibonacci(n - 1) + fibonacci(n - 2)
}

// rustc --crate-type cdylib fibo.rs
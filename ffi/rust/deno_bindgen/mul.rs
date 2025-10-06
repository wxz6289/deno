use deno_bindgen::prelude::*;

#[debo_bindgen]
struct Input {
    a: i32,
    b: i32,
}

#[debo_bindgen]
fn mul(input: Input) -> i32 {
    input.a * input.b
}

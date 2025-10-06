(module
  (import "./time.ts" "getTimeSeconds" (func $get_time (result f64)))

  (func (export "getValue") (result f64)
    call $get_time
  )
)
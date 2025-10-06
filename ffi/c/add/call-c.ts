const dylib = Deno.dlopen(
  "./libadd.so",
  {
    add: { parameters: ["i32", "i32"], result: "i32" },
  },
);

const result = dylib.symbols.add(2, 3);
console.log("Result of add(2, 3):", result);

dylib.close();

// deno run --allow-ffi --unstable-ffi call-c.ts
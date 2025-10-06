const map = {
  "darwin": "libfibo.dylib",
  "windows": "fibo.dll",
  "linux": "libfibo.so",
};

const libName = map[Deno.build.os as keyof typeof map] ?? "libfibo.so";

const dylib = Deno.dlopen(`./${libName}`, {
  fibonacci: {
    parameters: ["u32"],
    result: "u32",
  },
} as const);

const n = 20;
const result = dylib.symbols.fibonacci(n);
console.log(`Fibonacci(${n}) = ${result}`);

dylib.close();
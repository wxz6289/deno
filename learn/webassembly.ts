const bytes = new Uint8Array([
  0, 97, 115, 109, 1, 0, 0, 0, 1, 7, 1, 96, 2,
  127, 127, 1, 127, 2, 1, 0, 3, 2, 1, 0, 4, 1,
  0, 5, 1, 0, 6, 1, 0, 7, 7, 1, 3, 97, 100, 100,
  0, 0, 9, 1, 0, 10, 10, 1, 8, 0, 32, 0, 32, 1,
  106, 15, 11, 11, 1, 0,
]);

interface WebAssemblyExports {
  add(a: number, b: number): number;
}

const exports = await WebAssembly.instantiate(bytes);
const add = (exports.instance.exports as unknown as WebAssemblyExports).add;

console.log("1 + 2 =", add(1, 2));
console.log("3 + 4 =", add(3, 4));

export { add };
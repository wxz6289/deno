
/**
* sum of a and b
* @param {number} a
* @param {number} b
* @returns {number}
*/
export function add(a: number, b: number): number {
  return a + b;
}

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Add 2 + 3 =", add(2, 5));
}

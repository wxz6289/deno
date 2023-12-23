import { assertEqual } from '$std/asset/mod.ts'
export function add(a: number, b: number): number {
  return a + b;
}

Deno.test('test add() function', () => {
  assertEqual(3, add(1, 2));
})

// Learn more at https://deno.land/manual/examples/module_metadata#concepts
if (import.meta.main) {
  console.log("Test Add ", add(2, 6));
  console.log(import.meta);
}

console.log(Deno.mainModule)

Deno.serve((_request: Request) => {
  return new Response("hello world!")
});
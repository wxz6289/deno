import { assertEquals } from "https://deno.land/std@0.203.0/assert/mod.ts";
export function add(a: number, b: number): number {
  return a + b;
}

Deno.test('test add() function', () => {
  assertEquals(3, add(1, 2));
})

if (import.meta.main) {
  console.log("Test Add ", add(2, 6));
  console.log(import.meta);
}

console.log(Deno.mainModule)

Deno.serve((_request: Request) => {
  return new Response("hello world!")
});
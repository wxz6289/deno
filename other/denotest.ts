import { assertEquals } from "https://deno.land/std@0.66.0/testing/asserts.ts";
Deno.test("hello #1", () => {
  const x = 1 + 2;
  assertEquals(x, 3);
});

Deno.test({
  name: "hello #2",
  fn: () => {
    const x = 1 + 2;
    assertEquals(x, 3);
  },
});

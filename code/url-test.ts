import { assertEquals } from "https://deno.land/std@0.196.0/testing/asserts.ts";
import { delay } from "https://deno.land/std@0.196.0/async/delay.ts";

Deno.test("url test", () => {
  const url = new URL("far.ts", "http://localhost:8080/");
  // console.log(url);
  assertEquals(url.href, "http://localhost:8080/far.ts");
});

Deno.test({
  name: "add",
  fn() {
    const add = 1 + 3;
    assertEquals(add, 4);
  },
});

Deno.test(
  { name: "add", permissions: { read: true } },
  () => {
    const add = 1 + 3;
    console.log(add);
    assertEquals(add, 4);
  },
);

Deno.test("async hello world", async () => {
  const x = 1 + 2;
  await delay(100);
  if (x !== 3) {
    throw Error("x should be equal to 3");
  }
});

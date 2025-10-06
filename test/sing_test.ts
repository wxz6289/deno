function sing(phrase: string, times: number): string {
  return Array(times).fill(phrase).join(' ');
}

import { assertEquals } from 'jsr:@std/assert';
import { delay } from 'jsr:@std/async';
import { parse } from 'jsr:@std/jsonc';
import { expect } from 'jsr:@std/expect';
Deno.test('sing repeat a phrase', () => {
  assertEquals(sing('la', 3), 'la la la');
});

Deno.test("simple test", () => {
  assertEquals(1 + 1, 2);
});

Deno.test("async test", async () => {
  await delay(100);
  assertEquals(2 + 2, 4);
});

Deno.test({
  name: "read file",
  async fn() {
    const data = await Deno.readTextFile('./deno.json');
    const obj = parse(data);
    assertEquals((obj as any)?.fmt?.useTabs, false);
  }
})

function add(a: number, b: number): number {
  return a + b;
}
Deno.test('add two numbers', () => {
  const result = add(2, 3);
  expect(result).toBe(5);
});
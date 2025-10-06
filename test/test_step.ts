import { assertEquals } from "jsr:@std/assert";
import { beforeAll, beforeEach, afterEach, afterAll } from "jsr:@std/testing/bdd";

beforeAll(() => {
  console.log('Before all tests');
});

afterAll(() => {
  console.log('After all tests');
});

beforeEach(() => {
  console.log('Before each test');
});

afterEach(() => {
  console.log('After each test');
});

Deno.test('test add', () => {
  assertEquals(2 + 3, 5);
});

Deno.test('test step', async (t) => {
  await t.step('step 1', () => {
    assertEquals(1 + 1, 2);
  });
  await t.step('step 2', () => {
    assertEquals(2 + 2, 4);
  });
});

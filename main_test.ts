import { assertEquals } from "@std/assert";
import { add } from "@scope/add";

Deno.test(function addTest() {
  assertEquals(add(2, 3), 5);
});

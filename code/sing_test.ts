function sing(phrase: string, times: number): string {
  return Array(times).fill(phrase).join(' ');
}

import { assertEquals } from 'jsr:@std/assert';

Deno.test('sing repeat a phrase', () => {
  assertEquals(sing('la', 3), 'la la la');
});

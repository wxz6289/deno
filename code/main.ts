export function add(a: number, b: number): number {
  return a + b;
}

import add2 from './common.ts';
// @ts-ignore
import { sing } from 'sing';

// @ts-ignore
if (import.meta.main) {
  console.log('Add 2 + 3 =', add(2, 3));
  console.log(sing('Hello, Deno!', 3));
  console.log(add2(5, 7));
}

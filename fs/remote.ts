/* import {
  add,
  multiply,
} from "https://x.nest.land/ramda@0.27.0/source/index.js"; */

import { add, multiply } from "./arithmetic.ts";

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(totalCost(120, 31, 1.2));
console.log(totalCost(45, 27, 1.15));

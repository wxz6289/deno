// import { add, multiply } from "./arithmetic.ts";
//  "https://x.nest.land/ramda@0.27.0/source/index.js";
/* import { add, multiply } from "ramda";
import { red } from "fmt/colors.ts"; */

import { add, multiply, red } from '../deps.ts'

function totalCost(outbound: number, inbound: number, tax: number): number {
  return multiply(add(outbound, inbound), tax);
}

console.log(red(totalCost(120, 90, 0.2).toString()));

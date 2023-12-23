import _ from "lodash";
import { red } from "fmt/colors.ts";
import { add } from "/fs/arithmetic.ts";

console.log(red("hello world"));

console.log(_.chunk([1, 2, 3, 4], 2));

console.log(add(2, 5));

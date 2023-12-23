import { readFileSync } from "node:fs";

console.log(readFileSync("package.json", { encoding: "utf8" }));

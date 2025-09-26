import { readFile } from "node:fs/promises";

const content = await readFile("./package.json", { encoding: "utf8" });
console.log(content);

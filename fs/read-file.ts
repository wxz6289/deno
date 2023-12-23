/* import { readFileSync } from "node:fs";

const content = readFileSync("./fs/cat.ts", { encoding: "utf-8" });
console.log(content);
 */

/* const text = await Deno.readTextFile("./fs/cat.ts");
console.log(text); */

// await Deno.writeTextFile("./fs/test.txt", "write contents of test");
// await Deno.writeTextFile("./fs/test.txt", "write other contents of test", { encoding: "utf-8", append: true });

function writeJson(path: string, data: object): string {
  try {
    Deno.writeTextFileSync(path, JSON.stringify(data));

    return "Written to " + path;
  } catch (e) {
    return e.message;
  }
}

console.log(writeJson("./data.json", { hello: "World" }));
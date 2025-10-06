// await Deno.writeTextFile('./hello.txt', 'Hi Deno!\n', { append: true });
import {
  writeTextFile,
  writeTextFileSync,
  // @ts-ignore
} from "@std/fs/unstable-write-text-file";

await writeTextFile('./test/hello.txt', 'Hi Deno!\n', { append: true });
/*
try {
  writeTextFileSync("./data.json", JSON.stringify({ hello: "World" }, null, 2));
} catch (e) {
  console.error(e);
} */

export { };

import { copy } from "@std/io/copy";
const file = await Deno.open("greet.txt");
await copy(file, Deno.stdout);
file.close();

export {};

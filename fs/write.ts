// @ts-ignore
import { ensureFile } from '@std/fs';

await ensureFile("test/hello.txt");

const file = await Deno.open("test/hello.txt", { write: true, create: true, append: true });

const encoder = new TextEncoder();
const data = encoder.encode("Hello, Deno!\n");

await file.write(data);
console.log('write to file done');
file.close();

export { };
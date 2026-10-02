import { copy, ensureFile } from "https://deno.land/std@0.203.0/fs/mod.ts";
import { join } from "https://deno.land/std@0.203.0/path/mod.ts";

const __dirname = new URL('.', import.meta.url).pathname;

await ensureFile(join(__dirname, 'dist', 'data.json'));

await copy(
  './package.json',
  join(__dirname, 'dist', 'data.json'),
  { overwrite: true }
);
console.log('data.json copied to dist folder');
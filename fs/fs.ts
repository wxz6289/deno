import { copy, ensureFile } from '@std/fs';
import { join } from '@std/path';

await ensureFile(join(Deno.cwd(), 'test', 'data.json'));

await copy(
  './deno.json',
  join(Deno.cwd(), 'test', 'data.json'),
  { overwrite: true, }
);
console.log('data.json copied to test folder');
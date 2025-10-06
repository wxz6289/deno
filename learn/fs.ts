import { copy, ensureFile } from '@std/fs';
import { join } from '@std/path';

await ensureFile(join(Deno.cwd(), 'dist', 'data.json'));

await copy(
  './package.json',
  join(Deno.cwd(), 'dist', 'data.json'),
  { overwrite: true, }
);
console.log('data.json copied to dist folder');
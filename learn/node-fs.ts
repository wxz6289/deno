import { copy, ensureFile } from '@std/fs';
import { join } from '@std/path';

const __dirname = new URL('.', import.meta.url).pathname;

await ensureFile(join(__dirname, 'dist', 'data.json'));

await copy(
  './package.json',
  join(__dirname, 'dist', 'data.json'),
  { overwrite: true, }
);
console.log('data.json copied to dist folder');
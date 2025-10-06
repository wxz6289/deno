Deno.bench('url parse', () => {
  new URL('https://deno.land/std/http/file_server.ts');
});

Deno.bench('file read', (b) => {
  b.start();
  Deno.readFileSync('./server.ts');
  b.end();
});

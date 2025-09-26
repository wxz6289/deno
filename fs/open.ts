const file = await Deno.open('./hello.txt', { write: true, create: true, read: true });

await file.write(new TextEncoder().encode('Hello Deno!\n'));
await file.close();

export { };
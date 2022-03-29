const desc = { name: "read", path: './config.json' } as const;
await Deno.permissions.request(desc);
console.log(await Deno.permissions.query(desc));


const response = await fetch(new URL("./config.json", import.meta.url));
const config = await response.json();
console.log(config);


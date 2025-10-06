const dec = { name: 'read', path: './test' };
const status = await Deno.permissions.request(dec);
console.log(`Permission ${status.state} ${status.partial} for`, dec);
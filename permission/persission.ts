const desc1 = { name: "read", path: "/foo/bar" } as const;

/* const status1 = await Deno.permissions.request(desc1);
console.log(status1); */
console.log(await Deno.permissions.query(desc1));
await Deno.permissions.revoke(desc1);

console.log(await Deno.permissions.query(desc1));

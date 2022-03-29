// console.log(location.href);
/* 
const response = await fetch("./orgs/denoland");
console.log(await response.json()); 
*/

// deno run --location http://api.github.com  --allow-net  apis/location-demo.ts

const worker = new Worker("./hello.ts", { type: "module" });


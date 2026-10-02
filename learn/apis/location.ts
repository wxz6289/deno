console.log(location.href);

const response = await fetch("/orgs/denoland");
console.log(await response.json());

// deno run --location http://api.github.com  --allow-net  apis/location.ts

let url = new URL("https://deno.com/doc/stream.md");
let url2 = new URL("/doc/stream.md", "https://deno.com");
console.log(url);
console.log(url2);
console.log(url.href);
console.log(url2.href);
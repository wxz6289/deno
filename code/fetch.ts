/* const jsonResponse = await fetch("https://api.github.com/users/denoland");
const jsonData = await jsonResponse.json();
console.log(jsonData); */

const res = await fetch("https://deno.com");
const text = await res.text();
console.log(text);

/* 
try {
  await fetch("https://does.not.exist/");
} catch (error) {
  console.log(error);
} */
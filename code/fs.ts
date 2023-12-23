/* await Deno.writeTextFile("./hello.txt", "this is appended to the end", { append: true });
console.log("File written to ./hello.txt"); */

const content = await Deno.readTextFile("./hello.txt");
console.log(content);
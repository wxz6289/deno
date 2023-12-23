import chalk from "npm:chalk@5";
/// <reference types="npm:@types/express@^4.17">
// @deno-types="npm:@types/express@^4.17"
import express from "npm:express@^4.17";
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/hello", (req, res) => {
  res.send("Hello deno!");
});

app.listen(3000);
// console.log(chalk.green("listening on http://localhost:3000/"));

// deno run --allow-env --unstable  chalk.ts
// deno cache --reload --lock=deno.lock ./express.ts

import { load } from "dotenv";
import { parse } from "flags";

const env = await load();
console.log(env);

console.log(parse(Deno.args));

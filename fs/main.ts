/* console.log(Deno.cwd());
const res = await fetch('https://fireship.io');
console.log(res); */

/* import { serve } from 'https://deno.land/std/http/server.ts';
console.log(serve); */

/* import { dayOfYear } from "https://deno.land/std@0.77.0/datetime/mod.ts";

console.log(dayOfYear(new Date())); */

/* const home = Deno.env.get("HOME");
console.log(home);
// deno run --allow-env=HOME main.ts
*/

const proc = new Deno.Command("ls", {
  args: ["-la"],
  stdout: "piped",
  stderr: "piped",
  stdin: "piped",
  env: {
    "HOME": Deno.env.get("HOME") || "",
    "PATH": Deno.env.get("PATH") || "",
    "SHELL": Deno.env.get("SHELL") || "",
    "USER": Deno.env.get("USER") || "",
    "LANG": Deno.env.get("LANG") || "",
    "TERM": Deno.env.get("TERM") || "",
    "DENO_DIR": Deno.env.get("DENO_DIR") || "",
    "DENO_INSTALL": Deno.env.get("DENO_INSTALL") || "",
  },
});

console.log(proc);

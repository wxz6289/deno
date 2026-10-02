const port = Deno.args[0] ?? "8000";
const apiKey = Deno.env.get("API_KEY");
if (!apiKey) throw new Error("API_KEY is required");
Deno.env.set("RUNTIME", "deno");

console.log(port, apiKey);

console.log(Deno.pid, Deno.cwd(), Deno.mainModule);
console.log(Deno.build.os, Deno.build.arch);

Deno.addSignalListener("SIGTERM", () => {
  console.log("shutting down ...");
  Deno.exit(0);
});


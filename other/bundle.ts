const [diagnostics, emit] = await Deno.bundle(
  "https://deno.land/std@0.65.0/http/server.ts",
);
console.log(diagnostics);

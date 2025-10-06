function handler() {
  return new Response("Hello, world!");
}

Deno.serve({ port: 8081 }, handler);

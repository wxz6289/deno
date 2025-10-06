Deno.serve({
  port: 8000,
  handler: (req) => {
    console.log("Received request:", req);
    return new Response("Hello World");
  },
});
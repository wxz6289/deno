Deno.serve({ port: 8080 }, (request: Request) => {
  const url = new URL(request.url);
  console.log(`path: ${url.pathname}`);
  return new Response("Hello Deno", { status: 200 });
});

Deno.serve({ port: 8080, hostname: "localhost" }, async (request: Request) => {
  const url = new URL(request.url);
  const filePath = decodeURIComponent(url.pathname);
  try {
    const file = await Deno.open(`.${filePath}`, { read: true });
    return new Response(file.readable);
  } catch {
    return new Response('404 Not Found', { status: 404 })
  }
});
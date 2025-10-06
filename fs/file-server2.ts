import { serveDir } from "@std/http/file-server";

Deno.serve({ port: 8080, hostname: "localhost" }, (request: Request) => {
  const pathname = new URL(request.url).pathname;
  if (pathname.startsWith("/static")) {
    return serveDir(request, {
      fsRoot: "./static",
      // urlRoot: '/static',
      showDotfiles: true,
      enableCors: true,
    });
  }
  return new Response("Hello, Deno!");
});

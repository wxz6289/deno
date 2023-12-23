import { serve } from "https://deno.land/std/http/server.ts";

const server = serve((_req) => new Response("Hello Deno"), {
  port: 8000,
  onListen({ hostname, port }) {
    console.log("server runing @%s:%d", hostname, port);
  },
});

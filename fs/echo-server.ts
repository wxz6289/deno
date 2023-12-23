import { copy } from "https://deno.land/std@0.196.0/streams/copy.ts";

const hostname = "localhost";
const port = 3000;
const listeners = Deno.listen({ hostname, port });
console.log(`server listening on ${hostname}:${port}`);

for await (const conn of listeners) {
  copy(conn, conn);
}

// nc localhost 8080

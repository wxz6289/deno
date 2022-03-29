const server = Deno.listen({ port: 8080 });

async function handle(conn: Deno.Conn) {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
        const url = new URL(requestEvent.request.url);
        console.log(`path: ${url.pathname}`);
        await requestEvent.respondWith(new Response("Hello Deno", { status: 200 }));
    }
}


for await (const conn of server) {
    handle(conn);
}
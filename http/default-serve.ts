export default {
  fetch(request: Request): Response {
    const userAgent = request.headers.get("user-agent") || "Unknown";
    console.log(`Request from user-agent: ${userAgent}`);
    return new Response(`User-Agent: ${userAgent}`);
  }
} satisfies Deno.ServeDefaultExport;
function handler(): Response {
  return new Response('Hello World', {
    headers: { 'content-type': 'text/plain' },
  })
}

console.log('Listening on http://localhost:8000')
await Deno.serve({ port: 8000 }, handler)

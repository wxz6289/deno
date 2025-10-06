// @ts-ignore
import { serveDir } from '@std/http/file-server'

Deno.serve((req: Request) => {
  const pathname = new URL(req.url).pathname
  if (pathname.startsWith('/')) {
    return serveDir(req, { fsRoot: './public' })
  }
  return new Response('Not Found', { status: 404 })
})

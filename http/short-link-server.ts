const kv = await Deno.openKv()

interface CreateLinkBody {
  slug: string
  url: string
}

function json(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('content-type', 'application/json; charset=utf-8')
  return new Response(JSON.stringify(body), {
    ...init,
    headers,
  })
}

function isValidSlug(slug: string) {
  return /^[\w0-9\-]{1,40}$/.test(slug)
}

export function handler(req: Request): Promise<Response> {
  return (async () => {
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      })
    }
    if (req.method === 'POST') {
      try {
        const body: CreateLinkBody = await req.json()
        const { slug, url } = body
        if (!isValidSlug(slug)) {
          return json({ error: 'Invalid slug format' }, { status: 422 })
        }
        try {
          new URL(req.url)
        } catch {
          return json({ error: 'Invalid URL format' }, { status: 422 })
        }
        const key = ['link', slug]
        const txResult = await kv.atomic().check({ key, versionstamp: null })
          .set(key, { url }).commit()
        if (!txResult.ok) {
          return json({ error: 'Slug already exists' }, { status: 409 })
        }
        return json({ slug, url }, { status: 201 })
      } catch {
        return json({ error: 'Invalid JSON' }, { status: 400 })
      }
    }
    if (req.method === 'GET') {
      console.log(req.url, 'req.url')
      const slug = new URL(req.url).pathname.slice(1)
      console.log(slug, 'slug')
      if (!slug) {
        return json({ error: 'Slug is required' }, { status: 400 })
      }
      if (!isValidSlug(slug)) {
        return json({ error: 'Invalid slug format' }, { status: 422 })
      }

      const link = await kv.get(['link', slug])
      console.log(link, 'link')
      if (!link.value) {
        return json({ error: 'Link not found' }, { status: 404 })
      }
      return Response.redirect(link.value.url, 301)
    }
    return json({ error: 'Method Not Allowed' }, { status: 405 })
  })()
}

export function startServer() {
  console.log('Starting server on http://localhost:8000')
  return Deno.serve({ port: 8000 }, handler)
}

if (import.meta.main) {
  startServer()
}

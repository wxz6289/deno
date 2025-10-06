Deno.serve({ hostname: 'localhost', port: 8000 }, async (request) => {
  const url = new URL(request.url)
  const filePath = decodeURIComponent(url.pathname)
  console.log(`Request for ${filePath}`)
  try {
    const file = await Deno.open(`./public${filePath}`, { read: true })
    const fileInfo = await file.stat()
    if (fileInfo.isDirectory) {
      file.close()
      return new Response('Directory listing is not allowed', { status: 403 })
    }
    const headers = new Headers()
    headers.set('Content-Length', fileInfo.size.toString())
    headers.set('Content-Type', 'application/octet-stream')
    return new Response(file.readable, { headers })
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return new Response('File not found', { status: 404 })
    }
    return new Response('Internal Server Error', { status: 500 })
  }
})

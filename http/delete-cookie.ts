// @ts-ignore
import { deleteCookie } from '@std/http/cookie'

Deno.serve((req: Request) => {
  let response: Response = new Response('Cookie Deleted', {
    headers: { 'set-cookie': 'deno=; Max-Age=0; Path=/' },
  });

  deleteCookie(response.headers, 'set-cookie', { path: '/' })

  const cookieHeader = response.headers && response.headers.get('set-cookie')
  console.log('Set-Cookie:', cookieHeader)
  return response
})
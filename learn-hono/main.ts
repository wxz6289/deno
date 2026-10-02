import { Hono } from 'hono';
import { fire } from 'hono/service-worker';

const app = new Hono();


app.get('/', (c) => {
  const res = await servePublicFile('index.html');
  return res ?? c.text('Hello Hono!');
});

// 提供 /public/* 路径下的静态文件
app.get('/public/:path+', async (c) => {
  const path = c.req.param('path');
  const res = await servePublicFile(path);
  return res ?? c.text('Not Found', 404);
});

const PORT = Number(Deno?.env?.get?.('PORT') ?? 8000);
if (typeof Deno === 'undefined') {
  // 非 Deno 环境（例如 Worker）
  fire(app);
} else {
  Deno.serve({ port: PORT }, app.fetch);
}

// 直接在根路径提供 Service Worker 及注册脚本和离线页面，便于页面使用 '/sw.js' 进行注册
async function servePublicFile(path: string) {
  try {
    const fileUrl = new URL(`./public/${path}`, import.meta.url);
    const filePath = fileUrl.pathname;
    const stat = await Deno.stat(filePath).catch(() => null);
    if (!stat || !stat.isFile) return null;
    const data = await Deno.readFile(filePath);
    const ext = filePath.split('.').pop()?.toLowerCase() ?? '';
    const mimeMap: Record<string, string> = {
      js: 'application/javascript; charset=utf-8',
      html: 'text/html; charset=utf-8',
      css: 'text/css; charset=utf-8',
      wasm: 'application/wasm',
      json: 'application/json; charset=utf-8',
    };
    const contentType = mimeMap[ext] ?? 'application/octet-stream';
    return new Response(data, { status: 200, headers: { 'content-type': contentType } });
  } catch {
    return null;
  }
}

app.get('/sw.js', async (c) => {
  const res = await servePublicFile('sw.js');
  return res ?? c.text('Not Found', 404);
});

app.get('/sw-register.js', async (c) => {
  const res = await servePublicFile('sw-register.js');
  return res ?? c.text('Not Found', 404);
});

app.get('/offline.html', async (c) => {
  const res = await servePublicFile('offline.html');
  return res ?? c.text('Not Found', 404);
});

// 模块化 Service Worker 示例：使用 Hono 的 `app.fetch` 处理请求（需以 module 注册）
// 说明：在页面中通过 `navigator.serviceWorker.register('/sw.js', { type: 'module' })` 注册。

import { Hono } from 'https://unpkg.com/hono@3.4.5?module';

const CACHE_NAME = 'learn-hono-v1';
const OFFLINE_URL = '/offline.html';

const app = new Hono();

// 示例路由
app.get('/', (c) => c.text('Hello from Hono running inside Service Worker'));
app.get('/api/hello', (c) => c.json({ message: 'Hello from SW Hono API' }));

// 安装时缓存离线页面
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL]))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// 使用 Hono app.fetch 处理所有请求，若失败则回退到离线页面
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        return await app.fetch(event.request);
      } catch (err) {
        // 如果请求是导航，返回离线页面缓存
        if (event.request.mode === 'navigate') {
          const cached = await caches.match(OFFLINE_URL);
          if (cached) return cached;
        }
        // 否则尝试直接网络请求或返回 503
        try {
          return await fetch(event.request);
        } catch (_e) {
          return new Response('Service Unavailable', { status: 503 });
        }
      }
    })()
  );
});

// 可选：监听来自页面的消息
self.addEventListener('message', (e) => {
  console.log('SW received message:', e.data);
});

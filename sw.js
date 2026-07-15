// 手冲咖啡日志 PWA Service Worker
// 版本：bump 此值即可让用户在下次访问时拿到最新文件
const VERSION = 'brewlab-v13.21.1-2026-07-14';
const PRECACHE = VERSION + '-precache';

// 需要预缓存的核心资源（同目录相对路径）
const PRECACHE_URLS = [
  './',
  './pour_over_log.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-180.png',
  './icon-maskable-512.png',
  './splash-1290x2796.png',
  './splash-1179x2556.png',
  './splash-1170x2532.png',
  './splash-1668x2388.png'
];

// 安装：预缓存核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(PRECACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch((err) => {
        // 单个资源失败不应阻塞 SW 安装
        console.warn('[SW] precache 部分失败：', err);
      }))
      .then(() => self.skipWaiting())
  );
});

// 激活：清理旧版本缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((k) => k !== PRECACHE).map((k) => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

// fetch 策略：
//   导航请求（HTML）→ network-first，离线兜底缓存
//   其他同源资源 → cache-first
//   跨域请求 → 透传，不缓存
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(PRECACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((cached) => cached || caches.match('./pour_over_log.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(PRECACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached);
    })
  );
});

// 接收主页面发来的消息：手动检查更新 / 强制激活新版本
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

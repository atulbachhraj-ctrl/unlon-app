const CACHE_NAME = 'unlon-v1';
const OFFLINE_URL = '/offline.html';

const PRE_CACHE_URLS = [
  '/',
  '/home',
  '/discover',
  '/confess',
  '/night',
  '/profile',
  '/chats',
  '/login',
  '/signup',
  '/offline.html',
];

// Install: pre-cache app shell and main routes
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRE_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch: apply different strategies based on request type
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Network-first for Supabase API calls
  if (url.hostname.includes('supabase')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Cache-first for Google Fonts
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com'
  ) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Cache-first for static assets (images, fonts, CSS, JS)
  if (isStaticAsset(url.pathname)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // Network-first for navigation and everything else
  event.respondWith(networkFirst(request));
});

function isStaticAsset(pathname) {
  return /\.(js|css|png|jpg|jpeg|gif|svg|webp|ico|woff|woff2|ttf|eot|otf)$/i.test(pathname);
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) return cachedResponse;

    // For navigation requests, show the offline page
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }

    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) return cachedResponse;

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    if (request.mode === 'navigate') {
      return caches.match(OFFLINE_URL);
    }
    return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

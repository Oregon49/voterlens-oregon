// VoterLens service worker — enables PWA install prompt, basic offline shell
// v4 (Nov 12, 2026): v3 was network-first for HTML, but the fetch could still
// be satisfied from the browser HTTP cache, and a page restored from memory
// (swipe away and reopen) never fetched at all. v4 forces the navigation
// fetch past the HTTP cache, and the page itself reloads on bfcache restore
// (see index.html pageshow handler). Old cache is cleared on activate.
var CACHE = 'voterlens-v4';
var SHELL = ['/', '/index.html', '/manifest.json', '/assets/icon-192.png', '/assets/icon-512.png'];
self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(SHELL); }).then(function() { return self.skipWaiting(); }));
});
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(names) {
      return Promise.all(names.filter(function(n) { return n !== CACHE; }).map(function(n) { return caches.delete(n); }));
    }).then(function() { return self.clients.claim(); })
  );
});
self.addEventListener('fetch', function(e) {
  if (e.request.method !== 'GET') return;
  // Navigation / HTML: network first, bypassing the HTTP cache, so saved-app
  // users get the latest ballot and fixes without a fresh link. Offline:
  // fall back to cache.
  if (e.request.mode === 'navigate' || (e.request.headers.get('accept') || '').indexOf('text/html') !== -1) {
    e.respondWith(
      fetch(e.request, { cache: 'reload' }).then(function(res) {
        var copy = res.clone();
        caches.open(CACHE).then(function(c) { c.put(e.request, copy); });
        return res;
      }).catch(function() { return caches.match(e.request).then(function(hit) { return hit || caches.match('/index.html'); }); })
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(function(hit) {
      return hit || fetch(e.request).then(function(res) {
        return res;
      }).catch(function() { return caches.match('/index.html'); });
    })
  );
});

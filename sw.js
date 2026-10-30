// VoterLens service worker — enables PWA install prompt, basic offline shell
// v3 (Oct 30, 2026): saved-app users were stuck on v2's cached index.html,
// so HTML/navigation is now network-first. Old cache is cleared on activate.
var CACHE = 'voterlens-v3';
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
  // Navigation / HTML: network first, so saved-app users get the latest
  // ballot and fixes without a fresh link. Offline: fall back to cache.
  if (e.request.mode === 'navigate' || (e.request.headers.get('accept') || '').indexOf('text/html') !== -1) {
    e.respondWith(
      fetch(e.request).then(function(res) {
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

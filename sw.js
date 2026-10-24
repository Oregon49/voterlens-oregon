// VoterLens service worker — enables PWA install prompt, basic offline shell
var CACHE = 'voterlens-v2';
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
  e.respondWith(
    caches.match(e.request).then(function(hit) {
      return hit || fetch(e.request).then(function(res) {
        return res;
      }).catch(function() { return caches.match('/index.html'); });
    })
  );
});

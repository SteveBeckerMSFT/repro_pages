"use strict";

oninstall = (install_event) => {
  install_event.waitUntil(
    caches.open('v1').then(cache => {
      return cache.addAll([
        'app.js',
        'code_cache.html',
        'load_image.html',
        'load_image.js',
        'image.png',
      ]);
    })
  );
}

onfetch = (fetch_event) => {
  fetch_event.respondWith(caches.match(fetch_event.request));
}

"use strict";

skipWaiting();

onactivate = () => {
  return clients.claim();
}

onfetch = (fetchEvent) => {
  console.log(fetchEvent.request.url);
  fetchEvent.respondWith(fetch(fetchEvent.request));
};

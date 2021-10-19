"use strict";

skipWaiting();

onactivate = () => {
  return clients.claim();
}

onmessage = (messageEvent) => {
  registration.showNotification(`ServiceWorkerGlobalScope Title ${messageEvent.data}`, { body: `ServiceWorkerGlobalScope Body ${messageEvent.data}`, icon: "../resources/happy.jpg" })
    .then(() => {
      messageEvent.source.postMessage("ServiceWorkerGlobalScope showNotification() succeeded.");
    }).catch((error) => {
      messageEvent.source.postMessage(`ServiceWorkerGlobalScope showNotification() failed: ${error}.`);
    });
};

onnotificationclick = (event) => {
  clients.matchAll()
    .then((resultList) => {
      resultList.forEach((client) => {
        const notification = event.notification;
        client.postMessage(`ServiceWorkerGlobalScope 'click' event for: ${notification.title} , timestamp: ${new Date(notification.timestamp)}, requireInteraction: ${notification.requireInteraction}, silent: ${notification.silent}`);
        notification.close();
      });
    });
  event.waitUntil(new Promise((resolve) => {
    setTimeout(() => {
      clients.openWindow('on-click.html');
      resolve();
    }, 0);
  }));
};

onnotificationclose = (event) => {
  clients.matchAll()
    .then((resultList) => {
      resultList.forEach((client) => {
        const notification = event.notification;
        client.postMessage(`ServiceWorkerGlobalScope 'close' event for: ${notification.title} , timestamp: ${new Date(notification.timestamp)}, requireInteraction: ${notification.requireInteraction}, silent: ${notification.silent}`);
      });
    });
};

onfetch = (fetchEvent) => {
    console.log(fetchEvent.request.url);
    fetchEvent.respondWith(fetch(fetchEvent.request));
}

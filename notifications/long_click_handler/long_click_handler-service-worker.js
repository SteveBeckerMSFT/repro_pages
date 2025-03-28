"use strict";

const longTime = 2 * 60 * 1000; // 2 minutes.

skipWaiting();

onactivate = () => {
  return clients.claim();
}

onnotificationclick = (event) => {
  const notification = event.notification;

  clients.matchAll()
    .then((resultList) => {
      resultList.forEach((client) => {
        client.postMessage(`ServiceWorkerGlobalScope 'click' event for: ${notification.title} , timestamp: ${new Date(notification.timestamp)}, requireInteraction: ${notification.requireInteraction}, silent: ${notification.silent}`);
      });
    });

  event.waitUntil(new Promise((resolve) => {
    setTimeout(() => {
      clients.openWindow('on-click.html');
      resolve();
    }, longTime);
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

  event.waitUntil(new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, longTime);
  }));
};

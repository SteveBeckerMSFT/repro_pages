"use strict";

onmessage = (messageEvent) => {
  if (messageEvent.data === "close") {
    closeNotifications();
  } else {
    showNotification(messageEvent.data);
  }
};

let notificationList = [];

function showNotification(title) {
  const notification = new Notification(`DedicatedWorkerGlobalScope Title ${title}`, { body: `DedicatedWorkerGlobalScope Body ${title}`, icon: "../resources/happy.jpg" });
  notificationList.push(notification);
  notification.onclick = () => {
    postMessage(`DedicatedWorkerGlobalScope 'click' event for: ${notification.title}`);
  };
  notification.onerror = () => {
    postMessage(`DedicatedWorkerGlobalScope 'error' event for: ${notification.title}`);
  };
  notification.onshow = () => {
    postMessage(`DedicatedWorkerGlobalScope 'show' event for: ${notification.title}`);
  };
  notification.onclose = () => {
    postMessage(`DedicatedWorkerGlobalScope 'close' event for: ${notification.title}`);
  };
}

function closeNotifications() {
  notificationList.forEach((toast) => {
    toast.close();
  });
  notificationList = [];
}
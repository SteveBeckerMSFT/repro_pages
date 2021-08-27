"use strict";

onfetch = (fetchEvent) => {
    console.log(fetchEvent.request.url);
    fetchEvent.respondWith(fetch(fetchEvent.request));
}

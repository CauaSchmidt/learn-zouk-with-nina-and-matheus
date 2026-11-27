/*
  O site antigo do learnzouk.com instalava um "service worker" que guardava
  uma cópia do site no navegador de quem visitava. Este arquivo substitui o
  antigo: apaga a cópia guardada, se desinstala e recarrega a página,
  para que todo mundo passe a ver o site novo. Não apagar este arquivo.
*/
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil((async function () {
    var keys = await caches.keys();
    await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    await self.registration.unregister();
    var clients = await self.clients.matchAll({ type: "window" });
    clients.forEach(function (client) { client.navigate(client.url); });
  })());
});

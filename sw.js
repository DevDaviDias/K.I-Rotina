// sw.js — Service Worker para funcionar offline v2
const CACHE = "rotina-v2";
const ASSETS = ["/", "/index.html", "/style.css", "/script.js", "/manifest.json", "/icon-192.png", "/icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).catch(() => caches.match("/index.html")))
  );
});

self.addEventListener("push", e => {
  const data = e.data?.json() || { title: "Rotina", body: "Hora da próxima tarefa!" };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/icon-192.png",
    badge: "/icon-192.png"
  }));
});

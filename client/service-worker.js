const cacheName = 'cache-v1';
const precacheResources = [
  '/',
  'index.html',
  'newPatient.html',
  'newConsultation.html',
  'adm/mapeamento.html',
  'css/master.css',
  'img/reload.png',
  'img/NAACAO.png',
  'img/favicon.ico',
];

self.addEventListener('install', event => {
  console.log('Service worker install event!');
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        return cache.addAll(precacheResources);
      })
  );
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event!');
});

self.addEventListener('fetch', event => {
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(caches.match(event.request)
    .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request);
      })
    );
    event.waitUntil(update(event.request));
});

function update(request) {
  return caches.open(cacheName).then(function (cache) {
    return fetch(request).then(function (response) {
      return cache.put(request, response);
    });
  });
}

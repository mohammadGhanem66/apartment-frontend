console.log("Service worker created");
const CACHE_NAME = 'app-cache-resources';
const dynamicCahceName = 'dynamic-cahce-v1';
const assetsToCache = [
  '/',
  'index.html',
  'css/bracket.css',
  'js/dashboard.js',
  'js/bracket.js',
  'img/logo.png',
  'lib/@fortawesome/fontawesome-free/css/all.min.css',
  'lib/ionicons/css/ionicons.min.css',
  'lib/jquery/jquery.min.js'
];

self.addEventListener('install', (event) => {
  console.log("service worker start installing !!");
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      cache.addAll(assetsToCache);
    })
  );
  // event.waitUntil(
  //   caches.open(CACHE_NAME)
  //     .then((cache) => {
  //       return cache.addAll(assetsToCache);
  //     })
  // );
});
self.addEventListener('activate', (event) => {
  console.log("Service worker activated");
  event.waitUntil(
    caches.keys().then(keys => {
      console.log(keys);
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    })
  );

});

// self.addEventListener('fetch', (event) => {
//   console.log(event.request);

//   event.respondWith(
//     caches.match(event.request).then(cacheRes => {
//       return cacheRes || fetch(event.request).then(fetchRes => {
//         return caches.open(dynamicCahceName).then(cache => {
//           cache.put(event.request.url, fetchRes.clone());
//           return fetchRes;
//         })
//       })
//     }).catch(() => {
//       if (event.request.headers.get('accept').includes('text/html')) {
//         return caches.match('/');
//       }
//     })
//   );
  
// //   event.respondWith(
// //     caches.match(event.request)
// //       .then((response) => {
// //         return response || fetch(event.request);
// //       })
// //   );
// });


self.addEventListener('fetch', (event) => {
  const apiUrlPattern = 'https://apartman-service-production.up.railway.app';

  if (event.request.url.startsWith(apiUrlPattern)) {
    // For API requests, use a network-first strategy
    event.respondWith(
      fetch(event.request)
        .then(fetchRes => {
          return caches.open(dynamicCahceName).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          });
        })
        .catch(() => {
          // If network fails, serve from cache
          return caches.match(event.request);
        })
    );
  } else {
    // For static assets, use a cache-first strategy
    event.respondWith(
      caches.match(event.request).then(cacheRes => {
        return cacheRes || fetch(event.request).then(fetchRes => {
          return caches.open(dynamicCahceName).then(cache => {
            cache.put(event.request.url, fetchRes.clone());
            return fetchRes;
          });
        });
      })
    );
  }
});

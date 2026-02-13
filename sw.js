const CACHE_NAME = 'youtube-ebook-site-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/thank-you.html',
  // যদি আরও ফাইল যোগ করতে চান (CSS, JS, images)
  // '/styles.css',
  // '/script.js',
  // '/icon-192.png',
  // '/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching files');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.error('Cache failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // ক্যাশে থাকলে ক্যাশ থেকে দাও, না থাকলে নেটওয়ার্ক থেকে
        return response || fetch(event.request).then(networkResponse => {
          // নতুন রিসোর্স ক্যাশে রাখো (অপশনাল)
          if (networkResponse && networkResponse.status === 200) maksud {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      })
      .catch(() => {
        // অফলাইনে কোনো ফলব্যাক পেজ দেখাতে চাইলে
        // return caches.match('/offline.html');
      })
  );
});

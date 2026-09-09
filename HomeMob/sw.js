// متغیر نسخه: هر بار که کدها را تغییر می‌دهید، این عدد را یک شماره بالا ببرید (مثلاً v12)
const APP_VERSION = 'v105'; 
const CACHE_NAME = 'bonyad-dashboard-' + APP_VERSION; 

self.addEventListener('install', (event) => {
    // دستور skipWaiting بلافاصله نسخه جدید را فعال می‌کند
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // پاکسازی بی‌رحمانه تمام کش‌های قبلی که در گوشی ذخیره شده است
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clearing old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // در دست گرفتن کنترل فوری صفحات باز
    );
});

self.addEventListener('fetch', (event) => {
    // استراتژی Network First
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // فقط در صورتی که درخواست موفق و از نوع GET بود کش را آپدیت کن
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET' && event.request.url.startsWith('http')) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // اگر اینترنت قطع بود از کش بخوان
                return caches.match(event.request, { ignoreSearch: true });
            })
    );
});

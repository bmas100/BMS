// این نام را کاملا تغییر دادیم تا سیستم مجبور به ساخت کش جدید شود
const CACHE_NAME = 'bonyad-dashboard-v10-killer'; 

self.addEventListener('install', (event) => {
    // دستور skipWaiting بلافاصله نسخه جدید را فعال می‌کند و منتظر بسته شدن برنامه نمی‌ماند
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // پاکسازی بی‌رحمانه تمام کش‌های قبلی که در گوشی رئیس و مدیرکل ذخیره شده است
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
    // استراتژی Network First: همیشه اول از سرور گیت‌هاب بگیر
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // اگر درخواست موفق بود و از نوع GET بود، آن را در کش جدید ذخیره کن
                if (event.request.method === 'GET' && event.request.url.startsWith('http')) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // اگر اینترنت قطع بود، از کش بخوان و پارامترهای اختصاصی مثل ?u= را نادیده بگیر
                return caches.match(event.request, { ignoreSearch: true });
            })
    );
});

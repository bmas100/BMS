// هر بار که تغییری در پروژه دادید، این عدد را عوض کنید (مثلا v3, v4 و ...)
const CACHE_NAME = 'bonyad-dashboard-v2'; 

const ASSETS_TO_CACHE = [
    './Home.html',
    './style.css?v=2',
    './banner.css?v=2',
    './BonyadLogo.png'
];

// نصب سرویس ورکر و اجبار به فعال شدن فوری
self.addEventListener('install', (event) => {
    self.skipWaiting(); // این دستور باعث می‌شود منتظر بسته شدن تب نماند و فورا آپدیت شود
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// فعال‌سازی و پاک کردن کش‌های نسخه قبلی
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // اگر نام کش با نام فعلی فرق داشت، آن را پاک کن
                    if (cacheName !== CACHE_NAME) {
                        console.log('کش قدیمی پاک شد:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // کنترل فوری صفحات باز برای اعمال تغییرات
    );
});

// استراتژی Network-First: اول از اینترنت بگیر، اگر اینترنت قطع بود از کش بخوان
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // آپدیت کردن کش با دیتای جدید
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // در صورت قطعی اینترنت، از حافظه بخوان
                return caches.match(event.request);
            })
    );
});

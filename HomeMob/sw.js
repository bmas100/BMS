// با هر بار آپدیت اساسی داشبورد، این عدد را یک شماره بالا ببرید
const CACHE_NAME = 'bonyad-dashboard-v4'; 

// فایل‌هایی که نیاز به کش شدن اولیه دارند (بدون فایل HTML)
const ASSETS_TO_CACHE = [
    './style.css?v=3',
    './banner.css?v=3',
    './BonyadLogo.png'
];

self.addEventListener('install', (event) => {
    // نصب و اجرای فوری نسخه جدید
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    // پاک کردن تمام کش‌های مربوط به نسخه‌های قبل
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName); 
                    }
                })
            );
        }).then(() => self.clients.claim()) 
    );
});

self.addEventListener('fetch', (event) => {
    // استراتژی Network-First با نادیده گرفتن پارامترهای URL
    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // اگر اینترنت وصل بود، جدیدترین نسخه را بگیر و در کش ذخیره کن
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            })
            .catch(() => {
                // در زمان قطعی اینترنت، از کش بخوان و پارامتر u= را نادیده بگیر
                return caches.match(event.request, { ignoreSearch: true });
            })
    );
});

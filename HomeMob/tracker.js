const LOG_URL = "https://script.google.com/macros/s/AKfycbwV2BLqtTU789b2I-Na3cGzonALX0AKktQc5pRWcxzkvtBOzLmufd1mCn7YVWKlq4M6/exec";

const Tracker = {
    init() {
        const p = new URLSearchParams(location.search);
        
        // دریافت کد کاربر از لینک، و اگر نبود خواندن از حافظه مرورگر
        let urlUserCode = p.get("u");
        if (urlUserCode) {
            this.userCode = urlUserCode;
            localStorage.setItem("UserCode", urlUserCode); // ذخیره برای صفحات بعدی
        } else {
            this.userCode = localStorage.getItem("UserCode") || "Unknown";
        }

        // ایجاد یا دریافت SessionID برای نشست فعلی (با بسته شدن تب پاک می‌شود)
        this.sessionId = sessionStorage.getItem("SessionID");
        if (!this.sessionId) {
            this.sessionId = crypto.randomUUID();
            sessionStorage.setItem("SessionID", this.sessionId);
        }

        // ایجاد یا دریافت DeviceID ثابت برای دستگاه
        this.deviceId = localStorage.getItem("DeviceID");
        if (!this.deviceId) {
            this.deviceId = crypto.randomUUID();
            localStorage.setItem("DeviceID", this.deviceId);
        }
        
        // فعال‌سازی رهگیری کلیک‌ها
        this.trackClicks();
    },

    send(action, target = "", result = "Success") {
        const data = new URLSearchParams();
        
        data.append("UserCode", this.userCode);
        data.append("DateTime", new Date().toISOString());
        data.append("SessionID", this.sessionId);
        data.append("Page", location.pathname.split("/").pop() || "Home");
        data.append("Action", action);
        data.append("Target", target);
        data.append("Result", result);
        data.append("IP", ""); // استخراج IP از سمت کلاینت بدون سرویس جانبی ممکن نیست
        data.append("VisitDuration", ""); 
        data.append("DeviceID", this.deviceId);
        data.append("Browser", navigator.userAgent);
        data.append("OS", navigator.platform);
        data.append("Resolution", screen.width + "x" + screen.height);
        data.append("Referrer", document.referrer);
        data.append("PWA", window.matchMedia("(display-mode: standalone)").matches);

        // استفاده از fetch با no-cors و keepalive برای اطمینان از ارسال در زمان تغییر صفحه
        fetch(LOG_URL, {
            method: 'POST',
            mode: 'no-cors', 
            keepalive: true, // جایگزین مدرن و مطمئن‌تر برای sendBeacon
            body: data
        }).catch(err => console.error("Tracking error:", err));
    },

    trackClicks() {
        // پیدا کردن تمام لینک‌های (کارت‌های) داخل صفحه
        document.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // ارسال رویداد کلیک قبل از اینکه کاربر به صفحه جدید برود
                this.send("Click", link.href);
            });
        });
    }
};

// راه‌اندازی و ثبت ورود به صفحه
Tracker.init();
Tracker.send("Open");

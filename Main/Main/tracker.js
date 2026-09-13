const LOG_URL = "https://script.google.com/macros/s/AKfycbwhxzuNr9GOMwQ6m0rKKHpyLSG5bG65OsOkYgY7z7YaKnxpVO6j6JrJrqCGn3dV-g/exec";

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
        const now = new Date();
        
        // استخراج تاریخ شمسی و زمان به صورت تفکیک شده
        const dateStr = now.toLocaleDateString('fa-IR'); 
        const timeStr = now.toLocaleTimeString('fa-IR', { hour12: false }); 
        
        data.append("UserCode", this.userCode);
        data.append("Date", dateStr); 
        data.append("Time", timeStr); 
        data.append("SessionID", this.sessionId);
        data.append("Page", location.pathname.split("/").pop() || "Home");
        data.append("Action", action);
        data.append("Target", target);
        data.append("Result", result);
        data.append("IP", ""); // رزرو شده برای توسعه آینده
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
            keepalive: true, 
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

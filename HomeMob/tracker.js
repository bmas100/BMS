const LOG_URL = "https://script.google.com/macros/s/AKfycbwV2BLqtTU789b2I-Na3cGzonALX0AKktQc5pRWcxzkvtBOzLmufd1mCn7YVWKlq4M6/exec";

const Tracker = {

    init() {

        const p = new URLSearchParams(location.search);

        this.userCode = p.get("u") || "";

        this.sessionId = crypto.randomUUID();

        this.deviceId = localStorage.getItem("DeviceID");

        if (!this.deviceId) {

            this.deviceId = crypto.randomUUID();

            localStorage.setItem("DeviceID", this.deviceId);

        }

    },

    send(action, target = "", result = "Success") {

        const form = new FormData();

        form.append("UserCode", this.userCode);
        form.append("DateTime", new Date().toISOString());
        form.append("SessionID", this.sessionId);
        form.append("Page", location.pathname.split("/").pop());
        form.append("Action", action);
        form.append("Target", target);
        form.append("Result", result);
        form.append("IP", "");
        form.append("VisitDuration", "");
        form.append("DeviceID", this.deviceId);
        form.append("Browser", navigator.userAgent);
        form.append("OS", navigator.platform);
        form.append("Resolution", screen.width + "x" + screen.height);
        form.append("Referrer", document.referrer);
        form.append("PWA", window.matchMedia("(display-mode: standalone)").matches);

        navigator.sendBeacon(LOG_URL, form);

    }

};

Tracker.init();

Tracker.send("Open");

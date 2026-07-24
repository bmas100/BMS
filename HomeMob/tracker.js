const LOG_URL = "https://script.google.com/macros/s/AKfycbwV2BLqtTU789b2I-Na3cGzonALX0AKktQc5pRWcxzkvtBOzLmufd1mCn7YVWKlq4M6/exec";

const Tracker = {

    userCode: "",
    sessionId: "",
    deviceId: "",

    init() {

        const p = new URLSearchParams(location.search);

        this.userCode = p.get("u") || "";

        this.sessionId = crypto.randomUUID();

        this.deviceId = localStorage.getItem("deviceId");

        if (!this.deviceId) {

            this.deviceId = crypto.randomUUID();

            localStorage.setItem("deviceId", this.deviceId);

        }

    },

    async send(action, target = "", result = "Success") {

        const data = {

            EventID: crypto.randomUUID(),

            UserCode: this.userCode,

            DateTime: new Date().toISOString(),

            SessionID: this.sessionId,

            Page: location.pathname.split("/").pop(),

            Action: action,

            Target: target,

            Result: result,

            IP: "",

            VisitDuration: "",

            DeviceID: this.deviceId,

            Browser: navigator.userAgent,

            OS: navigator.platform,

            Resolution: screen.width + "x" + screen.height,

            Referrer: document.referrer,

            PWA: window.matchMedia("(display-mode: standalone)").matches

        };

        try {

            const r = await fetch(LOG_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)

            });

            console.log(await r.text());

        }
        catch (e) {

            console.error(e);

        }

    }

};

Tracker.init();

Tracker.send("Open");

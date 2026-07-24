const LOG_URL = "https://script.google.com/macros/s/AKfycbwV2BLqtTU789b2I-Na3cGzonALX0AKktQc5pRWcxzkvtBOzLmufd1mCn7YVWKlq4M6/exec";

function getUserCode() {
    const p = new URLSearchParams(location.search);
    return p.get("u") || "";
}

async function testConnection() {

    const data = {

        EventID: crypto.randomUUID(),

        UserCode: getUserCode(),

        DateTime: new Date().toISOString(),

        SessionID: "TEST",

        Page: "Home",

        Action: "Open",

        Target: "",

        Result: "Success",

        IP: "",

        VisitDuration: "",

        DeviceID: "TEST_DEVICE",

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

testConnection();

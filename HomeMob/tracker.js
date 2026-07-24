const LOG_URL = "https://script.google.com/macros/s/AKfycbzsa899SuNFVfusSNib0J1IvvycMYsU0z9paTB7Z8pgypFp60L-469Km6gTDGUrusQ/exec";

async function logEvent(action, target = "", result = "Success") {

    const now = new Date();

    const data = {

        EventID: crypto.randomUUID(),

        UserCode: "TEST1234",

        DateTime: now.toISOString(),

        SessionID: crypto.randomUUID(),

        Page: location.pathname.split("/").pop(),

        Action: action,

        Target: target,

        Result: result,

        IP: "",

        VisitDuration: "",

        DeviceID: "TEST_DEVICE",

        Browser: navigator.userAgent,

        OS: navigator.platform,

        Resolution: screen.width + "x" + screen.height,

        Referrer: document.referrer,

        PWA: window.matchMedia('(display-mode: standalone)').matches

    };

    try{

        const res = await fetch(LOG_URL,{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(data)

        });

        console.log(await res.text());

    }
    catch(e){

        console.error(e);

    }

}

logEvent("Open");

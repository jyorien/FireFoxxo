// listen to tab open event
browser.tabs.onCreated.addListener((tab) => {
    browser.storage.local.get("tab_count")
    .then((items) => {
        // if nothing is saved, initialise to 0
        if (items["tab_count"] === undefined) {
            tabCountLifetime = 0
            tabCountDaily = 0
        } 
        else {
        // if not undefined, get values
            if (items["tab_count"]["tab_count_lifetime"] != undefined) {
                tabCountLifetime = items["tab_count"]["tab_count_lifetime"]
                console.log(items["tab_count"]["tab_count_lifetime"])
            }
            if (items["tab_count"]["tab_count_lifetime"] != undefined) {
                tabCountDaily = items["tab_count"]["tab_count_daily"]
                console.log(items["tab_count"]["tab_count_daily"])
            }
        }
        // +1 tab
        tabCountLifetime += 1

        browser.storage.local.get("last_timestamp")
        .then((currentItems) => {
            let lastTimestamp = currentItems["last_timestamp"]
            let previousDate = new Date(lastTimestamp)
            let currentDate = new Date()

            // TODO: if previous date not current date, should reset the count and update the timestamp
            // but updating timestamp might affect screen time tracking
            if (currentDate.getDay() == previousDate.getDay() &&
                currentDate.getMonth() == previousDate.getMonth() &&
                currentDate.getFullYear() == previousDate.getFullYear()) {
                    tabCountDaily += 1
            } 
            else {
                tabCountDaily = 1
            }
            browser.storage.local.set({"tab_count": {"tab_count_lifetime": tabCountLifetime, "tab_count_daily": tabCountDaily}})
        })
        
        })
})
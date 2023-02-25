getTimeSinceLastChecked()

function getTimeSinceLastChecked() {
    browser.storage.local.get("last_timestamp")
        .then((currentItems) => {
            // get timestamp of when the function is called
            let currentTimestamp = Date.now()
            let currentDate = new Date(currentTimestamp)
            // get last saved timestamp
            let lastTimestamp = currentItems["last_timestamp"]
            let previousDate = new Date(lastTimestamp)
            // get time difference in seconds
            let timeDifference = (currentDate.getTime() - previousDate.getTime()) / 1000

            browser.storage.local.get("screen_time")
                    .then((items) => {
                        let currentScreenTime = items["screen_time"]
                        // if stil on the same day, add to screen time
                        if (currentDate.getDay() == previousDate.getDay() &&
                            currentDate.getMonth() == previousDate.getMonth() &&
                            currentDate.getFullYear() == previousDate.getFullYear()) {
                                if (currentScreenTime === undefined) {
                                    currentScreenTime = timeDifference
                                } 
                                else {
                                    currentScreenTime += timeDifference
                                }
                            }
                        // reset screen time if day is different
                        else {
                            currentScreenTime = timeDifference
                        }
                        // overwrite the last timestamp
                        browser.storage.local.set({"last_timestamp": currentTimestamp})
                        // save to local extension storage so panel can retrieve and display
                        browser.storage.local.set({"screen_time": currentScreenTime})
                })
        })
}


function formatTime(seconds) {
    let hours = Math.floor(seconds / 3600);
    let minutes = Math.floor((seconds % 3600) / 60);
    let remainingSeconds = seconds % 60;
    return `${hours} hours, ${minutes} minutes, ${remainingSeconds} seconds`;
}
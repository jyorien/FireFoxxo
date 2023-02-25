// save timestamp to storage when browser is started 
// for content script to compare the times to calculate total screen time
let currentTimestamp = Date.now()
browser.storage.local.set({"last_timestamp": currentTimestamp})




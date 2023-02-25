browser.runtime.onMessage.addListener((message) => {
    // list of engines to display
    let enginesList = message["enginesList"]
    console.log(enginesList)
 })

// use to open new tab in a custom query and defined search engine
// browser.runtime.sendMessage({"url": "mozilla", "engine": "Bing"})
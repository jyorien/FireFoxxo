browser.runtime.onMessage.addListener((message) => {
    console.log(message)
 })

// use to open new tab in a custom query and defined search engine
// browser.runtime.sendMessage({"url": "mozilla", "engine": "Bing"})
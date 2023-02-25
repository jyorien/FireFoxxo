// listen for "url" and "engine" params in broadcasts from content scripts
browser.runtime.onMessage.addListener((message) => {
    if (message.url != null) {
        browser.search.search({query: message.url, engine: message.engine})
    }
})

// put in content scripts
// browser.runtime.sendMessage({"url": "mozilla", "engine": "Bing"})

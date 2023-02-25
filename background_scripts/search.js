// listen for "url" and "engine" params in broadcasts from content scripts
browser.runtime.onMessage.addListener((message) => {
    if (message.url != null) {
        browser.search.search({query: message.url, engine: message.engine})
    }
})

let enginesList
// broadcast list of search engines available for content scripts
browser.search.get()
.then((result) => {
    enginesList = result.map(result => result.name)
    browser.tabs.query({active: true}).then((res) => {
    // send list of engines to content script to display
    browser.tabs.sendMessage(res[0].id ,{"enginesList": enginesList})
    })
    
})

document.addEventListener('copy', (e) => {
    const selection = document.getSelection()
    e.clipboardData.setData("text/plain", selection.toString());

    let lastCopied = e.clipboardData.getData("text/plain")
    console.log("lastCopied", lastCopied)

    browser.storage.local.get("clipboard_history")
        .then((currentItems) => {
            let clipboard_history = currentItems["clipboard_history"]
            if (clipboard_history == undefined) {
                clipboard_history = []
            }
            console.log("clipboard_history", clipboard_history)

        clipboard_history = [lastCopied, ...clipboard_history]
        console.log(clipboard_history)
        browser.storage.local.set({"clipboard_history": clipboard_history})
    })
    e.preventDefault();
 });
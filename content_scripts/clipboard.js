document.addEventListener('copy', function(e){
    const selection = document.getSelection()
    e.clipboardData.setData("text/plain", selection.toString());

    let lastCopied = e.clipboardData.getData("text/plain")
    console.log("lastCopied", lastCopied)
    let currentItems = localStorage.getItem("clipboard_history")
    if (currentItems == null) {
        currentItems = []
    } else {
        currentItems = JSON.parse(currentItems)
    }
    console.log("currentItems", currentItems)
    currentItems = [lastCopied, ...currentItems]
    currentItems = JSON.stringify(currentItems)
    localStorage.setItem("clipboard_history", currentItems)
    console.log(localStorage.getItem("clipboard_history"))
    e.preventDefault();
 });
/**
 * CSS to hide everything on the page,
 * except for elements that have the "beastify-image" class.
 */
const hidePage = `body > :not(.beastify-image) {
    display: none;
  }`;


/**
* There was an error executing the script.
* Display the popup's error message, and hide the normal UI.
*/
function reportExecuteScriptError(error) {
    document.querySelector("#popup-content").classList.add("hidden");
    document.querySelector("#error-content").classList.remove("hidden");
    console.error(`Failed to execute beastify content script: ${error.message}`);
}

/**
* When the popup loads, inject a content script into the active tab,
* and add a click handler.
* If we couldn't inject the script, handle the error.
*/
browser.tabs
    .executeScript({ file: "/content_scripts/example.js" })
    .catch(reportExecuteScriptError);

// fetch and display clipboard history
browser.storage.local.get("clipboard_history")
    .then((currentItems) => {
        let clipboard_history =  currentItems["clipboard_history"]
        if (clipboard_history != null) {
            for (const item of clipboard_history) {
                let div = document.createElement("div")
                div.className = "copybtn"

                let btn = document.createElement("button")
                btn.innerText = "Copy"
                btn.addEventListener("click", (e) => {
                    console.log(item)
                     navigator.clipboard.writeText(item);
                })
                div.appendChild(btn)

                let p = document.createElement("p")
                p.innerText = item
                div.appendChild(p)

                document.getElementById("popup-content").appendChild(div)
            }
        }
    })






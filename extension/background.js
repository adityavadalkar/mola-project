chrome.action.disable();

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // console.log(changeInfo)
  if(changeInfo.status === "complete") {
    // console.log(tab.url)
    // console.log(changeInfo.status === "complete")
    if(tab.url.includes("twitter")) {
      console.log("enable");
      chrome.action.enable(tabId);
    }
    else{
      // console.log("dis ", tab.url)
      console.log("disable");
      chrome.action.disable(tabId);
    }
  }
})

chrome.action.onClicked.addListener(async (tab) => {
  await chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    files: ["content.js"],
  });
});
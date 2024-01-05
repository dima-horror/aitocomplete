chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("/settings.html") });
});
chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
  if (msg.action === "updateIcon") {
    if (msg.value) {
      chrome.action.setIcon({ path: "/img/icon128.png" })
    } else {
      chrome.action.setIcon({ path: "/img/icon128-gray.png" })
    }
  }
});
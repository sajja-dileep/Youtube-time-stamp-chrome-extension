function getCurrentTimestamp() {
    const video = document.querySelector('video');
    return video ? video.currentTime : null;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'getTimestamp') {
        const timestamp = getCurrentTimestamp();
        sendResponse({ timestamp });
    }
});

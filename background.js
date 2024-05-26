chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ bookmarks: [] });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'addBookmark') {
        chrome.storage.sync.get('bookmarks', (data) => {
            const bookmarks = data.bookmarks || [];
            bookmarks.push(request.bookmark);
            chrome.storage.sync.set({ bookmarks }, () => {
                sendResponse({ status: 'success' });
            });
        });
        return true;  // Keeps the message channel open for sendResponse
    }
});

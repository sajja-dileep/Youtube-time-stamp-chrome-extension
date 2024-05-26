document.getElementById('bookmark').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const tab = tabs[0];
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: getTimestamp
        }, (results) => {
            if (results && results[0] && results[0].result != null) {
                const timestamp = results[0].result;
                const bookmark = {
                    url: tab.url,
                    timestamp
                };
                chrome.runtime.sendMessage({ action: 'addBookmark', bookmark }, (response) => {
                    if (response.status === 'success') {
                        loadBookmarks();
                    }
                });
            }
        });
    });
});

function getTimestamp() {
    const video = document.querySelector('video');
    return video ? video.currentTime : null;
}

function loadBookmarks() {
    chrome.storage.sync.get('bookmarks', (data) => {
        const bookmarks = data.bookmarks || [];
        const bookmarksContainer = document.getElementById('bookmarks');
        bookmarksContainer.innerHTML = '';
        bookmarks.forEach((bookmark, index) => {
            const div = document.createElement('div');
            const a = document.createElement('a');
            a.href = `${bookmark.url}&t=${Math.floor(bookmark.timestamp)}s`;
            a.target = '_blank';
            a.textContent = `Bookmark ${index + 1} - ${new Date(bookmark.timestamp * 1000).toISOString().substr(11, 8)}`;
            div.appendChild(a);
            bookmarksContainer.appendChild(div);
        });
    });
}

document.addEventListener('DOMContentLoaded', loadBookmarks);

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const cringeSites = ['kitsu.io/*', 'anilist.co/*'];
    const skip = ['/episodes', '/chapters', '/characters', '/watch', '/reactions', '/franchise', '/staff', '/reviews', '/stats', '/social'];
    for (const site in cringeSites) {
        if (changeInfo.status === 'complete' && tab.url.match(cringeSites[site]) && !skip.some((e) => tab.url.includes(e))) {
            chrome.tabs.sendMessage(tabId, { type: 'tabUpdated', url: tab.url });
        }
    }
});

chrome.runtime.onInstalled.addListener((e) => e.reason === 'install' && defaultSettings());

const defaultSettings = () => {
    chrome.storage.sync.set({
        settings: {
            filter_setting: '0',
            category_setting: '1_2',
            query_setting: 'default',
            sort_setting: 'seeders',
            order_setting: 'desc',
        },
    });
};

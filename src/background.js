chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const manifestSites = chrome.runtime.getManifest().content_scripts[0].matches;
    if (changeInfo.status === 'complete') {
        if (manifestSites.some((site) => tab.url.match(site.split('*://*.').pop()))) {
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
            hide_button_setting: false,
            focus_setting: false,
            hotkey_key_setting: '',
            hotkey_modifier_setting: '',
            hotkey_query_setting: 'inherit',
        },
    });
};

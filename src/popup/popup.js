window.onload = () => {
    chrome.storage.sync.get('settings', (load) => {
        if (load.settings) {
            document.getElementById('filter_select').value = load.settings.filter_setting;
            document.getElementById('category_select').value = load.settings.category_setting;
            document.getElementById('sort_select').value = load.settings.sort_setting;
            document.getElementById('order_select').value = load.settings.order_setting;
        }
    });
};

const saveSettings = () => {
    const settings = {};
    settings['filter_setting'] = document.getElementById('filter_select').value;
    settings['category_setting'] = document.getElementById('category_select').value;
    settings['sort_setting'] = document.getElementById('sort_select').value;
    settings['order_setting'] = document.getElementById('order_select').value;
    return settings;
};

document.getElementById('save').onclick = () => {
    chrome.storage.sync.set({ settings: saveSettings() });
    chrome.tabs.query({}, (tabs) => {
        const manifestSites = chrome.runtime.getManifest().content_scripts[0].matches;
        for (const tab in tabs) {
            manifestSites.some((e) => tabs[tab].url.match(e.split('*://*.').pop())) && chrome.tabs.reload(tabs[tab].id);
        }
        window.close();
    });
};

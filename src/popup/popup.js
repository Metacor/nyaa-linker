window.onload = () => {
    chrome.storage.sync.get('settings', (load) => {
        if (load.settings) {
            document.getElementById('filter_select').value = load.settings.filter_setting;
            document.getElementById('category_select').value = load.settings.category_setting;
            document.getElementById('query_select').value = load.settings.query_setting;
            document.getElementById('sort_select').value = load.settings.sort_setting;
            document.getElementById('order_select').value = load.settings.order_setting;
            document.getElementById('hide_button_select').checked = load.settings.hide_button_setting;
            document.getElementById('focus_select').checked = load.settings.focus_setting;
            document.getElementById('hotkey_key_select').value = load.settings.hotkey_key_setting;
            document.getElementById('hotkey_modifier_select').value = load.settings.hotkey_modifier_setting;
            document.getElementById('hotkey_query_select').value = load.settings.hotkey_query_setting;
        }
    });
};

const saveSettings = () => {
    const settings = {};
    settings['filter_setting'] = document.getElementById('filter_select').value;
    settings['category_setting'] = document.getElementById('category_select').value;
    settings['query_setting'] = document.getElementById('query_select').value;
    settings['sort_setting'] = document.getElementById('sort_select').value;
    settings['order_setting'] = document.getElementById('order_select').value;
    settings['hide_button_setting'] = document.getElementById('hide_button_select').checked;
    settings['focus_setting'] = document.getElementById('focus_select').checked;
    settings['hotkey_key_setting'] = document.getElementById('hotkey_key_select').value.toLowerCase();
    settings['hotkey_modifier_setting'] = document.getElementById('hotkey_modifier_select').value;
    settings['hotkey_query_setting'] = document.getElementById('hotkey_query_select').value;
    return settings;
};

document.getElementById('settingsButton').onclick = () => {
    let settingsPopup = document.getElementById('settingsPage');
    settingsPopup.style.display !== 'grid' ? (settingsPopup.style.display = 'grid') : (settingsPopup.style.display = 'none');
};

document.getElementById('saveButton').onclick = () => {
    chrome.storage.sync.set({ settings: saveSettings() });
    chrome.tabs.query({}, (tabs) => {
        const manifestSites = chrome.runtime.getManifest().content_scripts[0].matches;
        for (const tab in tabs) {
            manifestSites.some((e) => tabs[tab].url.match(e.split('*://*.').pop())) && chrome.tabs.reload(tabs[tab].id);
        }
        window.close();
    });
};

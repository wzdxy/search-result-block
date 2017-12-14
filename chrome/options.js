// Saves options to chrome.storage.sync.
function save_options() {
    // Get Enable Config
    let extensionEnabled = document.getElementById('block-enabled').checked;

    // Get List Config
    let blockList = document.getElementById('site-list').value;   // String

    // Get Enigen Config
    let enabledSearchEngines = {
        baidu: document.getElementById('baidu').checked,
        google: document.getElementById('google').checked,
        bing: document.getElementById('bing').checked,
    }

    // Save Options
    chrome.storage.sync.set({
        extensionEnabled: extensionEnabled,
        blockList: blockList,
        enabledSearchEngines: enabledSearchEngines
    }, function () {
        var status = document.getElementById('status');
        status.textContent = 'Options saved.';
        setTimeout(function () {
            status.textContent = '';
        }, 1000);
    });
}

function restore_options() {
    chrome.storage.sync.get({
        extensionEnabled: true,
        blockList: '',
        enabledSearchEngines: {
            google: true, baidu: true, bing:true
        },
    }, function (items) {
        document.getElementById('block-enabled').checked=items.extensionEnabled;
        for (const engine in items.enabledSearchEngines) {
            document.getElementById(engine).checked = items.enabledSearchEngines[engine]
        }
        document.getElementById('site-list').value = items.blockList;
    });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',save_options);
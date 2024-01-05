import optionsGetter from "./services/options-getter";

// Saves options to chrome.storage
const saveOptions = () => {
    optionsGetter((options) => {
        options.openAiKey = document.getElementById('openAiKey').value;
        options.role = document.getElementById('role').value;
        chrome.storage.sync.set(options, () => {
            // Update status to let user know options were saved.
            const status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(() => {
                status.textContent = '';
            }, 750);
        });
    });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    optionsGetter((options) => {
        document.getElementById('openAiKey').value = options.openAiKey;
        document.getElementById('role').value = options.role;
    });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
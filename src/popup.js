import "./css/popup.scss";
import optionsGetter from "./services/options-getter";

// Saves options to chrome.storage
const saveOptions = () => {
    optionsGetter((options) => {
        options.enabled = document.getElementById('on_off_switcher').checked;
        chrome.storage.sync.set(options, () => {
            console.log('Options saved');
        });
    });
};

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
const restoreOptions = () => {
    optionsGetter((options) => {
        document.getElementById('on_off_switcher').checked = options.enabled;
    });
};

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('on_off_switcher').addEventListener('click', saveOptions);
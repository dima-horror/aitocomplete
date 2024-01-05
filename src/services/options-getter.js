export default function(callback) {
    chrome.storage.sync.get(
        { 
            openAiKey: '',
            enabled: true,
            role: 'senior developer'
        },
        (options) => {
            callback(options)
        }
    );
};
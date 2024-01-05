import "./css/inject.scss";
import getContext from "./services/context-getter";
import siteDetermination from "./services/site-determination";
import { BindTextArea, UnbindTextArea } from "./services/textarea-suggest";
import { GetSuggestion } from "./services/open-ai";
import optionsGetter from "./services/options-getter";

const Autocomplete = (target, site, options) => {
    let chat = getContext(target, site);
    let currentInput = target.value.trim();
    
    if (target.aiUpdateSuggestion 
        && currentInput !== target.aiLastInput
        && !target.aiSuggestionSelected
        ) 
    {
        target.aiLastInput = currentInput;
        GetSuggestion(chat, currentInput, options).then((suggestion) => {
            if (suggestion)
                target.aiUpdateSuggestion(suggestion);
            else 
                target.aiRemoveSuggestion();
        });
    }
}
let delayTimer = undefined;
const AutocompleteWithDelay = (target, site, options) => {
    target.aiRemoveSuggestion && target.aiRemoveSuggestion();
    delayTimer && clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
        Autocomplete(target, site, options);
    }, 3000);
}


var onLoaded = function(options) {
    if (!options || !options.openAiKey) {
        console.warn('AI autocomplete not enabled. Open AI Key is not set');
        return;
    }
    chrome.runtime.sendMessage({
        action: 'updateIcon',
        value: options.enabled
    });
    if (options.enabled === false) {
        // AI autocomplete is disabled
        return;
    }
    
    var site = siteDetermination();
    // Add event listener for focus on any text area
    document.body.addEventListener('focus', function(event){
        if (event.target.tagName === 'TEXTAREA') {
            BindTextArea(event.target);
            AutocompleteWithDelay(event.target, site, options);
            if (event.target.aiLastSuggestion){
                event.target.aiUpdateSuggestion(event.target.aiLastSuggestion);
            }
        }
    }, true); 
    document.body.addEventListener('blur', function(event){
        if (event.target.tagName === 'TEXTAREA') {
            UnbindTextArea(event.target);
        }
    }, true); 
    
    document.body.addEventListener('input', function(event){
        if (event.target.tagName === 'TEXTAREA') {
            if (event.target.value.trim() === '') delete event.target.aiSuggestionSelected;
            AutocompleteWithDelay(event.target, site, options);
        }
    }, true); 
    
}

if (document.readyState !== 'loading' ) {
    //document is already ready, just execute code
    optionsGetter((options)=> {
        onLoaded(options);
    });
    
} else {
    //document was not ready, wait
    document.addEventListener('DOMContentLoaded', function () {
        optionsGetter((options)=> {
            onLoaded(options);
        });
    });
}
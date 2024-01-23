import "./css/inject.scss";
import getContext from "./services/context-getter";
import siteDetermination from "./services/site-determination";
import { InputWrap } from "./elements/input-wrap";
import { Popup } from "./elements/popup";
import { GetSuggestion } from "./services/open-ai";
import optionsGetter from "./services/options-getter";
import { Input } from "./services/input-helper";


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
    
    const popup = Popup();
    popup.bind();

    const site = siteDetermination();
    let lastInput = null;

    
    const LookupForSuggestions = () => {
        let chat = getContext(lastInput, site);
        let currentInput = lastInput.GetValue().trim();
        popup.startLoading()
        GetSuggestion(chat, currentInput, options).then((suggestion) => {
            popup.stopLoading();
            if (suggestion)
                popup.updateSuggestions(suggestion, lastInput);
            else 
                popup.updateBodyText('No suggestions found');
        });
    }

    // Add event listener for focus on any text area
    document.body.addEventListener('focus', function(event){
        const input = Input(event.target);
        if (input.IsApplied()) {
            lastInput = input;
            event.target.aiwrap = InputWrap(input, popup, () => {
                LookupForSuggestions();
            });        
            event.target.aiwrap.bind();
        }
    }, true); 
    document.body.addEventListener('blur', function(event){
        const input = Input(event.target);
        if (input.IsApplied()) {
            setTimeout(() => {
                event.target.aiwrap && event.target.aiwrap.unbind();    
            }, 100);
        }
    }, true); 
    

    document.body.addEventListener('keydown', function(event){
        const input = Input(event.target);
        if (input.IsApplied() && event.key === 'F4') {
            popup.show();
            LookupForSuggestions();
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
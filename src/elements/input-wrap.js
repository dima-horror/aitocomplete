import { AiButton } from "./ai-botton";

const InputWrap = function(input, popup, lookupForSuggestions) {
    let wrap = {};
    wrap.bind = () => {
        wrap.element = document.createElement('div');
        wrap.element.className = 'ai-wrapper';
        
        // Get the left and top offset properties relative to the parent element
        const left = input.element.offsetLeft;
        const top = input.element.offsetTop;
        
        wrap.element.style.left = `${left}px`;
        wrap.element.style.top = `${top}px`;
        
        input.element.parentNode.appendChild(wrap.element);
    
        const button = AiButton();
        button.bind(wrap.element);
        button.onclick = () => {
            popup.show();
            lookupForSuggestions();
        }
    
        const ro = new ResizeObserver(() => {
            wrap.element.style.width = `${input.element.clientWidth}px`;
            wrap.element.style.height = `${input.element.clientHeight}px`;
        });
        ro.observe(input.element);
    }
    wrap.unbind = () => {
        wrap.element.remove();
    }
    return wrap;
};

export { InputWrap };

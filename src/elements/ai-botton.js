const AiButton = function() {

    let button = {};
    button.bind = (target) => {
        button.element = document.createElement('button');
        button.element.className = 'ai-button';
        button.element.textContent = 'AI';
        button.element.type = 'button';
        button.element.title = 'Get AI suggestion (F4 - hotkey)';

        target.appendChild(button.element);

        button.element.addEventListener('click', (e) => {
            e.stopPropagation();
            typeof(button.onclick) === 'function' && button.onclick(e);
            return false;
        });
    }
    return button;
};



export { AiButton };

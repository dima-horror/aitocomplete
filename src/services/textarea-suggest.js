const BindTextArea = function(target) {
    target.parentNode.classList.add('aitocomplete');
    target.classList.add('aitocomplete-hidden-area');

    
    const containerEle = target.parentNode;

    const mirroredEle = document.createElement('div');
    mirroredEle.classList.add('aitocomplete-mirror');
    containerEle.prepend(mirroredEle);

    const textareaStyles = window.getComputedStyle(target);
    [
        'border',
        'boxSizing',
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'lineHeight',
        'padding',
        'textDecoration',
        'textIndent',
        'textTransform',
        'whiteSpace',
        'wordSpacing',
        'wordWrap',
    ].forEach((property) => {
        mirroredEle.style[property] = textareaStyles[property];
    });
    mirroredEle.style.borderColor = 'transparent';

    const parseValue = (v) => v.endsWith('px') ? parseInt(v.slice(0, -2), 10) : 0;
    const borderWidth = parseValue(textareaStyles.borderWidth);

    const ro = new ResizeObserver(() => {
        mirroredEle.style.width = `${target.clientWidth + 2 * borderWidth}px`;
        mirroredEle.style.height = `${target.clientHeight + 2 * borderWidth}px`;
    });
    ro.observe(target);

    
    // Replace current word with selected suggestion
    const replaceCurrentWord = (newWord) => {
        target.aiSuggestionSelected = true;

        const newValue = newWord;
        target.value = newValue;
        target.focus();
    };

    const hideSuggestion = () => {
        mirroredEle.innerHTML = '';
    };

    let updateSuggestion = (suggestion) => {
        const currentValue = target.value;
        const cursorPos = target.selectionStart;
        if (cursorPos !== currentValue.length) {
            hideSuggestion();
            return;
        }

        if (!suggestion) {
            hideSuggestion();
            return;
        }

        const textBeforeCursor = currentValue.substring(0, cursorPos);

        const preCursorEle = document.createElement('span');
        preCursorEle.textContent = textBeforeCursor;
        preCursorEle.classList.add('aitocomplete-pre-cursor');

        const postCursorEle = document.createElement('span');
        postCursorEle.classList.add('aitocomplete-post-cursor');
        postCursorEle.textContent = suggestion;

        const caretEle = document.createElement('span');
        caretEle.innerHTML = '&nbsp;';

        mirroredEle.innerHTML = '';
        mirroredEle.append(preCursorEle, caretEle, postCursorEle);

        target.aiLastSuggestion = suggestion;
    }
    
    let targetEventListiners = [
        {
            name: 'scroll', 
            func: () => {
                mirroredEle.scrollTop = target.scrollTop;
            }
        },
        {
            name: 'keydown',
            func: (e) => {
                if (e.key !== 'Tab') {
                    return;
                }
                const postCursorEle = mirroredEle.querySelector('.aitocomplete-post-cursor');
                if (postCursorEle.textContent !== '') {
                    e.preventDefault();
                    replaceCurrentWord(postCursorEle.textContent);
                    hideSuggestion();
                }
            }
        }
    ];
    targetEventListiners.forEach((eventListener) => {
        target.addEventListener(eventListener.name, eventListener.func);
    });
    
    // Add targetEventListiners to the DOM element
    target.aiTargetEventListiners = targetEventListiners;
    target.aiUpdateSuggestion = updateSuggestion;
    target.aiRemoveSuggestion = hideSuggestion;
};

const UnbindTextArea = function(target) {
    target.parentNode.classList.remove('aitocomplete');
    target.classList.remove('aitocomplete-hidden-area');
    
    const siblings = Array.from(target.parentNode.children);
    siblings.forEach(sibling => {
        if (sibling.classList.contains('aitocomplete-mirror')) {
            sibling.remove();
        }
    });

    
    if (target.aiTargetEventListiners) {
        target.aiTargetEventListiners.forEach((eventListener) => {
            target.removeEventListener(eventListener.name, eventListener.func);
        });
        delete target.aiTargetEventListiners;
    }
}
export { BindTextArea, UnbindTextArea };

const Popup = function() {

    let popup = {};
    popup.bind = () => {
        popup.element = document.createElement('div');
        popup.element.className = 'ai-popup';
    
        let isDragging = false;
        let offsetX, offsetY;
    
        const header = document.createElement('div');
        header.className = 'ai-popup-header';
        header.textContent = 'AI suggestion 🪄';
        
        // Event listener for mouse down on the header
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - popup.element.getBoundingClientRect().left;
            offsetY = e.clientY - popup.element.getBoundingClientRect().top;
    
            document.documentElement.style.userSelect = 'none';
        });
    
        // Event listener for mouse move
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                popup.element.style.left = `${e.clientX - offsetX + popup.element.offsetWidth/2}px`;
                popup.element.style.top = `${e.clientY - offsetY + popup.element.offsetHeight/2}px`;
            }
        });

        // Event listener for mouse up
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.documentElement.style.userSelect = 'auto';
        });
    
    
        popup.bodyElement = document.createElement('div');
        popup.bodyElement.className = 'ai-popup-body';
        popup.bodyElement.textContent = '...';
    
        const closeButton = document.createElement('button');
        closeButton.className = 'ai-popup-close';
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => {
            popup.hide();
        });
        header.appendChild(closeButton);
    
        popup.element.appendChild(header);
        popup.element.appendChild(popup.bodyElement);
    
        document.body.appendChild(popup.element);
    }
    popup.show = () => {
        popup.element.style.display = 'flex';
    }
    popup.hide = () => {
        popup.element.style.display = 'none';
    }
    popup.startLoading = () => {
        popup.bodyElement.textContent = 'Thinking about answer...';

        let dots = '';
        popup.loadingInterval = setInterval(() => {
            dots += '.';
            popup.bodyElement.textContent = `🤔 Thinking about answer${dots}`;
            if (dots.length === 3) {
                dots = '';
            }
        }, 500);
    }
    popup.stopLoading = () => {
        clearInterval(popup.loadingInterval);
        popup.bodyElement.textContent = '';
    }
    popup.updateSuggestions = (suggestion, lastInput) => {
        popup.updateBodyText(suggestion);
        
        if (lastInput){
            const insertTextLink = document.createElement('a');
            insertTextLink.className = 'ai-insert-text';
            insertTextLink.href = '#';
            insertTextLink.textContent = 'Replace reply with this text';
            insertTextLink.addEventListener('click', (e) => {
                e.preventDefault();
                popup.hide();
                lastInput.SetValue(suggestion);
                lastInput.focus();
                return false;
            });
            popup.bodyElement.appendChild(insertTextLink);
        }
    }
    popup.updateBodyText = (text) => {
        popup.bodyElement.textContent = text;
    }

    return popup;
};



export { Popup };

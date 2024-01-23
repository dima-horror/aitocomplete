
function getContentEditableContent(element) {
    let firstTag = element.firstChild.nodeName;
    let keyTag = new RegExp(
        firstTag === '#text' ? '<br' : '</' + firstTag,
        'i'
    );
    let tmp = document.createElement('p');
    tmp.innerHTML = element.innerHTML
        .replace(/<[^>]+>/g, (m, i) => (keyTag.test(m) ? '{ß®}' : ''))
        .replace(/{ß®}$/, '');
    return tmp.innerText.replace(/{ß®}/g, '\n');
}

const Input = function (element) {
    let input = {
        element: element
    };
    input.IsTextArea = () => {
        return element.tagName === 'TEXTAREA'
            && element.offsetHeight > 50;
    }
    input.IsContentEditable = () => {
        return element.getAttribute('contenteditable') === 'true';
    }
    input.IsApplied = () => {
        return input.IsTextArea() || input.IsContentEditable();
    }
    input.GetValue = () => {
        return input.IsTextArea() 
            ? element.value 
            : getContentEditableContent(element);
    }
    input.SetValue = (value) => {
        if (input.IsTextArea()) {
            element.value = value;
        } else {
            element.innerHTML = value;
        }
    }
    return input;
}
export { Input };

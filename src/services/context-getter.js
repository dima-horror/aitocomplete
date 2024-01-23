import SiteTypes from "./SiteTypes";

const gitLabSiteContextGetter = (input) => {
    
    const userNameSelector = document.querySelector('[data-testid="user-profile-link"] .gl-word-break-all');
    const currentUsername = userNameSelector.textContent;
    
    let chat = [];


    // Add main description to context
    const titleElement = document.querySelector('[data-testid="issue-title"]');
    const title = titleElement.textContent;
    
    const mainDescriptionElement = document.querySelector('[data-testid="gfm-content"]');
    const description = mainDescriptionElement.textContent;

    const authorElement = document.querySelector('.author');
    const author = authorElement.textContent?.trim();
    chat.push(
    {
        role: author == currentUsername ? 'assistant' : 'user',
        content: `Issue title: ${title} \n Issue description: ${description}`
    });
    
    if (input.element.closest(".notes") !== null) {
        
        const notes = input.element.closest(".notes");
        const noteElements = notes.querySelectorAll(".note");
        noteElements.forEach((noteElement) => {
            const author = noteElement.querySelector('.author-username-link').textContent?.trim();
            const message = noteElement.querySelector('.note-text').textContent;
            chat.push({
                role: author == currentUsername ? 'assistant' : 'user',
                content: message
            });
        });
    }
    
    return chat;
};

export default function(input, siteType) {
    switch (siteType) {
        case SiteTypes.GITLAB:
            return gitLabSiteContextGetter(input);
    }
};

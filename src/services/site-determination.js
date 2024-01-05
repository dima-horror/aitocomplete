import SiteTypes from "./SiteTypes";

const isGitLabSite = () => {
    const metaTags = document.getElementsByTagName('meta');
    for (let i = 0; i < metaTags.length; i++) {
        if (metaTags[i].getAttribute('content') === 'GitLab') {
            return true;
        }
    }
    return false;
};



export default function() {
    if (isGitLabSite()) {
        return SiteTypes.GITLAB;
    }
    return null;
};
//cooke storage and consent popup
//cookie storage extracting cookie data
const cookieStorage = {
    getItem: (key) => { //retrieving the cookie data
        const cookies = document.cookie
        .split(';')
        .map(cookie => cookie.split('='))
        .reduce((acc, [key, value]) => ({...acc,[key.trim()]: value}));
        return cookies[key];
    },
    setItem: (key, value) => {
        document.cookie = `${key}=${value}`;
    }
}
 //cookie popup box functionality
const storageType = cookieStorage;
const consentPropertyName = 'layerlabs_consent';

const shouldShowPopup = () => !storageType.getItem(consentPropertyName);
//saving cookies to the session storage
const saveToStorage = () => storageType.setItem(consentPropertyName, true);
 () => {
    if(shouldShowPopup()) {
        const consent = confirm('Agree to the terms and conditions of the site?');
        if(consent) {
            saveToStorage();
        }
    }
}


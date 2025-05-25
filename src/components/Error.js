import {
    DEFAULT_DISPLAY_TIME,
    errorTextEl,
    errorEl
} from '../common.js';


// funzione per mostrare un messaggio di errore
const renderError = message => { 
    errorTextEl.textContent = message;
    errorEl.classList.add('error--visible');
    setTimeout(() => {
        errorEl.classList.remove('error--visible');
    }, DEFAULT_DISPLAY_TIME);
};

// quando si ha un solo export è buona pratica fare così
export default renderError;
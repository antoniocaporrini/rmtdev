import {
    spinnerSearchEl,
    spinnerJobDetailsEl,
} from '../common.js'

const renderSpinner = whichSpinner => {
   const spinnerEl = whichSpinner === 'search' ? spinnerSearchEl : spinnerJobDetailsEl; 
   spinnerEl.classList.toggle('spinner--visible');
};

// quando si ha un solo export è buona pratica fare così
export default renderSpinner;
import {
    BASE_API_URL,
    state,
    searchInputEl,
    searchFormEl,
    jobListSearchEl,
    sortingBtnRecentEl,
    sortingBtnRelevantEl,
    numberEl,
    getData
} from '../common.js';

// potremmo anche soprannimare "renderError" in "blablabla", verrebbe importanto comunque poichè è unico.
import renderError from './Error.js';
import renderSpinner from './Spinner.js';
import renderJobList from './JobList.js';
import renderPaginationButtons from './Pagination.js';

const submitHandler = async event => {
    // prevent default behavior 
    event.preventDefault();

    // get search text
    const searchText = searchInputEl.value;

    // validazione proibita (regular expression example) (cosa possiamo evitare di far scriver)
    const forbiddenPattern =  /[0-9]/;
    const patternMatch = forbiddenPattern.test(searchText); // questo già specifica che è true
    if (patternMatch) {
        renderError('Your search may not contain numbers');
        return; // per fermare la fetch call
    }

    // blur input
    searchInputEl.blur();

    // rimuovere i job items precedenti
    jobListSearchEl.innerHTML = '';

    // reset sorting buttons
    sortingBtnRecentEl.classList.remove('sorting__button--active');
    sortingBtnRelevantEl.classList.add('sorting__button--active');

    // mostra spinner
    renderSpinner('search');

    // fetch search results -- *un url con filtri si chaiama query string
    try {
        const data = await getData(`${BASE_API_URL}/jobs?search=${searchText}`);
    
        // estrai i lavori
        const { jobItems } = data;
    
        // update state
        state.searchJobItems = jobItems;
        state.currentPage = 1;

        // rimuovi spinner
        renderSpinner('search');

        // render number of results
        numberEl.textContent = jobItems.length;

        // reset pagination buttons
        renderPaginationButtons();
    
        // render job items in search job list
        renderJobList();
    } catch (error) {
        renderSpinner('search');
        renderError(error.message);
    }
};

searchFormEl.addEventListener('submit', submitHandler);
import { 
    RESULTS_PER_PAGE,
    BASE_API_URL,
    state,
    jobListSearchEl,
    jobDetailsContentEl,
    getData,
    jobListBookmarksEl
} from '../common.js';
import renderSpinner from './Spinner.js';
import renderJobDetails from './JobDetails.js';
import renderError from './Error.js';



const renderJobList = (whichJobList = 'search') => {
    const jobListEl = whichJobList === 'search' ? jobListSearchEl : jobListBookmarksEl;

    // remove previous job items
    jobListEl.innerHTML = '';
    
    let jobItems;
    console.log("whichJobList:", whichJobList);
    console.log("state.searchJobItems:", state.searchJobItems);
    console.log("state.bookmarkJobItems:", state.bookmarkJobItems);
    if (whichJobList === 'search') {
        jobItems = state.searchJobItems.slice(state.currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE, state.currentPage * RESULTS_PER_PAGE);
    } else if (whichJobList === 'bookmarks') {
        jobItems = state.bookmarkJobItems;
    }

    console.log("jobItems before forEach:", jobItems);

    // display job items
    jobItems.forEach(jobItem => {
        const newJobItemHTML = `
            <li class="job-item ${state.activeJobItem.id === jobItem.id ? 'job-item--active' : ''}">
                <a class="job-item__link" href="${jobItem.id}">
                <div class="job-item__badge">${jobItem.badgeLetters}</div>
                    <div class="job-item__middle">
                        <h3 class="third-heading">${jobItem.title}</h3>
                        <p class="job-item__company">${jobItem.company}</p>
                        <div class="job-item__extras">
                            <p class="job-item__extra"><i class="fa-solid fa-clock job-item__extra-icon"></i>${jobItem.duration}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-money-bill job-item__extra-icon"></i>${jobItem.salary}</p>
                            <p class="job-item__extra"><i class="fa-solid fa-location-dot job-item__extra-icon"></i>${jobItem.location}</p>
                        </div>
                    </div>
                    <div class="job-item__right">
                        <i class="fa-solid fa-bookmark job-item__bookmark-icon ${state.bookmarkJobItems.some(bookmarkJobItem => bookmarkJobItem.id === jobItem.id) && 'job-item__bookmark-icon--bookmarked'}"></i>
                        <time class="job-item__time">${jobItem.daysAgo}d</time>
                    </div>
                </a>
            </li>
        `;
        jobListEl.insertAdjacentHTML('beforeend', newJobItemHTML);
    });
    console.log("jobItems after forEach:", jobItems);
};

const clickHandler = async event => {
    // prevent default behavior (navigazione)
    event.preventDefault();

    // get clicked job item element
    const jobItemEl = event.target.closest('.job-item'); 

    // rimuovere la classe attiva
    // "?" Indica l'Optional Chaining ovvero se la classe esiste esegue il resto del codice,
    // sennò non fa nulla.
    document.querySelectorAll('.job-item--active').forEach(jobItemWithActiveClass => jobItemWithActiveClass.classList.remove('job-item--active'));


    // svuota la sezione job details 
    jobDetailsContentEl.innerHTML = '';
    
    // mostra spinner quando clicchi un lavoro
    renderSpinner('job-details');
    
    // get the id
    const id = jobItemEl.children[0].getAttribute('href');

    // update state
    const allJobItems = [...state.searchJobItems, ...state.bookmarkJobItems];
    state.activeJobItem = allJobItems.find(jobItem => jobItem.id === +id);

    // render search job list
    renderJobList();


    // qui aggiungiamo id del lavoro all'url (router)
    history.pushState(null, '', `/#${id}`);

    try {
        // fetch job item data
        const data = await getData(`${BASE_API_URL}/jobs/${id}`);

        // extract job item
        const { jobItem } = data;
            
        // rimuovi spinner
        renderSpinner('job-details');
    
        // mostra dettagli lavoro
        renderJobDetails(jobItem);
    } catch (error) {
        renderSpinner('job-details');
        renderError(error.message);
    }
};

jobListSearchEl.addEventListener('click', clickHandler);
jobListBookmarksEl.addEventListener('click', clickHandler);

export default renderJobList;
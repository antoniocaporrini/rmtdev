import {
    BASE_API_URL,
    state,
    jobDetailsContentEl,
    getData
} from '../common.js';
import renderSpinner from './Spinner.js';
import renderJobDetails from './JobDetails.js';
import renderError from './Error.js';
import renderJobList from './JobList.js';

const loadHashChangeHandler = async () => {
    // ottenere l'id dall'url
    const id = window.location.hash.substring(1);

    if (id) {
        // rimuovi la classe attiva del precedente job item selezionato
        document.querySelectorAll('.job-item--active').forEach(jobItemWithActiveClass => jobItemWithActiveClass.classList.remove('job-item--active'));

        // remove previous job details content
        jobDetailsContentEl.innerHTML = '';

        // add spinner
        renderSpinner('job-details');

        try {
            // fetch job item data
            const data = await getData(`${BASE_API_URL}/jobs/${id}`);
    
            // extract job item
            const { jobItem } = data;

            // update state
            state.activeJobItem = jobItem;

            // render search job list
            renderJobList();
                
            // rimuovi spinner
            renderSpinner('job-details');
        
            // mostra dettagli lavoro
            renderJobDetails(jobItem);
        } catch (error) {
            renderSpinner('job-details');
            renderError(error.message);
        }
    }
};

window.addEventListener('DOMContentLoaded', loadHashChangeHandler);
window.addEventListener('hashchange', loadHashChangeHandler);
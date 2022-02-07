import './css/styles.css';
import "normalize.css";
import fetchCountries from './fetchCountries.js';
const debounce = require('lodash.debounce');
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import "notiflix/dist/notiflix-3.2.4.min.css";

const DEBOUNCE_DELAY = 300;
const countryInputRef = document.getElementById('search-box');
const countriesListRef = document.querySelector('.country-list');
const countriesInfoRef = document.querySelector('.country-info');


countryInputRef.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));


function onCountryInput(e) {
  if (!e.target.value.trim()) {
    clearAllCountries()
    return;
  }
  fetchCountries(e.target.value.trim())
    .then(response => {
      if (response.status === 404) {
        throw new Error('error --- 404');
      }
      return response.json();
    })
    .then(renderResults)
    .catch(console.log);
}



function renderResults(response) {
  if (!response.length) {
    Notify.failure("Oops, there is no country with that name");
    clearAllCountries();
  } else if (response.length > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
    clearAllCountries();
  } else if (response.length === 1) {
    renderSingleCountry(response[0]);
  } else if (response.length > 1 || response.length <= 10) {
    renderCountries(response);
  }
}


function renderSingleCountry({ capital, flags, languages, name, population }) {
  clearAllCountries()
  countriesInfoRef.innerHTML = `<p class="country">
        <img class="flag" src="${flags.svg}" alt="${name.official} flag" /> ${name.official}
      </p>
      <p><span class="bold">Capital: </span>${capital}</p>
      <p><span class="bold">Population: </span>${population}</p>
      <p><span class="bold">Languages: </span>${Object.values(languages).join(', ')}</p>`;

}

function renderCountries(response) {
  clearAllCountries()
  response.forEach(({ flags, name }) => {
    countriesListRef.insertAdjacentHTML('beforeend', `
    <li class="item">
      <div class="flagwrap">
        <img class="flag" src="${flags.svg}" alt="${name.official}" />
      </div>
      <span class="bold">${name.official}</span>
    </li>`
    );
  });

}

function clearAllCountries() {
  countriesListRef.innerHTML = '';
  countriesInfoRef.innerHTML = '';

}
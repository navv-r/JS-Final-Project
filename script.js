const apiKey = 'c2e6bd24'; 
const baseUrl = 'https://www.omdbapi.com/';


const inputBox = document.querySelector('.input__box');
const searchButton = document.querySelector('.input__button');
const resultsSection = document.querySelector('.filters__section');
const sortOptions = document.querySelectorAll('.filter__menu a');

let movies = []; 


async function fetchMovies(query) {
  try {
    const response = await fetch(
      `${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(query)}`
    );
    const data = await response.json();

    if (data.Response === 'False') {
      renderError(`No results found for "${query}".`);
      return;
    }

    movies = data.Search; 
    renderMovies(movies);

  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

function renderMovies(movieList) {
  const oldGrid = document.querySelector('.movie-grid');
  if (oldGrid) oldGrid.remove();

  const movieGrid = document.createElement('div');
  movieGrid.classList.add('movie-grid');
  resultsSection.appendChild(movieGrid);

  movieList.forEach(movie => {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const poster =
      movie.Poster !== 'N/A'
        ? movie.Poster
        : './Assets/placeholder.png';

    movieCard.innerHTML = `
      <img src="${poster}" alt="${movie.Title}">
      <h4>${movie.Title}</h4>
      <p>📅 ${movie.Year}</p>
    `;

    movieGrid.appendChild(movieCard);
  });
}

function renderError(message) {
  const oldGrid = document.querySelector('.movie-grid');
  if (oldGrid) oldGrid.remove();

  const errorMsg = document.createElement('p');
  errorMsg.style.color = 'white';
  errorMsg.style.padding = '1rem';
  errorMsg.textContent = message;

  resultsSection.appendChild(errorMsg);
}

function sortMovies(type) {
  let sortedMovies = [...movies];

  switch (type) {
    case 'title-asc':
      sortedMovies.sort((a, b) => a.Title.localeCompare(b.Title));
      break;

    case 'title-desc':
      sortedMovies.sort((a, b) => b.Title.localeCompare(a.Title));
      break;

    case 'year-asc':
      sortedMovies.sort(
        (a, b) => parseInt(a.Year) - parseInt(b.Year)
      );
      break;

    case 'year-desc':
      sortedMovies.sort(
        (a, b) => parseInt(b.Year) - parseInt(a.Year)
      );
      break;
  }

  renderMovies(sortedMovies);
}


searchButton.addEventListener('click', () => {
  const query = inputBox.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

sortOptions.forEach(option => {
  option.addEventListener('click', event => {
    event.preventDefault();
    const sortType = option.dataset.sort;
    sortMovies(sortType);
  });
});


inputBox.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    const query = inputBox.value.trim();
    if (query) {
      fetchMovies(query);
    }
  }
});

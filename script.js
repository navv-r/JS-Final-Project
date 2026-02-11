const apiKey = 'c2e6bd24'; 
const baseUrl = 'https://www.omdbapi.com/';

const inputBox = document.querySelector('.input__box');
const searchButton = document.querySelector('.input__button');
const resultsSection = document.querySelector('.filters__section');

async function fetchMovies(query) {
  try {
    const response = await fetch(`${baseUrl}?apikey=${apiKey}&s=${encodeURIComponent(query)}`);
    const data = await response.json();

    const oldResults = document.querySelector('.movie-grid');
    if (oldResults) oldResults.remove();

    const movieGrid = document.createElement('div');
    movieGrid.classList.add('movie-grid');
    resultsSection.appendChild(movieGrid);

    if (data.Response === 'False') {
      movieGrid.innerHTML = `<p>No results found for "${query}".</p>`;
      return;
    }

    data.Search.forEach(movie => {
      const movieCard = document.createElement('div');
      movieCard.classList.add('movie-card');

      const poster = movie.Poster !== 'N/A' ? movie.Poster : './Assets/placeholder.png';

      movieCard.innerHTML = `
        <img src="${poster}" alt="${movie.Title}">
        <h4>${movie.Title}</h4>
        <p>📅 ${movie.Year}</p>
      `;

      movieGrid.appendChild(movieCard);
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

searchButton.addEventListener('click', () => {
  const query = inputBox.value.trim();
  if (query) {
    fetchMovies(query);
  }
});
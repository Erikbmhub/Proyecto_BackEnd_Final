const Movie = require("../models/movie.model");

async function createMovie(movieParams) {
  const movies = Array.isArray(movieParams) ? movieParams : [movieParams];

  const moviesToSave = movies.map(({
    tmdbId,
    title,
    posterPath,
    releaseYear,
    director,
    genre,
    duration
  }) => ({
    tmdbId,
    title,
    posterPath,
    releaseYear,
    director,
    genre,
    duration
  }));

  const result = await Movie.insertMany(moviesToSave);

  // Mantiene el retorno habitual si llega un solo objeto.
  return Array.isArray(movieParams) ? result : result[0];
}

module.exports = { createMovie };
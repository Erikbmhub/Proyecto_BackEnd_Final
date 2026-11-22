require('dotenv').config();

const formatMovieDetails = async (movieId, apiKey) => {
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es-ES&append_to_response=credits`;
    const movieRes = await fetch(movieUrl);
    const movieData = await movieRes.json();

    return {
        tmdbId: movieData.id,
        title: movieData.title,
        image: movieData.poster_path
            ? `https://image.tmdb.org/t/p/w500${movieData.poster_path}`
            : null,
        year: movieData.release_date ? movieData.release_date.split("-")[0] : null,
        director: movieData.credits?.crew?.find((persona) => persona.job === "Director")?.name ?? null,
        genre: movieData.genres ? movieData.genres.map(genre => genre.name) : [],
        duration: movieData.runtime,
        description: movieData.overview,
        actors: movieData.credits?.cast?.map((actor) => actor.name) ?? [],
        imdbRating: movieData.vote_average,
    };
};

const fetchDataFilm = async (titleFilm) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(titleFilm)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results?.length) {
            const peliculas = await Promise.all(
                data.results.map((pelicula) => formatMovieDetails(pelicula.id, API_KEY))
            );
            console.log(peliculas);
            return peliculas;
        }

        return [];
    } catch (error) {
        console.error("Ocurrió un error en el proceso:", error);
        return [];
    }
};

// Nuevo fetch para últimas películas de taquilla (sin alterar fetchDataFilm)
const fetchBoxOfficeMovies = async (limit = 8) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=es-ES&page=1`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results?.length) {
            const selected = data.results.slice(0, limit);
            return await Promise.all(
                selected.map((pelicula) => formatMovieDetails(pelicula.id, API_KEY))
            );
        }

        return [];
    } catch (error) {
        console.error("Error al obtener películas de taquilla:", error);
        return [];
    }
};

fetchDataFilm.fetchBoxOfficeMovies = fetchBoxOfficeMovies;

module.exports = fetchDataFilm;
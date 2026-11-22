require('dotenv').config();

const fetchDataFilm = async (titleFilm) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(titleFilm)}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.results?.length) {
            const peliculas = await Promise.all(
                data.results.map(async (pelicula) => {
                    const movieUrl = `https://api.themoviedb.org/3/movie/${pelicula.id}?api_key=${API_KEY}&language=es-ES&append_to_response=credits`;
                    const movieRes = await fetch(movieUrl);
                    const movieData = await movieRes.json();

                    return {
                        tmdbId: movieData.id,
                        title: movieData.title,
                        image: `https://image.tmdb.org/t/p/w500${movieData.poster_path}`,
                        year: movieData.release_date.split("-")[0],
                        director: movieData.credits?.crew?.find((persona) => persona.job === "Director")?.name ?? null,
                        genre: movieData.genres.map(genre => genre.name),
                        duration: movieData.runtime,
                        description: movieData.overview,
                        actors: movieData.credits?.cast?.map((actor) => actor.name) ?? [],
                        imdbRating: movieData.vote_average,
                    };
                })
            );
            console.log(peliculas)
            return peliculas;
        }

        return [];
    } catch (error) {
        console.error("Ocurrió un error en el proceso:", error);
    }
};

module.exports = fetchDataFilm;
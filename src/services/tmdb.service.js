require('dotenv').config();

const fetchDataFilm = async (titleFlim) => {
    const API_KEY = process.env.TMDB_API_KEY;
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&language=es-ES&query=${titleFlim}`
    try {
        const res = await fetch(url);
        const data = res.json();
        return data;
    } catch (error) {
        console.error("Ocurrió un error en el proceso:", error);
    }
}
//fetchDataFilm("En el corazón de la bestia").then(data => console.log(data))

module.exports = fetchDataFilm;
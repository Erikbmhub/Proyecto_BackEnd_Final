const Movie = require("../models/movie.model");

async function getMovie(req, res) { //Buscar película o películas
    //pendiente
}

async function postMovie(req, res) {

    // Recogemos los datos enviados desde el formulario.
    const { title, image, year, director, genre, duration } = req.body;

    try {
        // Creamos un nuevo documento de película en MongoDB.
        const newMovie = new Movie({
            title,
            image,
            year,
            director,
            genre,
            duration
        });

        // Guardamos la película en la base de datos.
        await newMovie.save();

        // Volvemos al panel de administración.
        res.redirect("/admin/dashboard");

    } catch (error) {
        console.error("Error al crear la película:", error.message);
        res.status(500).send("Error al crear la película");
    }
}

async function putMovie(req, res) { //Editar película (admin)
    //pendiente
}

async function deleteMovie(req, res) { //Borrar película (admin)
    //pendiente
}
async function getMoviesByAdmin(req, res) { //Nos renderizara la vista de movies de admin con todas las peliculas
    let movies
    res.render("../views/admin/movies.pug", movies)
}

module.exports = moviesController = {
    getMovie,
    postMovie,
    putMovie,
    deleteMovie,
    getMoviesByAdmin
}
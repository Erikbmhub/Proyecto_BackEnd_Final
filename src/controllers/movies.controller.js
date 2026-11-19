const jwt = require("jsonwebtoken")
const fetchDataFilm = require("../services/tmdb.service.js")
const movieService = require("../services/movie.service.js")

async function getMovie(req, res) { //Buscar película o películas
    //pendiente
}

async function postMovie(req, res) { //Crear película (admin)
    const token = req.cookies.token

    let role = "admin"
    // jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    //     role = decoded.role
    // })
    if (role === "admin") {
        movieService.createMovie(req.body)
    } else {
        const res = await fetchDataFilm(req.query.title)
        console.log(res)
        //movieService.createMovie(res)
    }
}

async function putMovie(req, res) { //Editar película (admin)
    //pendiente
}

async function deleteMovie(req, res) { //Borrar película (admin)
    //pendiente
}
async function getMoviesByAdmin(req, res) { //Nos renderizara la vista de movies de admin con todas las peliculas de la BBDD
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
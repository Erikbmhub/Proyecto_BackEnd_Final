// Importamos el modelo de películas.
const Movie = require("../models/movie.model");

//http://localhost:3001
async function getViewHome(req, res) {
  //vista inicio de la app
  res.render("layouts/main.pug");
}

//http://localhost:3001/dashboard
async function getViewDashboard(req, res) {
  //panel de control
  res.render("user/dashboard.pug");
}

//http://localhost:3001/search
async function getViewSearch(req, res) {
  //buscador de películass
  res.render("user/search.pug");
}

//http://localhost:3001/search/:title
async function getViewSearchByDetail(req, res) {
  //vista detalle de la película
  res.render("user/detail.pug");
}

//http://localhost:3001/movies
// http://localhost:3001/movies
async function getViewMovies(req, res) {
  try {
    // Recuperamos todas las películas creadas.
    const movies = await Movie.find().sort({ createdAt: -1 });
    // Renderizamos la vista y enviamos las películas.
    res.render("admin/movies.pug", {
      movies,
      user: req.user,
    });
  } catch (error) {
    console.error("Error al recuperar las películas:", error);
    res.status(500).send("Error al cargar las películas");
  }
}

//http://localhost:3001/profile
async function getViewProfile(req, res) {
  //vista detalle del usuario
  res.render("user/profile.pug");
}

//http://localhost:3001/users
async function getViewUsers(req, res) {
  //lista de usuarios
  res.render("admin/users.pug");
}

//http://localhost:3001/signup
async function getViewSignUp(req, res) {
  //vista de formulario de registro de la app
  res.render("auth/signup.pug");
}

module.exports = webControllers = {
  getViewHome,
  getViewDashboard,
  getViewSearch,
  getViewSearchByDetail,
  getViewMovies,
  getViewProfile,
  getViewUsers,
  getViewSignUp,
};

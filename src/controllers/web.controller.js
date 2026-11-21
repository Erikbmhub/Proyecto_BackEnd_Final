// Importamos el modelo de películas.
const MovieModel = require("../models/movie.model");
const Favorite = require("../models/favorite.model");

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
  const movies = req.session.movies || [];
  delete req.session.movies;

  res.render("user/search.pug", { movies, user: req.user });
}

//http://localhost:3001/search/:title
async function getViewSearchByDetail(req, res) {
  try {
    console.log(req.params.title)
    const title = req.params.title;
    const movie = await MovieModel.findOne({ title });

    if (!movie) {
      return res.status(404).send("Película no encontrada");
    }

    return res.render("user/detail.pug", { movie, user: req.user });
  } catch (error) {
    console.error("Error al cargar el detalle:", error);
    return res.status(500).send("Error al cargar la película");
  }
}

async function getViewFavorites(req, res) {
  try {
    const favorites = await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 });
    return res.render("user/favorites.pug", { favorites, user: req.user });
  } catch (error) {
    console.error("Error al cargar los favoritos:", error);
    return res.status(500).send("Error al cargar los favoritos");
  }
}

//http://localhost:3001/movies
// http://localhost:3001/movies
async function getViewMovies(req, res) {
  try {
    // Recuperamos todas las películas creadas.
    const movies = await MovieModel.find().sort({ createdAt: -1 });
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
  getViewFavorites,
  getViewMovies,
  getViewProfile,
  getViewUsers,
  getViewSignUp,
};

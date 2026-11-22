// Importamos el modelo de películas.
const MovieModel = require("../models/movie.model");
const Favorite = require("../models/favorite.model");
const fetchDataFilm = require("../services/tmdb.service");

// http://localhost:3001
// async function getViewHome(req, res) {
//   res.render("layouts/main.pug", { User: req.user });
// }
async function getViewHome(req, res) {
  try {
    const featuredMovies = await fetchDataFilm.fetchBoxOfficeMovies(8);
    res.render("home.pug", { user: req.user, featuredMovies });
  } catch (error) {
    console.error("Error al cargar la portada:", error);
    res.render("home.pug", { user: req.user, featuredMovies: [] });
  }
}

// http://localhost:3001/login
async function getViewLogin(req, res) {
  res.render("auth/login.pug", { user: req.user });
}

// http://localhost:3001/dashboard
async function getViewDashboard(req, res) {
  res.render("user/dashboard.pug", { user: req.user });
}

// http://localhost:3001/search
async function getViewSearch(req, res) {
  const movies = req.session.movies || [];
  delete req.session.movies;
  const savedTmdbIds = await Favorite.distinct("tmdbId", { userId: req.user.id });
  const favoriteIds = savedTmdbIds.map(String);

  res.render("user/search.pug", { movies, favoriteIds, user: req.user });
}

// http://localhost:3001/search/:title
async function getViewSearchByDetail(req, res) {
  try {
    const title = req.params.title;
    const movie = await MovieModel.findOne({ title });

    if (!movie) {
      return res.status(404).send("Película no encontrada");
    }

    const isFavorite = await Favorite.exists({ userId: req.user.id, tmdbId: movie.tmdbId });
    return res.render("user/detail.pug", { movie, isFavorite: Boolean(isFavorite), user: req.user });
  } catch (error) {
    console.error("Error al cargar el detalle:", error);
    return res.status(500).send("Error al cargar la película");
  }
}

// http://localhost:3001/movies
async function getViewMovies(req, res) {
  try {
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).send("No tienes permiso para ver esta página");
    }

    const movies = req.user.role === "user"
      ? await Favorite.find({ userId: req.user.id }).sort({ createdAt: -1 })
      : await MovieModel.find().sort({ createdAt: -1 });

    res.render("admin/movies.pug", {
      movies,
      user: req.user,
    });
  } catch (error) {
    console.error("Error al cargar las películas:", error);
    res.status(500).send("Error al cargar las películas");
  }
}

// http://localhost:3001/profile
async function getViewProfile(req, res) {
  res.render("user/profile.pug", { user: req.user });
}

// http://localhost:3001/users
async function getViewUsers(req, res) {
  res.render("admin/users.pug", { user: req.user });
}

// http://localhost:3001/signup
async function getViewSignUp(req, res) {
  res.render("auth/signup.pug", { user: req.user });
}

module.exports = {
  getViewHome,
  getViewLogin,
  getViewDashboard,
  getViewSearch,
  getViewSearchByDetail,
  getViewMovies,
  getViewProfile,
  getViewUsers,
  getViewSignUp,
};
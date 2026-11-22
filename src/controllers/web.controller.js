// Importamos el modelo de películas.
const MovieModel = require("../models/movie.model");
const Favorite = require("../models/favorite.model");
const UserModel = require("../models/user.model");

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
  const savedTmdbIds = await Favorite.distinct("tmdbId", { userId: req.user.id });
  const favoriteIds = savedTmdbIds.map(String);

  res.render("user/search.pug", { movies, favoriteIds, user: req.user });
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

    const isFavorite = await Favorite.exists({ userId: req.user.id, tmdbId: movie.tmdbId });
    return res.render("user/detail.pug", { movie, isFavorite: Boolean(isFavorite), user: req.user });
  } catch (error) {
    console.error("Error al cargar el detalle:", error);
    return res.status(500).send("Error al cargar la película");
  }
}

//http://localhost:3001/movies
async function getViewMovies(req, res) {
  try {
    if (!["user", "admin"].includes(req.user.role)) {
      return res.status(403).send("No tienes permiso para ver esta página");
    }

    // Los usuarios ven sus favoritos; el administrador conserva su catálogo de gestión.
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

//http://localhost:3001/profile
async function getViewProfile(req, res) {
  //vista detalle del usuario
  res.render("user/profile.pug");
}

//http://localhost:3001/users
async function getViewUsers(req, res) {
  try {
    // Obtenemos todos los usuarios registrados en PostgreSQL.
    const users = await UserModel.getAllUsers();

    // Enviamos los usuarios a la vista de administración.
    res.render("admin/users.pug", {
      users,
      user: req.user,
    });
  } catch (error) {
    console.error("Error al cargar los usuarios:", error);
    res.status(500).send("Error al cargar los usuarios");
  }
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

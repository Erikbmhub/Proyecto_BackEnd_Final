const MovieModel = require("../models/movie.model");
const { fetchDataFilm } = require("../services/tmdb.service.js");
require("../config/db.mongo.js");

async function getMovie(req, res) {
  const title = req.query.title?.trim();
  console.log(title)
  if (!title) {
    return res.status(400).json({
      mensaje: "Debes indicar el título de la película",
    });
  }

  try {
    // Primero buscamos coincidencias en MongoDB, sin distinguir mayúsculas.
    const moviesInDatabase = await MovieModel.find({
      title: { $regex: title, $options: "i" },
    }).sort({ title: 1 });

    console.log(moviesInDatabase[0])
    if (moviesInDatabase.length > 0) {
      req.session.movies = moviesInDatabase;
      return res.redirect("/search");
    }

    // Si no hay coincidencias locales, consultamos TMDB.
   const moviesFromTmdb = await fetchDataFilm(title);

    if (!moviesFromTmdb || !Array.isArray(moviesFromTmdb)) {
      return res.status(502).json({
        mensaje: "No se pudo obtener una respuesta válida de TMDB",
      });
    }
    await MovieModel.insertMany(moviesFromTmdb)

    req.session.movies = moviesFromTmdb;
    return res.redirect("/search");

  } catch (error) {
    console.error("Error al buscar películas:", error);

    return res.status(500).json({
      mensaje: "Error al buscar películas",
    });
  }
}


async function getMovieByDetail(req, res) {

}

async function postMovie(req, res) {
  // Recogemos los datos enviados desde el formulario.
  const { title, tmdbId, image, year, director, genre, duration } = req.body;
  console.log("DATOS RECIBIDOS:", req.body);
  try {
    // Creamos un nuevo documento de película en MongoDB.
    const newMovie = new MovieModel({
      title,
      tmdbId,
      image,
      year,
      director,
      genre,
      duration,
    });

    // Guardamos la película en la base de datos.
    const tabla = await newMovie.save();

    // Volvemos al panel de administración y enviamos un mensaje.
    res.redirect("/movies?mensaje=creada");
  } catch (error) {
    console.error("ERROR EN SAVE:", error.name, error.message, error);
    res.status(500).send("Error al crear la película");
  }
}

async function putMovie(req, res) {
  // Recogemos el identificador de la película.
  const { id } = req.body;

  // Recogemos los datos que queremos actualizar.
  const { title, tmdbId, image, year, director, genre, duration } = req.body;

  try {
    // Buscamos la película y actualizamos sus datos.
    const updatedMovie = await MovieModel.findByIdAndUpdate(
      id,
      { title, tmdbId, image, year, director, genre, duration },
      { returnDocument: "after", runValidators: true }
    );

    // Comprobamos si existe la película.
    if (!updatedMovie) {
      return res.status(404).json({
        mensaje: "Película no encontrada"
      });
    }

    // Respondemos con la película actualizada.
    res.status(200).json({
      mensaje: "Película actualizada correctamente",
      movie: updatedMovie
    });

  } catch (error) {
    console.error("Error al actualizar la película:", error);

    res.status(500).json({
      mensaje: "Error al actualizar la película"
    });
  }
}

async function deleteMovie(req, res) {
  // Recogemos el identificador de la película.
  const { id } = req.body;

  try {
    // Buscamos la película por su ID y la eliminamos.
    const deletedMovie = await MovieModel.findByIdAndDelete(id);

    // Comprobamos si la película existe.
    if (!deletedMovie) {
      return res.status(404).json({
        mensaje: "Película no encontrada"
      });
    }

    // Respondemos confirmando que se ha eliminado.
    res.status(200).json({
      mensaje: "Película eliminada correctamente"
    });

  } catch (error) {
    console.error("Error al eliminar la película:", error);

    res.status(500).json({
      mensaje: "Error al eliminar la película"
    });
  }
}
async function getMoviesByAdmin(req, res) {
  console.log("ENTRANDO EN getMoviesByAdmin");
  try {
    // Recuperamos todas las películas de MongoDB.
    const movies = await MovieModel.find().sort({ createdAt: -1 });

    // Comprobamos los resultados.
    console.log("PELÍCULAS RECUPERADAS:", movies.length);
    console.log(movies);

    // Recuperamos el mensaje enviado mediante la URL.
    const mensaje = req.query.mensaje;

    // Enviamos las películas y el mensaje a la vista.
    res.render("../views/admin/movies.pug", {
      movies,
      mensaje,
    });
  } catch (error) {
    console.error("Error al recuperar las películas:", error);
    res.status(500).send("Error al cargar las películas");
  }
}

module.exports = moviesController = {
  getMovie,
  postMovie,
  putMovie,
  deleteMovie,
  getMoviesByAdmin,
  getMovieByDetail
};

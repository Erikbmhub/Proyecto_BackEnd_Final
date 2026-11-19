
// Importamos el modelo de favoritos.
const Favorite = require("../models/favorite.model");

// Obtenemos las películas favoritas del usuario autenticado.
async function getFavorites(req, res) {
  try {
    // Obtenemos el ID del usuario desde el JWT.
    const userId = req.user.id;

    // Buscamos sus películas favoritas en MongoDB.
    const favorites = await Favorite.find({ userId });

    // Devolvemos la lista de favoritos.
    res.status(200).json(favorites);
  } catch (error) {
    console.error("Error al obtener los favoritos:", error);
    res.status(500).json({ message: "Error al obtener los favoritos" });
  }
}

// Guardamos una película en favoritos.
async function postFavorites(req, res) {
  // Recogemos los datos de la película enviados desde el frontend.
  const { tmdbId, title, overview, posterPath, releaseDate, voteAverage } =
    req.body;

  try {
    // Obtenemos el ID del usuario desde el JWT.
    const userId = req.user.id;

    // Comprobamos que llegan los datos obligatorios.
    if (!tmdbId || !title) {
      return res.status(400).json({
        message: "El identificador y el título de la película son obligatorios",
      });
    }

    // Comprobamos si la película ya está guardada por este usuario.
    const existingFavorite = await Favorite.findOne({ userId, tmdbId });

    // Evitamos guardar dos veces la misma película.
    if (existingFavorite) {
      return res.status(409).json({
        message: "Esta película ya está en favoritos",
      });
    }

    // Creamos y guardamos el nuevo favorito en MongoDB.
    const newFavorite = await Favorite.create({
      userId,
      tmdbId,
      title,
      overview,
      posterPath,
      releaseDate,
      voteAverage,
    });

    // Devolvemos el favorito creado.
    res.status(201).json(newFavorite);
  } catch (error) {
    // Comprobamos si MongoDB ha detectado un documento duplicado.
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Esta película ya está en favoritos",
      });
    }

    console.error("Error al guardar el favorito:", error);
    res.status(500).json({ message: "Error al guardar el favorito" });
  }
}

// Eliminamos una película de favoritos.
async function deleteFavorites(req, res) {
  // Recogemos el ID de la película enviado desde el frontend.
  const { tmdbId } = req.body;

  try {
    // Obtenemos el ID del usuario desde el JWT.
    const userId = req.user.id;

    // Comprobamos que llega el identificador de la película.
    if (!tmdbId) {
      return res.status(400).json({
        message: "El identificador de la película es obligatorio",
      });
    }

    // Buscamos y eliminamos el favorito de ese usuario.
    const deletedFavorite = await Favorite.findOneAndDelete({ userId, tmdbId });

    // Comprobamos si el favorito existía.
    if (!deletedFavorite) {
      return res.status(404).json({
        message: "La película no está en favoritos",
      });
    }

    // Confirmamos que se ha eliminado correctamente.
    res.status(200).json({ message: "Película eliminada de favoritos" });
  } catch (error) {
    console.error("Error al eliminar el favorito:", error);
    res.status(500).json({ message: "Error al eliminar el favorito" });
  }
}

// Exportamos los controladores.
module.exports = {
  getFavorites,
  postFavorites,
  deleteFavorites,
};


const express = require('express');
const favoritesController = require("../controllers/favorites.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

// Obtener las películas favoritas del usuario autenticado.
router.get("/", authMiddleware, favoritesController.getFavorites);

// Guardar una película en favoritos.
router.post("/", authMiddleware, favoritesController.postFavorites);

// Eliminar una película de favoritos.
router.delete("/", authMiddleware, favoritesController.deleteFavorites);

module.exports = router;

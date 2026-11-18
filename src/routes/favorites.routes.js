const express = require('express');
const favoritesController = require("../controllers/favorites.controller")

const router = express.Router();

router.get("/", favoritesController.getFavorites) //Obtener películas favoritas del usuario
router.post("/", favoritesController.postFavorites) //Guardar favorito del usuario
router.delete("/", favoritesController.deleteFavorites) //Borrar favorito del usuario

module.exports = router
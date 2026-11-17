const express = require('express');
const favoritesController = require("../controllers/favorites.controller")

const router = express.Router();

router.get("/", favoritesController.getFavorites)
router.post("/", favoritesController.postFavorites)
router.delete("/", favoritesController.deleteFavorites)

module.exports = router
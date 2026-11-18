const express = require('express');
const moviesController = require("../controllers/movies.controller")

const router = express.Router();

router.get("/:title", moviesController.getMovie) //Buscar película o películas 
router.post("/", moviesController.postMovie) //Crear película (admin)
router.put("/", moviesController.putMovie) //Editar película (admin)
router.delete("/", moviesController.deleteMovie) //Borrar película (admin)

module.exports = router
const express = require('express');
const moviesController = require("../controllers/movies.controller")

const router = express.Router();

router.get("/:title", moviesController.getMovie) //Buscar película o películas 
router.get("/", moviesController.getMoviesByAdmin)
router.post("/", moviesController.postMovie)
//ruta.get(res.render) //Crear película (admin)
router.put("/", moviesController.putMovie) //Editar película (admin)
router.delete("/", moviesController.deleteMovie) //Borrar película (admin)

module.exports = router
const express = require('express');
const moviesController = require("../controllers/movies.controller")

const router = express.Router();

router.get("/:title", moviesController.getMovie)
router.post("/", moviesController.postMovie)
router.put("/", moviesController.putMovie)
router.delete("/", moviesController.deleteMovie)

module.exports = router
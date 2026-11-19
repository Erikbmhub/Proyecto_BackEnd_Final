const mongoose = require("mongoose");
const movieSchema = require("../schemas/movie.schema.js")

// Exportamos el modelo.
const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;

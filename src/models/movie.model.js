
const mongoose = require("mongoose");


// Definimos la estructura de las películas.
const movieSchema = new mongoose.Schema({

    // Título de la película.
    title: {
        type: String,
        required: true,
        trim: true
    },

    // Identificador único de la película en TMDb.
    tmdbId: {
        type: Number,
        required: true,
        unique: true
    },

    // Imagen representativa.
    image: {
        type: String,
        required: false
    },

    // Año de estreno.
    year: {
        type: Number,
        required: false
    },

    // Director de la película.
    director: {
        type: String,
        required: false,
        trim: true
    },

    // Género cinematográfico.
    genre: {
        type: Array,
        required: false,
        trim: true
    },

    // Duración de la película.
    duration: {
        type: String,
        required: false
    },
    actors: {
        type: Array,
        required: false
    },
    imdbRating: {
        type: Number,
        required: false
    },
    description: {
        type: String,
        required: false
    },

}, { timestamps: true });

// Creamos y exportamos el modelo.
const MovieModel = mongoose.model("Movie", movieSchema); //"Movie" = tabla "movies" en mongo

module.exports = MovieModel;

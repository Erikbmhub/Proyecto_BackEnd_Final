const mongoose = require("mongoose");
const movieSchema = new mongoose.Schema({

    // Identificador de la película en TMDB.
    tmdbId: {
        type: Number,
        required: true
    },

    // Título de la película.
    title: {
        type: String,
        required: true,
        trim: true
    },

    // Póster de la película.
    posterPath: {
        type: String
    },

    // Año de estreno.
    releaseYear: {
        type: Number
    },

    // Director de la película.
    director: {
        type: String
    },

    // Género de la película.
    genre: {
        type: String
    },

    // Duración de la película.
    duration: {
        type: Number
    }

}, { timestamps: true });

// Evitamos que una película se guarde dos veces la BBDD.
movieSchema.index({ tmdbId: 1 }, { unique: true });


module.exports = movieSchema
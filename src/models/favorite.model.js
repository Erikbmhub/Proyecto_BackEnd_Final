
const mongoose = require("mongoose");

// Creamos el esquema de favoritos.
const favoriteSchema = new mongoose.Schema({

    // Identificador del usuario propietario del favorito (PostgreSQL).
    userId: {
        type: Number,
        required: true
    },

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

    // Sinopsis de la película.
    overview: {
        type: String
    },

    // Ruta del póster.
    posterPath: {
        type: String
    },

    // Fecha de estreno.
    releaseDate: {
        type: String
    },

    // Puntuación de TMDB.
    voteAverage: {
        type: Number
    }

}, { timestamps: true });

// Evitamos que un usuario guarde dos veces la misma película.
favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

// Exportamos el modelo.
const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;

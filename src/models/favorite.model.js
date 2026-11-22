
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
    description: {
        type: String
    },

    // Ruta del póster.
    image: {
        type: String
    },

    // Fecha de estreno.
    year: {
        type: String
    },

    // Puntuación de TMDB.
    imdbRating: {
        type: Number
    }

}, { timestamps: true });

// Evitamos que un usuario guarde dos veces la misma película.
favoriteSchema.index({ userId: 1, tmdbId: 1 }, { unique: true });

// Exportamos el modelo.
const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;

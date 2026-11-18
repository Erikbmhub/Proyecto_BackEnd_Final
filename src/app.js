const express = require('express');
const usersRoutes = require("./routes/users.routes")
const authRoutes = require("./routes/auth.routes")
const moviesRoutes = require("./routes/movies.routes")
const favoritesRoutes = require("./routes/favorites.routes")

const app = express()

app.use("/api/user", usersRoutes)
app.use("/api", authRoutes)
app.use("/api/movie", moviesRoutes)
app.use("/api/favorites", favoritesRoutes)

module.exports = app
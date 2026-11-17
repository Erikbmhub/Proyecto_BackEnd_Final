const express = require('express');
const usersRoutes = require("./src/routes/users.routes")
const authRoutes = require("./src/routes/auth.routes")
const moviesRoutes = require("./src/routes/movies.routes")
const favoritesRoutes = require("./src/routes/favorites.routes")
//Pendinte importar el módulo server.js que inicia el servidor

const app = express()

app.use("/api/user", usersRoutes)
app.use("/api", authRoutes)
app.use("/api/movie", moviesRoutes)
app.use("/api/favorites", favoritesRoutes)

const path = require("path");
const express = require("express");

const authRoutes = require("./routes/auth.routes")
const favoritesRoutes = require("./routes/favorites.routes")
const moviesRoutes = require("./routes/movies.routes")
const usersRoutes = require("./routes/users.routes")
const webRoutes = require("./routes/web.routes")

const app = express()

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

app.use("/api/user", usersRoutes)
app.use("/api", authRoutes)
app.use("/api/movie", moviesRoutes)
app.use("/api/favorites", favoritesRoutes)
app.use("/", webRoutes)

module.exports = app

require('dotenv').config();
const path = require("path");
const express = require("express");

// Todo relacionado con Auth revisar para saber donde meterlo para dejar archivo limpio
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require("passport");
require("./auth/googleAuth"); 



const authRoutes = require("./routes/auth.routes.js");
const favoritesRoutes = require("./routes/favorites.routes")
const moviesRoutes = require("./routes/movies.routes")
const usersRoutes = require("./routes/users.routes")
const webRoutes = require("./routes/web.routes")

const app = express()

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

//Auth
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({ secret: process.env.JWT_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());



app.use("/api/user", usersRoutes)
app.use(authRoutes)
app.use("/api/movie", moviesRoutes)
app.use("/api/favorites", favoritesRoutes)
app.use("/", webRoutes)

module.exports = app

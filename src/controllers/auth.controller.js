const { request } = require("express")

async function signupAuth(req, res) { // Registrar usuario en la aplicación
    //pendiente
    res.redirect("/dashboard")
}

async function loginAuth(req, res) { //Hacer login en la aplicación
    //pendiente
    let rol
    res.render("../views/admin/movies.pug", {rol})
}

async function logoutAuth(req, res) { //Salir
    //pendiente
    res.redirect("/")
}

module.exports = authController = {
    signupAuth,
    loginAuth,
    logoutAuth
}
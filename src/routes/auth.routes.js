const express = require('express');
const authController = require("../controllers/auth.controller")

const router = express.Router();

router.post("/signup", authController.signupAuth) // Registrar usuario en la aplicación
router.post("/login", authController.loginAuth) //Hacer login en la aplicación
router.post("/logout", authController.logoutAuth) //Salir

module.exports = router
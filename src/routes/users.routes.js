const express = require('express');
const usersController = require("../controllers/users.controller")

const router = express.Router();

router.get("/", usersController.getUsers) //Obtener datos del perfil del usuario o administrador
router.put("/", usersController.putUsers) //Editar datos del perfil del usuario o administrador
router.delete("/", usersController.deleteUsers) //Borrar un usuario de la base de datos (admin)

module.exports = router
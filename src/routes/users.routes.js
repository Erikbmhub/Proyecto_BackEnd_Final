const express = require('express');
const usersController = require("../controllers/users.controller")

// Importamos los middlewares de autenticación y autorización.
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");
const router = express.Router();

router.get("/", usersController.getUsers) //Obtener datos del perfil del usuario o administrador
router.post("/", usersController.createUserAdmin); // Crear un usuario desde administración.
router.put("/:id", usersController.putUsers); // Editar un usuario por su ID.
router.delete("/:id", usersController.deleteUsers); // Eliminar un usuario por su ID.
module.exports = router
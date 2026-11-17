const express = require('express');
const usersController = require("../controllers/users.controller")

const router = express.Router();

router.get("/", usersController.getUsers)
router.put("/", usersController.putUsers)
router.delete("/", usersController.deleteUsers)

module.exports = router
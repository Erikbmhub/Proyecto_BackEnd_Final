const express = require('express');
const authController = require("../controllers/auth.controller")

const router = express.Router();

router.post("/signup", authController.signupAuth)
router.post("/login", authController.loginAuth)
router.post("/logout", authController.logoutAuth)

module.exports = router
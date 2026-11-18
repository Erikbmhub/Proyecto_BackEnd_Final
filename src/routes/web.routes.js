const express = require('express');
const webController = require("../controllers/web.controller.js")

const router = express.Router();

router.get("/", webController.getViewHome)
router.get("/dashboard", webController.getViewDashboard)
router.get("/search", webController.getViewSearch)
router.get("/search/:title", webController.getViewSearchByDetail)
router.get("/movies", webController.getViewMovies)
router.get("/profile", webController.getViewProfile)
router.get("/users", webController.getViewUsers)
router.get("/signup", webController.getViewSignUp)

module.exports = router
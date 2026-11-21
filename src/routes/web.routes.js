
const express = require('express');
const webController = require("../controllers/web.controller.js");
const authMiddleware = require("../middlewares/auth.middleware");
const authorizeRole = require("../middlewares/role.middleware");

const router = express.Router();

router.get("/", webController.getViewHome);
router.get("/signup", webController.getViewSignUp);
router.get("/dashboard", authMiddleware, authorizeRole("user"), webController.getViewDashboard);
router.get("/search", authMiddleware, authorizeRole("user"), webController.getViewSearch);
router.get("/search/:title", authMiddleware, authorizeRole("user"), webController.getViewSearchByDetail);
router.get("/favorites", authMiddleware, authorizeRole("user"), webController.getViewFavorites);
router.get("/movies", authMiddleware, webController.getViewMovies);
router.get("/profile", authMiddleware, webController.getViewProfile);
router.get("/users", authMiddleware, authorizeRole("admin"), webController.getViewUsers);

module.exports = router;

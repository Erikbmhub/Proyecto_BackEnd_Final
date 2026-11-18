const express = require('express');
const webController = require("../controllers/web.controller.js")

const router = express.Router();

router.get("/", webController.getHome)
router.get("/", webController.getLogin)


module.exports = router
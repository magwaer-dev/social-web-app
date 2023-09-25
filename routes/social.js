const path = require("path");

const express = require("express");
const socialController = require("../controllers/social");

const router = express.Router();

router.get("/", socialController.getIndex);

module.exports = router;

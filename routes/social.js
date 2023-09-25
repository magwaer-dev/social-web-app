const path = require("path");

const express = require("express");
const socialController = require("../controllers/social");

const router = express.Router();

router.get("/", socialController.getIndex);

router.get("/userAccount", socialController.getUserAccount);

module.exports = router;

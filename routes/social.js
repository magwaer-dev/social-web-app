const path = require("path");

const express = require("express");

const socialController = require("../controllers/social");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get("/", socialController.getIndex);

router.get("/messages", isAuth, socialController.getMessages);

router.get("/notifications", isAuth, socialController.getNotifications);

router.get("/profiles", socialController.getProfiles);

router.get("/userAccount", isAuth, socialController.getUserAccount);

module.exports = router;

const path = require("path");

const express = require("express");

const socialController = require("../controllers/social");

const router = express.Router();

router.get("/", socialController.getIndex);

router.get("/messages", socialController.getMessages);

router.get("/notifications", socialController.getNotifications);

router.get("/profiles", socialController.getProfiles);

router.get("/userAccount", socialController.getUserAccount);


module.exports = router;

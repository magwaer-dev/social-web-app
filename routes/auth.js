// const { check, body } = require("express-validator/check");
const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);
router.get("/signup", authController.getSignup);
router.post("/signup", authController.postSignup);
// router.post("/login", authController.postLogin);

module.exports = router;

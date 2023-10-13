// const { check, body } = require("express-validator/check");
const express = require("express");

const authController = require("../controllers/auth");

const router = express.Router();

router.get("/login", authController.getLogin);

router.get("/signup", authController.getSignup);

router.post("/signup", authController.postSignup);

router.post("/login", authController.postLogin);

router.post("/logout", authController.postLogout);

router.get("/reset", authController.getReset);

// router.post("/reset", authController.postResetPw);

// router.get("/reset/:token", authController.getNewPassword);

// router.post("/new-password/:token", authController.postNewPassword);

module.exports = router;

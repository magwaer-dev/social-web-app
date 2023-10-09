const bcrypt = require("bcryptjs");

const db = require("../util/database");
const User = require("../models/user");

const errorMessage = "User already exists";

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    pageTitle: "Login",
    path: "/signup",
  });
};

exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Log the user registration attempt
  console.log("User registration attempt:", {
    username,
    email,
    password,
    confirmPassword,
  });

  User.checkIfUserExists(email)
    .then((userExists) => {
      if (userExists) {
        // User with the provided email already exists, log and redirect back to registration
        console.log("User with email", email, "already exists.");
        throw new Error(errorMessage);
      }
      // User with the provided email does not exist, proceed with user registration
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User(null, username, email, hashedPassword, null);
      return user.save();
    })
    .then(() => {
      res.redirect("/login"); // Redirect to the login page after successful registration
    })
    .catch((error) => {
      if (error.message === errorMessage) {
        res.redirect("/signup"); // Redirect to the registration page
      } else {
        console.log(error);
        res.status(500).send("An error occurred during registration.");
      }
    });
};

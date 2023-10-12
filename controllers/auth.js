const bcrypt = require("bcryptjs");

const db = require("../util/database");
const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: message,
  });
};
exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.getUserByEmail(email)
    .then((user) => {
      if (!user) {
        req.flash("error", `User with this email ${email} does not exist.`);
        return req.session.save((err) => {
          if (err) {
            console.error(err);
          }
          res.redirect("/login");
        });
      }
      console.log(user);
      console.log(user.password);

      bcrypt
        .compare(password, user.password)
        .then((passwordsMatch) => {
          if (passwordsMatch) {
            req.session.isLoggedIn = true;
            req.session.save((err) => {
              if (err) {
                console.error(err);
              }
              res.redirect("/");
            });
          } else {
            req.flash("error", "Password is incorrect.");
            return req.session.save((err) => {
              if (err) {
                console.error(err);
              }
              res.redirect("/login");
            });
          }
        })
        .catch((error) => {
          console.error(error);
          res.redirect("/login");
        });
    })
    .catch((error) => {
      console.error(error);
      res.redirect("/login");
    });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    pageTitle: "Signup",
    path: "/signup",
    isAuthenticated: req.session.isLoggedIn,
    errorMessage: message,
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.checkIfUserExists(email).then((userExists) => {
    if (userExists) {
      req.flash("error", `User with email ${email}  already exists.`);
      return req.session.save((err) => {
        if (err) {
          console.error(err);
        }
        return res.redirect("/signup");
      });
    } else {
      // Hash the password and create a new user
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const user = new User(null, username, email, hashedPassword, null);
          console.log("User to save:", user);
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        })
        .catch((error) => {
          if (error.message === "User already exists") {
            res.redirect("/signup");
          } else {
            console.log(error);
            res.status(500).send("An error occurred during registration.");
          }
        });
    }
  });
};

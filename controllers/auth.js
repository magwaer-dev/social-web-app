const crypto = require("crypto");

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { Op } = require("sequelize");
const { validationResult } = require("express-validator");

const db = require("../util/database");
const User = require("../models/user");

//BREVO EMAIL SENDING CONFIGURATIONS

// const options = {
//   host: "smtp-relay.brevo.com",
//   port: 587,
//   auth: {
//     user: process.env.LOGIN,
//     pass: process.env.SMTP_KEY,
//   },
// };

// let transporter = nodemailer.createTransport(options);

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

//EMAIL TEST SENDING BELLOW

const transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email", // Use Ethereal Email for testing
  port: 587,
  auth: {
    user: "roscoe.haley@ethereal.email",
    pass: "dSy9AdDqBSvSrbzmas",
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

exports.getLogin = (req, res, next) => {
  let errorMessage = req.flash("error")[0] || null;
  let successMessage = req.flash("success")[0] || null;
  res.render("auth/login", {
    pageTitle: "Login",
    path: "/login",
    errorMessage: errorMessage,
    successMessage: successMessage,
    oldInput: { email: "", password: "" },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/login", {
      pageTitle: "Login",
      path: "/login",
      errorMessage: errors.array()[0].msg,
      // successMessage: successMessage,
      oldInput: { email: email, password: password },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ where: { email: email } }).then((user) => {
    if (!user) {
      return res.status(422).render("auth/login", {
        pageTitle: "Login",
        path: "/login",
        errorMessage: "Invalid email or password",
        // successMessage: successMessage,
        oldInput: { email: email, password: password },
        validationErrors: errors.array(),
      });
    }
    bcrypt
      .compare(password, user.password)
      .then((passwordMatch) => {
        if (passwordMatch) {
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            if (err) {
              console.error(err);
            }
            res.redirect("/");
          });
        }
        return res.status(422).render("auth/login", {
          pageTitle: "Login",
          path: "/login",
          errorMessage: "Invalid email or password",
          // successMessage: successMessage,
          oldInput: { email: email, password: password },
          validationErrors: errors.array(),
        });
      })
      .catch((error) => {
        console.log(error);
        res.redirect("/login");
      });
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let errorMessage = req.flash("error")[0] || null;
  let successMessage = req.flash("success")[0] || null;
  res.render("auth/signup", {
    pageTitle: "Register",
    path: "/signup",
    errorMessage: errorMessage,
    successMessage: successMessage,
    oldInput: { email: "", username: "", password: "", confirmPassword: "" },
    validationErrors: [],
  });
};

exports.postSignup = (req, res, next) => {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("auth/signup", {
      pageTitle: "Register",
      path: "/signup",
      errorMessage: errors.array()[0].msg,
      // successMessage: successMessage,
      oldInput: {
        username: username,
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword,
      },
      validationErrors: errors.array(),
    });
  }

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        username: username,
        email: email,
        password: hashedPassword,
      });

      return user.save();
    })
    .then((result) => {
      req.flash("success", "Your account was created successfully!");
      res.redirect("/login");
      transporter
        .sendMail({
          from: "communisync@gmail.com",
          to: email,
          subject: "Welcome to CommuniSync Social App!",
          html: `
                  <h1>Welcome to CommuniSync!</h1>
                  <p>Thank you for signing up!</p>
                  <p>Click <a href="http://localhost:3000/login">here</a> to login.</p>
                `,
        })
        .then((info) => {
          console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
          if (info.accepted) {
            console.log("Message sent and accepted: %s", info.accepted);
          } else {
            console.log("Message not sent and rejected!: %s", info.rejected);
          }
        })
        .catch((error) => {
          console.error(error);
          res.status(500).send("An error occurred during registration.");
        });
    });
};

exports.getReset = (req, res, next) => {
  let errorMessage = req.flash("error")[0] || null;
  let successMessage = req.flash("success")[0] || null;
  res.render("auth/reset", {
    pageTitle: "Reset password",
    path: "/reset",
    errorMessage: errorMessage,
    successMessage: successMessage,
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        }
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        req.flash(
          "success",
          `Success! Password reset email sent to ${req.body.email}.`
        );
        res.redirect("/login");
        transporter.sendMail({
          from: "communisync@gmail.com",
          to: req.body.email,
          subject: "Password reset",
          html: `
            <p>You requested a password reset</p>
            <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>

          `,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  token = req.params.token;
  User.findOne({
    where: {
      resetToken: token,
      resetTokenExpiration: {
        [Op.gt]: Date.now(),
      },
    },
  })
    .then((user) => {
      let errorMessage = req.flash("error")[0] || null;
      let successMessage = req.flash("success")[0] || null;
      res.render("auth/new-password", {
        pageTitle: "New password",
        path: "/new-password",
        errorMessage: errorMessage,
        successMessage: successMessage,
        userId: user.id ? user.id.toString() : null,
        passwordToken: token,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    where: {
      resetToken: passwordToken,
      resetTokenExpiration: { [Op.gt]: Date.now() },
      id: userId,
    },
  })
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid reset token or user not found.");
        return res.redirect("/login");
      }
      resetUser = user;

      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      req.flash("success", "Password updated successfully.");
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
    });
};

const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

const db = require("../util/database");
const User = require("../models/user");

//BREVO EMAIL SENDING CONFIGURATIONS

const options = {
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.LOGIN,
    pass: process.env.SMTP_KEY,
  },
};

let transporter = nodemailer.createTransport(options);

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});


//EMAIL SENDING TESTING BELLOW

// const transporter = nodemailer.createTransport({
//   host: "smtp.ethereal.email", // Use Ethereal Email for testing
//   port: 587,
//   auth: {
//     user: "carter.nader@ethereal.email",
//     pass: "fzMpRHK1FvaN9S3TAA",
//   },
// });

// transporter.verify(function (error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

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
              if(info.accepted) {
              console.log("Message sent and accepted: %s", info.accepted);
              } else {
              console.log("Message not sent and rejected!: %s", info.rejected);
              }
              res.redirect("/login");
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("An error occurred during registration.");
            });
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

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    pageTitle: "Reset Password",
    path: "/reset",
    errorMessage: message,
  });
};

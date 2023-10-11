const path = require("path");

exports.getIndex = (req, res, next) => {
  res.render("social/index", {
    pageTitle: "Home",
    path: "/",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getMessages = (req, res, next) => {
  res.render("social/messages", {
    pageTitle: "Your messages",
    path: "/messages",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getNotifications = (req, res, next) => {
  res.render("social/notifications", {
    pageTitle: "Your Notifications",
    path: "/notifications",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getProfiles = (req, res, next) => {
  res.render("social/profiles", {
    pageTitle: "Profiles",
    path: "/profiles",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getUserAccount = (req, res, next) => {
  res.render("social/userAccount", {
    pageTitle: "Your Account",
    path: "/userAccount",
    isAuthenticated: req.session.isLoggedIn,
  });
};

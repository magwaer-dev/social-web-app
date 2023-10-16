const path = require("path");

exports.getIndex = (req, res, next) => {
  res.render("social/index", {
    pageTitle: "Home",
    path: "/",
  });
};

exports.getMessages = (req, res, next) => {
  res.render("social/messages", {
    pageTitle: "Your messages",
    path: "/messages",
  });
};

exports.getNotifications = (req, res, next) => {
  res.render("social/notifications", {
    pageTitle: "Your Notifications",
    path: "/notifications",
  });
};

exports.getProfiles = (req, res, next) => {
  res.render("social/profiles", {
    pageTitle: "Profiles",
    path: "/profiles",
  });
};

exports.getUserAccount = (req, res, next) => {
  res.render("social/userAccount", {
    pageTitle: "Your Account",
    path: "/userAccount",
  });
};

exports.getPost = (req, res, next) => {
  res.render("social/post", {
    pageTitle: "Post a message",
    path: "/post",

    
  });
};
const path = require("path");

exports.getIndex = (req, res, next) => {
  res.render("social/index", {
    pageTitle: "Home",
    path: "/",
  });
};

exports.getUserAccount = (req, res, next) => {
  res.render("social/userAccount", {
    pageTitle: "User Account",
    path: "/userAccount",
  });
};

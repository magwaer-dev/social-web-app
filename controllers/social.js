const path = require("path");

exports.getIndex = (req, res, next) => {
  res.render("social/index", {
    pageTitle: "Home",
    path: "/",
  });
};

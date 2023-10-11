module.exports = (req, res, next) => {
  if (!req.session.isLoggedIn) {
    console.log("Not allowed! You are not logged in.");
    return res.redirect("/login");
  }
  next();
};

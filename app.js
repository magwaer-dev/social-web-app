const path = require("path");

require("dotenv").config();
const express = require("express");
const session = require("express-session");
var SequelizeStore = require("connect-session-sequelize")(session.Store);
const csrf = require("csurf");
const flash = require("connect-flash");

const sequelize = require("./util/database");
const User = require("./models/user");
const Post = require("./models/post");

const app = express();

const sessionStore = new SequelizeStore({
  db: sequelize,
});

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const socialRoutes = require("./routes/social");
const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(authRoutes);
app.use(socialRoutes);

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.APP_PORT, () =>
      console.log(`Social media app listening on port ${process.env.APP_PORT}`)
    );
  })
  .catch((error) => {
    console.error("Database synchronization error:", error);
  });

const path = require("path");

require("dotenv").config();
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const dbConnection = require("./util/database");

const app = express();

const sessionStore = new MySQLStore(
  {
    expiration: 1000 * 60 * 60 * 24, // Session expiration time (e.g., 24 hours)
    createDatabaseTable: true, // Automatically create session table if not exists
    schema: {
      tableName: "sessions", // Name of the session table in your database
    },
  },
  dbConnection // Pass your database connection pool here
);

const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

const socialRoutes = require("./routes/social");
const authRoutes = require("./routes/auth");
// const isAuth = require("./middleware/is-auth");
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
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(socialRoutes);
app.use(authRoutes);
app.listen(process.env.APP_PORT, () =>
  console.log(`Social media app listening on port ${process.env.APP_PORT}`)
);

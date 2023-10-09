const path = require("path");

const express = require("express");

const db = require("./util/database");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const socialRoutes = require("./routes/social");
const authRoutes = require("./routes/auth");
const isAuth = require("./middleware/is-auth");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(socialRoutes);
app.use(authRoutes);
app.listen(3000, () => console.log("Social media app listening on port 3000"));

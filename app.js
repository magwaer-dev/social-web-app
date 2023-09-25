const path = require("path");

const express = require("express");

const socialRoutes = require("./routes/social");

const app = express();

app.use(express.static(path.join(__dirname, "public/css")));

app.set("view engine", "ejs");
app.set("views", "views");

app.use(socialRoutes);
app.listen(3000, () => console.log("Social media app listening on port 3000"));

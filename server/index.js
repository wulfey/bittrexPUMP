const express = require("express");
const mongoose = require("mongoose");
const keys = require("./config/keys");
require("./models/User");
require("./services/passport");

// const authRoutes = require("./routes/authroutes");

mongoose.connect(keys.MONGO_URI);
const app = express();

// this is the magic triggering language that causes the serialize and cookie things to work like rails
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.COOKIE_KEY]
  })
);
app.use(passport.initialize());
app.use(passport.session());

// authRoutes(app);
require("./routes/authroutes")(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
// app.listen(5001);

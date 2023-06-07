require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
let passport = require('passport')
let auth = require('./middlewares/auth')



const userRoutes = require("./routes/userRoute");
const shoppingCartRoutes = require("./routes/shoppingCartRoute");



const app = express();

app.use(passport.initialize())
app.use(helmet());
app.use(cors());
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
app.use(bodyParser.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new FileStore(),
  }),
);



app.use("/user", userRoutes);
app.use("/shoppingCart", shoppingCartRoutes);

app.use((error, _req, res, _next) => {
  console.log(error)
  const status = error.statusCode || 500;
  const { message, data } = error;
  res.status(status).json({ message, data });
});
mongoose
  .connect("mongodb://127.0.0.1:27017/assignment")
  .then(() => {
    app.listen(8080);
  })
  .catch(_err => {});

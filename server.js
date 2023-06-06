const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const userRoutes = require("./routes/userRoute");
const shoppingCartRoutes = require("./routes/shoppingCartRoute");

const app = express();
app.use(bodyParser.json());

const store = new MongoDBStore({
  uri: "mongodb://127.0.0.1:27017/assignment",
  collection: "sessions",
});

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store,
  }),
);

app.use("/user", userRoutes);
app.use("/shoppingCart", shoppingCartRoutes);

app.use((error, _req, res, _next) => {
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

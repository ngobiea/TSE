const express = require("express");
const bodyParser = require("body-parser");
const tutorRoutes = require("./routes/tutorRoute");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.json());

app.use("/tutor", tutorRoutes);

mongoose
  .connect("mongodb://127.0.0.1:27017/assignment")
  .then(() => {
    app.listen(8080);
    console.log("App is listening on port 8080");
  })
  .catch((err) => console.log(err));

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const usersRoute = require("./api/routes/users");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  "mongodb://localhost/dogs",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("😎Connected to mongodb😎");
  }
);

app.use("/users", usersRoute);

app.listen(3333, () => {
  console.log(`⚡Server is running on port 3333⚡`);
});

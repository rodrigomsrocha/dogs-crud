const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const authRoute = require("./api/routes/auth");
const userRoute = require("./api/routes/user");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

mongoose.connect(
  "mongodb://localhost/dogs",
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("😎Connected to mongodb😎");
  }
);

app.use("/auth", authRoute);
app.use("/user", userRoute);

app.listen(3333, () => {
  console.log(`⚡Server is running on port 3333⚡`);
});

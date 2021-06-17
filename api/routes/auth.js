const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../data/models/User");
const { registerValidation, loginValidation } = require("../validation");

router.post("/register", async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const usernameExists = await User.findOne({
    username: req.body.username,
  });
  const emailExists = await User.findOne({
    email: req.body.email,
  });

  if (usernameExists)
    return res.status(400).json({ message: "Usuário em uso." });
  if (emailExists) return res.status(400).json({ message: "Email já existe." });

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    await user.save();
    user.password = undefined;
    res.json({ user: user._id });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

router.post("/login", async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const user = await User.findOne({ username: req.body.username });
  if (!user) return res.status(400).json({ message: "Dados incorretos." });

  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).json({ message: "Dados incorretos." });

  user.password = undefined;

  const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
    expiresIn: 86400,
  });

  res.json({
    token: token,
    user_email: user.email,
    user_nicename: user.username,
    user_display_name: user.username,
  });
});

module.exports = router;

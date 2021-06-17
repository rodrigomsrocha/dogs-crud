const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");

const User = require("../data/models/User");
const registerValidation = require("../validation");

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
    res.json({ user: user._id });
  } catch (err) {
    res.status(400).json({ message: err });
  }
});

module.exports = router;

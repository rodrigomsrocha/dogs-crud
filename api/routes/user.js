const express = require("express");
const router = express.Router();

const User = require("../data/models/User");

const verify = require("../middlewares/validateToken");

router.get("/", verify, async (req, res) => {
  const user = await User.findOne({ _id: req.user._id });
  res.json({
    id: user._id,
    username: user.username,
    name: user.username,
    email: user.email,
  });
});

module.exports = router;

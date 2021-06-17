const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader)
    return res.status(401).json({ message: "No token provided." });

  const parts = authHeader.split(" ");

  if (!parts.length === 2)
    return res.status(401).json({ message: "Token error." });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme))
    return res.status(401).json({ message: "Token malformatted." });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

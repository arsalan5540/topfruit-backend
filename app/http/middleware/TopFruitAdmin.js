const jwt = require("jsonwebtoken");
const config = require("config");
module.exports = function (req, res, next) {
  try {
    const role = req.user.role;
    if (role === "admin") return next();
    else return res.status(401).send("شما اجازه دسترسی به این دیتا را ندارید");
  } catch (err) {
    console.log(err);
    return res.status(401).send("شما اجازه دسترسی به این دیتا را ندارید");
  }
};

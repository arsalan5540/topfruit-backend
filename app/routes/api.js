const router = require("express").Router();
const ProductRoutes = require("./ProductRoutes");
const UserRoutes = require("./UserRoutes");

router.use(function (req, res, next) {
  const allowedOrigin = [
    // "https://topfruitt.ir",
    // "'https://admin.topfruitt.ir'",
    "http://localhost:3001"
  ];
  const origin = req.headers.origin;
  if (allowedOrigin.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // res.header('Access-Control-Allow-Origin','https://topfruitt.ir')
  // res.header(
  //     'Access-Control-Allow-Origin',
  //     'Origin, x-auth-token, Content-type, Accept'
  // )
  res.header("x-auth-token", "3.2.1");
  next();
});

router.use("/topfruit", ProductRoutes);
router.use("/user", UserRoutes);

module.exports = router;

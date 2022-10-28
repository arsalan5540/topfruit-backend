const router = require('express').Router();
const ProductRoutes = require('./ProductRoutes');
const UserRoutes = require("./UserRoutes");

router.use(function (req, res, next){
    res.header('Access-Control-Allow-Origin','*')
    res.header(
        'Access-Control-Allow-Origin',
        'Origin, x-auth-token, Content-type, Accept'
    )
    res.header('x-auth-token', '3.2.1')
    next()
})

router.use("/topfruit", ProductRoutes);
router.use("/user" , UserRoutes);


module.exports = router;
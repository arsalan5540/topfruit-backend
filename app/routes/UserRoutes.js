const router = require("express").Router();
const controller = require("../http/controler/ProductController");
const UserController = require("../http/controler/UserController");

const Auth = require("../http/middleware/Auth");
const User = require("../http/middleware/User");

router.post("/login", UserController.login);
router.post("/register", UserController.register);


router.get("/productsList", controller.getListForUser);
router.get("/searchProducts/:name", controller.searchProducts);
router.get("/getFruitList", controller.getFruitList);
router.get("/getVegetableList", controller.getVegetableList);
router.get("/getCropsList", controller.getCropsList);

router.post("/updateBasket",[Auth,User], UserController.updateBasket);
router.get("/getBasket",[Auth,User], UserController.getBasket);

router.get("/checkoutBasket" ,[Auth,User], UserController.checkoutBasket);
router.get("/verifyPayment" , UserController.verifyPayment);
router.get("/payment/:paymentCode" , UserController.getPaymentDetail);


// router.post("/foods/photo", [Auth, RestaurantAdmin], controller.setFoodPhoto);

module.exports = router;
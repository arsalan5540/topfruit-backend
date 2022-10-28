const router = require('express').Router();
const multer = require("multer");
const ProductController =require("../http/controler/ProductController");
const Auth = require("../http/middleware/Auth");
const TopFruitAdmin = require("../http/middleware/TopFruitAdmin");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})

var upload = multer({ storage: storage });

router.post("/creatAdmin", ProductController.creatAdmin);
router.post("/loginAdmin", ProductController.loginAdmin);
router.get("/getUserList",[Auth, TopFruitAdmin],  ProductController.getUserList);

router.post("/products/addProduct",[Auth, TopFruitAdmin ,upload.single("pic")], ProductController.addProduct);
router.get("/products/getProductList",[Auth, TopFruitAdmin],  ProductController.getProductList);
router.get("/products/getProductList/:id",[Auth, TopFruitAdmin], ProductController.getOne);
router.delete("/products/deleteProduct/:id",[Auth, TopFruitAdmin],  ProductController.deleteProduct);
router.put("/products/updateProduct/:id",[Auth, TopFruitAdmin,upload.single("pic")],  ProductController.updateProduct);


module.exports = router;
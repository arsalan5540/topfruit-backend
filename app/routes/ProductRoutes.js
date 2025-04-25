const router = require('express').Router();
// const multer = require("multer");
const ProductController =require("../http/controler/ProductController");
const Auth = require("../http/middleware/Auth");
const TopFruitAdmin = require("../http/middleware/TopFruitAdmin");
// const AWS = require("aws-sdk");
// const multerS3 = require("multer-s3");

// const config = {
//     endpoint: process.env(LIARA_ENDPOINT),
//     accessKeyId: process.env(LIARA_ACCESS_KEY),
//     secretAccessKey: process.env(LIARA_SECRET_KEY),
//     region: "default",
//   };

//   const s3 = new AWS.S3(config);

//   const upload = multer({
//     storage: multerS3({
//       s3,
//       bucket: process.env(LIARA_BUCKET_NAME),
//       key: function (req, file, cb) {
//         console.log(file);
//         cb(null, file.originalname);
//       },
//     }),
//   });


router.post("/creatAdmin", ProductController.creatAdmin);
router.post("/loginAdmin", ProductController.loginAdmin);
router.get("/getUserList",[Auth, TopFruitAdmin],  ProductController.getUserList);
router.get("/getOrdersList",[Auth, TopFruitAdmin],  ProductController.getOrdersList);

router.post("/products/addProduct",[Auth, TopFruitAdmin ], ProductController.addProduct);
router.get("/products/getProductList",[Auth, TopFruitAdmin],  ProductController.getProductList);
router.get("/products/getProductList/:id",[Auth, TopFruitAdmin], ProductController.getOne);
router.delete("/products/deleteProduct/:id",[Auth, TopFruitAdmin], ProductController.deleteProduct);
router.delete("/products/removeSync/:name",[Auth, TopFruitAdmin], ProductController.removeSync);
router.put("/products/updateProduct/:id",[Auth, TopFruitAdmin],  ProductController.updateProduct);
// router.put("/products/updateProduct/:id",[Auth, TopFruitAdmin,upload.single("pic")],  ProductController.updateProduct);


module.exports = router;
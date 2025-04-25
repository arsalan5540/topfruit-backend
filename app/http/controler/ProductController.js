const ProductModel = require("../../models/Products");
const AdminModel = require("../../models/Admin");
const UserModel = require("../../models/User");
const Payment = require("../../models/Payment");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const fs = require("fs");
const {
  validateCreateProduct,
  validateUpdateProduct,
  validateCreateAdmin,
  loginValidator,
} = require("../validator/ProductValidator");

var MongoClient = require('mongodb').MongoClient;
    var url = "mongodb://localhost:27017/";

class ProductController {
  
  async creatAdmin(req, res) {
    const { error } = validateCreateAdmin(req.body);
    if (error) return res.status(400).send(error.message);
    let admin = new AdminModel(
      _.pick(req.body, ["adminUsername", "adminPassword"])
    );
    const salt = await bcrypt.genSalt(10);
    admin.adminPassword = await bcrypt.hash(admin.adminPassword, salt);
    admin = await admin.save();
    res.send(admin);
  }

  async loginAdmin(req, res) {
    const { error } = loginValidator(req.body);
    if (error) return res.status(400).send({ message: error.message });

    let admin = await AdminModel.findOne({
      adminUsername: req.body.username,
    });
    if (!admin)
      return res
        .status(400)
        .send({ message: "ادمینی با این نام کاربری یا پسورد یافت نشد" });

    const result = await bcrypt.compare(req.body.password, admin.adminPassword);
    if (!result)
      return res
        .status(400)
        .send({ message: "ادمینی با این نام کاربری یا پسورد یافت نشد" });

    const token = admin.generateAuthToken();
    res
      .header("Access-Control-Expose-headers", "x-auth-token")
      .header("x-auth-token", token)
      .status(200)
      .send({ success: true });
  }

  async addProduct(req, res) {
    const adminCheck = await AdminModel.findOne({
      adminUsername: req.user.username,
    });
    if (!adminCheck) return res.status(400).send("شما ادمین نیستید");
    const { error } = validateCreateProduct(req.body);
    if (error) return res.status(400).send(error.message);
    let products = new ProductModel(
      _.pick(req.body, ["name", "price", "productWeight", "productType", "pic" ,"Inventory"])
      // pic: req.file.path
    );
    // products.pic = await req.file.filename; 
    if (!products) return res.status(400).send("محصول مربوطه پیدا نشد");
    await products.save();
    res.send(true);
  }
  async getProductList(req, res) {
    const adminCheck = await AdminModel.findOne({
      adminUsername: req.user.username,
    });
    if (!adminCheck) return res.status(400).send("شما ادمین نیستید");
    const list = await ProductModel.find()
      .select("name price productWeight productType pic Inventory");
    res.send(list);
  }
  async getListForUser(req, res) {
    const list = await ProductModel.find()
      .select("name price productWeight productType pic Inventory");
    res.send(list);
  }
  async getOne(req, res) {
    const adminCheck = await AdminModel.findOne({
      adminUsername: req.user.username,
    });
    if (!adminCheck) return res.status(400).send("شما ادمین نیستید");
    const id = req.params.id;
    const data = await ProductModel.findById(id);
    if (!data) return res.status(404).send("not found");
    res.send(data);
  }
  async searchProducts(req, res) {
    const searchName = req.params.name;
  const data = await ProductModel.find({name : {$regex: ".*" + searchName + ".*"}});
    if (!data) return res.status(404).send("not found");
    if (data.length === 0) return res.status(404).send("not found");
    res.send(data);
  }
  async getFruitList(req, res) {
     
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("topfruit");
      var query = { productType: "میوه جات" };
       dbo.collection("products").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.send(result);
      });
    });
    // const id = req.params.id;
    // const data = await ProductModel.findById(id);
    // if (!data) return res.status(404).send("not found");
    
  }
  async getVegetableList(req, res) {
     
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("topfruit");
      var query = { productType: "سبزی جات" };
       dbo.collection("products").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.send(result);
      });
    });
    
  }
  async getCropsList(req, res) {
     
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("topfruit");
      var query = { productType: "صیفی جات" };
       dbo.collection("products").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        res.send(result);
      });
    });
    
  }
  
  async deleteProduct(req, res) {
    const adminCheck = await AdminModel.findOne({
      adminUsername: req.user.username,
    });
    if (!adminCheck) return res.status(400).send("شما ادمین نیستید");
    const id = req.params.id;
    const result = await ProductModel.findByIdAndRemove(id);
    res.status(200).send();
  }
  async updateProduct(req, res) {
    const adminCheck = await AdminModel.findOne({
      adminUsername: req.user.username,
    });
    if (!adminCheck) return res.status(400).send("شما ادمین نیستید");
    const id = req.params.id;
    const { error } = validateUpdateProduct(req.body);
    if (error) return res.status(400).send(error.message);
    const result = await ProductModel.findByIdAndUpdate(
      id,
      {
        $set: _.pick(req.body, [
          "name",
          "price",
          "productWeight",
          "productType",
          "Inventory"
        ]),
    //  pic :  req.file.filename 
      },
      { new: true }
    )
    // console.log(result.pic)
    if (!result) return res.status(404).send("not found");
    res.send(_.pick(result, ["name", "price", "productWeight", "productType","Inventory"]));
  }

  async getUserList(req, res){
    const adminCheck = await AdminModel.findOne({
      adminUsername: req.user.username,
    });
    if (!adminCheck) return res.status(400).send("شما ادمین نیستید");
    const list = await UserModel.find()
      .select("name phone")
      .limit(20);
    res.send(list);
  }

  async getOrdersList(req, res){
    const adminCheck = await AdminModel.findOne({
      adminUsername: req.user.username,
    });
    if (!adminCheck) return res.status(400).send("شما ادمین نیستید");
    const ordersList = await Payment.find().select("basket user success amount");
    res.send(ordersList);
  }

  async removeSync(req, res){
    const fileName = req.params.name;
    const directoryPath = "uploads/";
  
    try {
      fs.unlinkSync(directoryPath + fileName);
  
      res.status(200).send({
        message: "File is deleted.",
      });
    } catch (err) {
      res.status(500).send({
        message: "Could not delete the file. " + err,
      });
    }
  };
}

module.exports = new ProductController();

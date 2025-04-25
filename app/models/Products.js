const mongoose = require("mongoose");

// const schemaComment = new mongoose.Schema({
//   user: { type: String, required: true },
//   text: { type: String, required: true },
//   score: Number,
// });

const schemaProduct = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  productWeight: { type: Number, required: true },
  productType: { type: String, required: true },
  pic: String,
  Inventory: Boolean,
});

// schemaProduct.methods.generateAuthToken = function () {
//   const data = {
//       _id : this._id,
//       username : this.adminUsername,
//       role : "pro",
//     };

//     return jwt.sign(data, config.get("jwtPrivateKey"));
// };

const model = mongoose.model("products", schemaProduct);

module.exports = model;

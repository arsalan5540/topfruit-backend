const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");


const basketSchema = new mongoose.Schema({
  products: [
    {
      name: String,
      productId: String,
      price: Number,
      count: Number,
      productWeight: Number,
    },
  ],
  userData: [
    {
      name: String,
      phone: String,
      address: String,
      description: String,
      time: String,
    },
  ],
});

const schema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  basket: basketSchema,
  totalPrice: {
    type: Number,
  },
});

schema.methods.generateAuthToken = function () {
  const data = {
    _id: this._id,
    role: "user",
  };

  return jwt.sign(data, config.get("jwtPrivateKey"));
};

const model = mongoose.model("user", schema);

module.exports = model;

const mongoose = require("mongoose");

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
  user: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    phone: String,
    name: String,
  },
  basket: basketSchema,
  paymentCode: String,
  success: {
    type: Boolean,
    default: false,
  },
  amount: Number,
  refId: String,
});

const model = mongoose.model("payment", schema);

module.exports = model;

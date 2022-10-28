const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const schemaAdmin = new mongoose.Schema({
  adminUsername : {type : String , required : true}, 
  adminPassword : {type : String , required : true}, 
});

schemaAdmin.methods.generateAuthToken = function () {
  const data = {
      _id : this._id,
      username : this.adminUsername,
      role : "admin",
    };

    return jwt.sign(data, config.get("jwtPrivateKey"));
};

const model = mongoose.model("admin", schemaAdmin);

module.exports = model;

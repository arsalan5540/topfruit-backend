const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

// const validateCreateProduct = (data) => {
//     const schema = Joi.object({
//         name: Joi.string().required(),
//         price: Joi.string().required(),
//         productWeight: Joi.string().required(),
//         productType: Joi.string().required(),
//         pic: Joi.string(),
//     })
//     return schema.validate(data);
// };

const validateCreateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    productWeight: Joi.number().required(),
    productType: Joi.string().required(),
    pic: Joi.string(),
    Inventory : Joi.boolean(),
  });
  return schema.validate(data);
};

const validateUpdateProduct = (data) => {
  const schema = Joi.object({
    name: Joi.string(),
    price: Joi.number(),
    productWeight: Joi.number(),
    productType: Joi.string(),
    Inventory: Joi.boolean(),
    // pic: Joi.string(),
  });
  return schema.validate(data);
};

const validateCreateAdmin = (data) => {
  const schema = Joi.object({
    adminUsername: Joi.string().required(),
    adminPassword: Joi.string().required(),
  });
  return schema.validate(data);
};

const loginValidator = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

module.exports = {
  validateCreateProduct,
  validateUpdateProduct,
  loginValidator,
  validateCreateAdmin,
};

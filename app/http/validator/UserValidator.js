const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);

const validateCreateUser = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().min(11).max(11).required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};
const validateLoginUser = (data) => {
  const schema = Joi.object({
    phone: Joi.string().min(11).max(11).required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};


module.exports = { validateCreateUser ,validateLoginUser};

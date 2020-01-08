const Joi = require('joi');

function validateLogin(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .error(new Error('Niepoprawny e-mail lub hasło')),
    password: Joi.string()
      .min(6)
      .max(64)
      .required()
      .error(new Error('Niepoprawny e-mail lub hasło'))
  };

  return Joi.validate(user, schema);
}

module.exports = validateLogin;

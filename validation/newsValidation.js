const Joi = require('joi');

function validateNewsInput(news) {
  const schema = {
    title: Joi.string()
      .min(5)
      .max(50)
      .required()
      .error(new Error('Wszystkie pola muszą byc wypełnione')),
    description: Joi.string()
      .min(5)
      .max(256)
      .required()
      .error(new Error('Wszystkie pola muszą byc wypełnione')),
    url: Joi.string()
      .required()
      .error(new Error('Wszystkie pola muszą byc wypełnione'))
  };

  return Joi.validate(news, schema);
}

module.exports = validateNewsInput;

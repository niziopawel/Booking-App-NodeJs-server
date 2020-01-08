const Joi = require('joi');

function validateEmployeeInput(employee) {
  const schema = {
    name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .error(new Error('Wprowadź poprawne imię.')),
    services: Joi.array().items(Joi.string()),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .error(new Error('Niepoprawny adres e-mail')),
    phone: Joi.string()
      .required()
      .error(new Error('Nieprawidłowy adres telefonu')),
    information: Joi.string()
      .min(5)
      .max(512),
    url: Joi.string()
      .allow('')
      .optional()
  };

  return Joi.validate(employee, schema);
}

module.exports = { validateEmployeeInput };

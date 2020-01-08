const Joi = require('joi');

function validateService(service) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .error(new Error('Niepoprawna nazwa usługi')),
    description: Joi.string()
      .allow('')
      .optional()
      .error(new Error('Niepoprawny opis usługi')),
    price: Joi.required().error(new Error('Pole cena jest wymagane')),
    duration: Joi.required()
  };

  return Joi.validate(service, schema);
}
module.exports = validateService;

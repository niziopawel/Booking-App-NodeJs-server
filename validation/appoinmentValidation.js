const Joi = require('joi');

function validateAppointmentInput(appointment) {
  const schema = {
    employeeID: Joi.string()
      .required()
      .error(new Error('Nieprawidłowy ID')),
    serviceID: Joi.string()
      .required()
      .error(new Error('Nieprawidłowy ID')),
    userID: Joi.string()
      .required()
      .error(new Error('Nieprawidłowy ID')),
    date: Joi.string()
      .required()
      .error(new Error('Nieprawidłowy format daty')),
    slot: Joi.number()
      .required()
      .error(new Error('Nieprawidłowy numer slota'))
  };

  return Joi.validate(appointment, schema);
}

module.exports = { validateAppointmentInput };

const Joi = require('joi');

function validateRegisterInput(user) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(50)
      .required()
      .error(
        new Error(
          'Poprawna nazwa użytkownika powinna zawierać minimum 5 znaków'
        )
      ),
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email()
      .error(new Error('Niepoprawny adres e-mail')),
    password: Joi.string()
      .min(6)
      .max(64)
      .required()
      .error(new Error('Hasło powinno mieć przynajmniej 6 znaków')),
    confirmPassword: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .error(new Error('Hasła różnią się między sobą')),
    phone: Joi.string()
      .regex(/^(?:\(?\+?48)?(?:[-\.\(\)\s]*(\d)){9}\)?$/)
      .required()
      .error(new Error('Niepoprawny numer telefonu'))
  };

  return Joi.validate(user, schema);
}

module.exports = validateRegisterInput;

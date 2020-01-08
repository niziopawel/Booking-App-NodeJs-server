const User = require('../models/user');
const mongoose = require('mongoose');
const validateLogin = require('../validation/loginValidation');
const bcrypt = require('bcrypt');
const _ = require('lodash');

exports.authenticateUser = async (req, res, next) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(500).send('Niepoprawny e-mail lub hasło');

  const isValid = await bcrypt.compare(req.body.password, user.password);
  if (!isValid) return res.status(500).send('Niepoprawny e-mail lub hasło');

  const token = user.generateAuthToken();
  res.status(200).json({ user, token });
};

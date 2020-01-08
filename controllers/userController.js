const User = require('../models/user');
const Appointment = require('../models/appointment');
const Id = require('valid-objectid');
const mongoose = require('mongoose');
const validateRegisterInput = require('../validation/registerValidation');
const bcrypt = require('bcrypt');
const _ = require('lodash');

exports.registerUser = async (req, res, next) => {
  let { error } = validateRegisterInput(req.body);
  if (error) return res.status(400).send(error.message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(500).send('Email jest juz zajety');

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    phone: req.body.phone
  });
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
    res.send(_.pick(user, ['_id', 'name', 'email', 'phone']));
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
};

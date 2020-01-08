const Service = require('../models/service');
const Employee = require('../models/employee');
const validateService = require('../validation/serviceValidation');
const Id = require('valid-objectid');

exports.getAllServices = async (req, res) => {
  const service = await Service.find().sort('name');
  res.send(service);
};

exports.getServiceById = async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) return res.status(404).send('Nie znaleziono uslugi o danym ID');
  res.send(service);
};

exports.postAddService = async (req, res, next) => {
  const { error } = validateService(req.body);
  if (error) return res.status(400).send(error.message);

  let service = new Service({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    duration: req.body.duration
  });

  try {
    service = await service.save();
    res.send(service);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
};

exports.deleteService = async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) return res.status(404).send('Nie znaleziono uslugi o danym ID');
  res.send(service);
};

exports.updateService = async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      duration: req.body.duration
    },
    { new: true }
  );

  if (!service)
    return res.status(404).send('The service with the given ID was not found.');

  res.send(service);
};

exports.getEmployeesByServiceId = async (req, res, next) => {
  const serviceId = req.params.id;

  if (!Id.isValid(serviceId)) {
    res.status(422);
    return next(new Error('Invalid service ID'));
  }

  const employee = await Employee.find({ services: serviceId }).select({
    name: 1
  });
  res.status(200).send(employee);
};

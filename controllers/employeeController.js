const Employee = require('../models/employee');
const mongoose = require('mongoose');
const Service = require('../models/service');
const Appointment = require('../models/appointment');
const Id = require('valid-objectid');
const { validateEmployeeInput } = require('../validation/employeeValidation');

exports.getAllEmployees = async (req, res, next) => {
  const employee = await Employee.find().sort('name');
  res.send(employee);
};

exports.getEmployeeById = async (req, res, next) => {
  const employeeId = req.params.id;

  if (!Id.isValid(employeeId)) {
    res.status(422);
    return next(new Error('Invalid employee ID'));
  }

  const employee = await Employee.findById(req.params.id);

  if (!employee)
    return res.status(404).send('The employee with the given Id was not found');
  res.send(employee);
};

exports.postAddEmployee = async (req, res, next) => {
  req.body.services.forEach(element => {
    if (!Id.isValid(element)) {
      res.status(422).send('Nieprawidlowy ID usługi');
    }
  });

  const { error } = validateEmployeeInput(req.body);
  if (error) return res.status(400).send(error.message);

  let employee = new Employee({
    name: req.body.name,
    email: req.body.email,
    phone: req.body.phone,
    information: req.body.information,
    services: req.body.services,
    url: req.body.url
  });

  employee = await employee.save();
  res.send(employee);
};

exports.deleteEmployee = async (req, res, next) => {
  const employeeId = req.params.id;

  if (!Id.isValid(employeeId)) {
    res.status(422).send('Nieprawidłowy ID pracownika');
  }
  const employee = await Employee.findByIdAndDelete(req.params.id);

  if (!employee)
    return res.status(404).send('Nie znaleziono pracownika o tym ID.');
  res.send(employee);
};

exports.updateEmployee = async (req, res, next) => {
  const { error } = validateEmployeeInput(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      information: req.body.information,
      services: req.body.services,
      url: req.body.url
    },
    { new: true }
  );

  if (!employee)
    return res.status(404).send('Nie znaleziono pracownika o tym ID.');

  res.send(employee);
};

exports.addServiceToEmployee = async (req, res, next) => {
  const employeeId = req.body.employeeId;
  const serviceId = req.body.serviceId;

  if (!Id.isValid(employeeId)) {
    res.status(422);
    return next(new Error('Invalid employee ID'));
  } else if (!Id.isValid(serviceId)) {
    res.status(422);
    return next(new Error('Invalid service ID'));
  }

  const service = await Service.findById(serviceId);
  const employee = await Employee.findById(employeeId);

  if (!service) return res.status(404).send('Invalid service');
  else if (!employee) return res.status(404).send('Invalid employee');

  employee = await Employee.updateOne(
    { _id: employeeId },
    {
      $addToSet: {
        services: serviceId
      }
    }
  );
  res.send(employee);
};

exports.deleteServiceFromEmployee = async (req, res, next) => {
  const employeeId = req.body.employeeId;
  const serviceId = req.body.serviceId;

  if (!Id.isValid(employeeId)) {
    res.status(422);
    return next(new Error('Invalid employee ID'));
  } else if (!Id.isValid(serviceId)) {
    res.status(422);
    return next(new Error('Invalid service ID'));
  }

  const service = await Service.findById(employeeId);
  let employee = await Employee.findById(serviceId);

  if (!service) return res.status(404).send('Invalid service');
  else if (!employee) return res.status(404).send('Invalid employee');

  employee = await Employee.updateOne(
    { _id: employeeId },
    {
      services: serviceId
    },
    {
      $pull: {
        services: serviceId
      }
    }
  );
  res.status(200).send(employee);
};

exports.getAllEmployeeServices = async (req, res, next) => {
  const employeeId = req.params.id;

  if (!Id.isValid(employeeId)) {
    res.status(422);
    return next(new Error('Invalid employee ID'));
  }

  const employee = await Employee.findById(employeeId)
    .select({
      _id: 0,
      services: 1
    })
    .populate('services', 'name -_id');

  res.status(200).send(employee);
};

exports.getEmployeeFreeSlots = async (req, res, next) => {
  const { employeeID, serviceID } = req.params;

  const date = new Date(req.params.date);
  const dateToCompare = date;
  const today = new Date();

  console.log(today);

  if (!Id.isValid(employeeID)) {
    res.status(422).send('Nieprawidlowy ID pracownika');
  }

  if (!Id.isValid(serviceID)) {
    res.status(422).send('Nieprawidlowy ID usługi');
  }

  const service = await Service.findById(serviceID).select({ duration: 1 });

  const slots = await Appointment.find({
    $and: [{ employee: employeeID }, { date: date }]
  });
  let allSlots = [];

  slots.forEach(element => {
    allSlots = allSlots.concat(element.slot);
  });
  allSlots = allSlots.sort((a, b) => {
    return a - b;
  });

  let freeSlots = returnFreeSlots(allSlots, service.duration, date.getDay());

  console.log(freeSlots);
  if (freeSlots.length === 0) {
    res.status(404).send('Brak wolnych terminów w tym dniu');
  } else res.send(freeSlots);
};

removeOutDatedSlots = (freeSlots, today, dateToCompare) => {
  let slotsToRemove = [];

  freeSlots.forEach(element => {
    dateToCompare.setHours(getHourFromSlot(element));
    dateToCompare.setMinutes(getMinutesFromSlot(element));

    if (today > dateToCompare) {
      slotsToRemove.push(element);
    }
  });

  for (let i = 0; i < slotsToRemove.length; i++) {
    for (let j = 0; j < freeSlots.length; i++) {
      if (slotsToRemove[i] === freeSlots[j]) {
        freeSlots.splice(j, 1);
      }
    }
  }
  return freeSlots;
};

getHourFromSlot = slot => {
  if (slot % 2 === 1) {
    return Math.floor(slot / 2) + 10;
  }
  return Math.floor(slot / 2) + 9;
};
getMinutesFromSlot = slot => {
  if (slot % 2 === 1) {
    return 0;
  }
  return 30;
};

mapSlotsToHour = slot => {
  if (slot % 2 === 1) {
    return `${Math.floor(slot / 2) + 9}:00`;
  }
  return `${Math.floor(slot / 2) + 8}:30`;
};

exports.getAllEmployeeAppointments = async (req, res, next) => {
  const employeeID = req.params.id;

  const date = new Date(req.params.date);

  if (!Id.isValid(employeeID)) {
    res.status(422).send('Nieprawidlowy ID pracownika');
  }
  try {
    const appointments = await Appointment.find({
      $and: [{ employee: employeeID }, { date: date }]
    })
      .populate('employee', 'name')
      .populate('service', ['name', 'price'])
      .populate('user', ['name', 'phone'])
      .sort('slot');

    if (!appointments)
      return res.status(404).send('Brak zaplanowanych wizyt na ten dzień');
    res.send(appointments);
  } catch (ex) {
    for (field in ex.errors) res.send(ex.errors[field].message);
  }
};
const maxSlotNumber = 16;
const maxSlotOnSaturday = 10;

const returnFreeSlots = (takenSlots, serviceDuration, weekDay) => {
  let freeSlots = [];
  if (weekDay === 0) {
    return freeSlots;
  }

  if (takenSlots.length === 0) {
    if (weekDay === 6) {
      for (let i = 0; i < maxSlotOnSaturday - serviceDuration + 1; i++) {
        freeSlots.push(i + 1);
      }
    } else {
      for (let i = 0; i < maxSlotNumber - serviceDuration + 1; i++) {
        freeSlots.push(i + 1);
      }
    }
  } else {
    if (takenSlots[1] - serviceDuration > 0) {
      for (let i = 1; i < takenSlots[1] - serviceDuration; i++) {
        freeSlots.push(i);
      }
    }
    for (let i = 0; i < takenSlots.length - 1; i++) {
      if (takenSlots[i + 1] - takenSlots[i] > serviceDuration) {
        //
        for (let j = 0; j < takenSlots[i + 1] - takenSlots[i] - 1; j++) {
          if (takenSlots[i] + j + 1 + serviceDuration <= takenSlots[i + 1]) {
            freeSlots.push(takenSlots[i] + j + 1);
          }
        }
      }
    }
    if (
      maxSlotOnSaturday - takenSlots[takenSlots.length - 1] > serviceDuration &&
      weekDay === 6
    ) {
      for (
        let i = takenSlots[takenSlots.length - 1];
        i < maxSlotOnSaturday - serviceDuration + 1;
        i++
      )
        freeSlots.push(i + 1);
    }
    if (
      maxSlotNumber - takenSlots[takenSlots.length - 1] > serviceDuration &&
      weekDay !== 6
    ) {
      for (
        let i = takenSlots[takenSlots.length - 1];
        i < maxSlotNumber - serviceDuration + 1;
        i++
      ) {
        freeSlots.push(i + 1);
      }
    }
  }
  return freeSlots;
};

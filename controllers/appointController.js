const Appointment = require('../models/appointment');
const Service = require('../models/service');
const Employee = require('../models/employee');
const Schedule = require('../models/schedule');
const User = require('../models/user');
const Id = require('valid-objectid');
const _ = require('lodash');
const mongoose = require('mongoose');
const { validateAppointmentInput } = require('../validation/appoinmentValidation')

const maxSlotNumber = 18;
const maxSlotAtSaturday = 10;

exports.postAddAppointment = async (req, res, next) => {
    const { error } = validateAppointmentInput(req.body);
    if (error) return res.status(400).send(error.message);

    const { employeeID, serviceID, userID, slot } = req.body;
    date = new Date(req.body.date);

    if(!Id.isValid(employeeID)) {
        res.status(422).send('Nieprawidlowy ID pracownika');
    }

    if(!Id.isValid(serviceID)) {
        res.status(422).send('Nieprawidlowy ID usługi');
    }
    
    if(!Id.isValid(userID)) {
        res.status(422).send('Nieprawidlowy ID użytkownika');
    }

    const employee = await Employee.findById(employeeID)
    if( !employee ) return res.status(404).send('Pracownik o podanym ID nie istnieje');

    const service = await Service.findById(serviceID)
    if( !service ) return res.status(404).send('Usługa o podanym ID nie istnieje');

    const slots = await Appointment.find({ $and: [
        { employee: employeeID },
        { date: date }
    ]})
        .select({ slot: 1 });

    let allSlots = [];

    slots.forEach(element => {
        allSlots = allSlots.concat(element.slot);   
    });

    slotsToSave = returnSlotArray(slot, service.duration);

    const isFree = checkSlotAvailablity(allSlots, slotsToSave, date.getDay());
    if(!isFree) {
        return res.status(409).send('Slot niedostępny')
    }

    let appointment = new Appointment({
        employee: req.body.employeeID,
        service: req.body.serviceID,
        user: req.body.userID,
        date: date,
        slot: slotsToSave
    })
    try {
        appointment = await appointment.save();
        res.send(appointment);
    }
    catch(ex) {
        for (field in ex.errors)
            res.send(ex.errors[field].message);
    }
}

exports.getAllUserAppointments = async (req, res, next) => {
    const userID  = req.params.userID;

    if(!Id.isValid(userID)) {
        res.status(422).send('Nieprawidlowy ID pracownika');
    }
    try {
        const appointments = await Appointment.find({ $and: [
            { user: userID },
        ]}) 
            .populate('employee', 'name')
            .populate('service', ['name', 'price'])
            .populate('user', ['name', 'phone'])
            .sort('date slot')
            
        if (!appointments) return res.status(404).send('Brak zaplanowanych wizyt');
            res.send(appointments);      
    } catch(ex) {
        for (field in ex.errors)
            res.send(ex.errors[field].message);
    }
}

exports.createAppointmentByAdmin = async (req, res, next) => {
    const { employeeID, serviceID, slot, name, phone } = req.body;
    date = new Date(req.body.date);

    if(!Id.isValid(employeeID)) {
        res.status(422).send('Nieprawidlowy ID pracownika');
    }

    if(!Id.isValid(serviceID)) {
        res.status(422).send('Nieprawidlowy ID usługi');
    }

    const slots = await Appointment.find({ $and: [
        { employee: employeeID },
        { date: date }
    ]})
        .select({ slot: 1 });

    let allSlots = [];

    slots.forEach(element => {
        allSlots = allSlots.concat(element.slot);   
    });

    slotsToSave = returnSlotArray(slot, service.duration);

    const isFree = checkSlotAvailablity(allSlots, slotsToSave, date.getDay());
    if(!isFree) {
        return res.status(409).send('Slot niedostępny')
    }

    let appointment = new Appointment({
        employee: req.body.employeeID,
        service: req.body.serviceID,
        date: date,
        slot: slotsToSave,
        guestName: name,
        guestPhone: phone
    })
    try {
        appointment = await appointment.save();
        res.send(appointment);
    }
    catch(ex) {
        for (field in ex.errors)
            res.send(ex.errors[field].message);
    }
}

exports.deleteAppointment = async (req, res, next) => {
    const appointID = req.params.appointID;

    if (!Id.isValid(appointID)) {
        res.status(422).send('Nieprawidłowe ID wizyty');
    }
    const appointment = await Appointment.findByIdAndDelete(appointID);

    if(!appointment) return res.status(404).send('Nie znaleziono wizyty o tym ID.');
    res.send(appointment);
}

const returnSlotArray = (slot, serviceDuration) => {
    let slotsToSave = [];
    slotsToSave.push(slot);
    if (serviceDuration === 1) {
        return slotsToSave;
    } 
    else {
        for(let i = 1; i < serviceDuration; i++ ) {
            slotsToSave.push(slot + i);
        }
        return slotsToSave;
    }
}

const checkSlotAvailablity = (allSlots, slotsToSave, weekDay) => {
    let found;
    if(allSlots.length == 0 ) {
        found = true;
        return found;
    }
    else {
        found = allSlots.some(element => slotsToSave.indexOf(element) !== -1);
        if (found) {
            return false;
        } 
        if (slotsToSave[slotsToSave.length - 1] > maxSlotNumber){
            return false;
        } 
        if (weekDay === 6 && slotsToSave[slotsToSave.length - 1] > maxSlotAtSaturday) {
            return false;
        }
    }
    return true;
}


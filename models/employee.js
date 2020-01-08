const mongoose = require('mongoose');
const {servicesSchema} = require('./service');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlength: 5,
        maxlength: 50
    },
    services: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
    }],
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        match: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/,
        unique: true
    },
    phone: {
        type: String,
        required: true,
        match: /^(?:\(?\+?48)?(?:[-\.\(\)\s]*(\d)){9}\)?$/
    },
    information: {
        type: String,
        minlength: 5,
        maxlength: 512
    }, 
    imageURL: {
        type: String
    }
})

module.exports = mongoose.model('Employee', employeeSchema);


Employee = mongoose.model('Employee', employeeSchema);
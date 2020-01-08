const mongoose = require('mongoose');
var DateOnly = require('mongoose-dateonly')(mongoose);

const appointmentSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true
    },
    slot: [{
        type: Number,
        required: true
    }],
    guestName: {
        type: String
    },
    guestPhone: {
        type: String
    }
})
module.exports = mongoose.model('Appointment', appointmentSchema);
const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true,
    },
    year: {
        type: Number,
        min: 2018,
        max: 2020,
        required: true
    },
    month: {
        type: Number,
        min: 1,
        max: 12,
        required: true
    },
    day: {
        type: Number,
        min: 1,
        max: 31,
        required: true
    },
    slot: {
        type: Number,
        min: 1,
        max: 16,
        required: true
    }

})

module.exports = mongoose.model('Schedule', scheduleSchema);
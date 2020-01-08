const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true, 
        minlengthe: 5,
        maxlength: 50
    },
    description: {
        type: String,
        minlegth: 5,
        maxlength: 250
    },
    price: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    }
})

module.exports = mongoose.model('Service', serviceSchema);
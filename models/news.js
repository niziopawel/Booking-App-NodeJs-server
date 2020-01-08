const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema({
    title: {
        type: String,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    description: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 256
    },
    url: {
        type: String,
        required: true
    },
    date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('News', newsSchema);
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');

    mongoose.set('useCreateIndex', true);
    mongoose.connect(db,{ useNewUrlParser: true })
        .then(() => console.log('Connected to database'))
        .catch(err => console.error('Could not connect to MongoDB...'));
}
const errorHandler = require('../middleware/error');
const express = require('express');
const service = require('../routes/serviceRoutes');
const employee = require('../routes/employeeRoutes');
const users = require('../routes/userRoutes');
const auth = require('../routes/authRoutes');
const appointments = require('../routes/appointRoutes');
const news = require('../routes/newsRoutes');

module.exports = function(app) {
    app.use(express.json());
    app.use('/api/services',service);
    app.use('/api/employees', employee);
    app.use('/api/users', users);
    app.use('/api/auth', auth);
    app.use('/api/appointments', appointments);
    app.use('/api/news', news)
    app.use(errorHandler);
}
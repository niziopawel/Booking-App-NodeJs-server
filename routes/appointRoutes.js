const express = require('express');
const router = express.Router();

const appointController = require('../controllers/appointController');

router.post('/', appointController.postAddAppointment);

router.post('/admin', appointController.createAppointmentByAdmin);

router.delete('/:appointID', appointController.deleteAppointment);

router.get('/user/:userID', appointController.getAllUserAppointments);

module.exports = router;

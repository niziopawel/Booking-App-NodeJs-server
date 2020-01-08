const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');

router.get('/', employeeController.getAllEmployees);

router.post('/', [auth, admin], employeeController.postAddEmployee);

router.delete('/:id', [auth, admin], employeeController.deleteEmployee);

router.put('/:id', [auth, admin], employeeController.updateEmployee);

router.delete(
  '/delete-service',
  [auth, admin],
  employeeController.deleteServiceFromEmployee
);

router.post(
  '/add-service',
  [auth, admin],
  employeeController.addServiceToEmployee
);

router.get(
  '/:employeeID/availability/service/:serviceID/:date',
  employeeController.getEmployeeFreeSlots
);

router.get('/:id/:date', employeeController.getAllEmployeeAppointments);

module.exports = router;

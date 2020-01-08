const path =require('path');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

const serviceController = require('../controllers/serviceController');

router.get('/', serviceController.getAllServices);

router.post('/add-service', [auth, admin], serviceController.postAddService);

router.delete('/:id', [auth, admin], serviceController.deleteService);

router.get('/:id', [auth, admin], serviceController.getServiceById);

router.put('/:id', [auth, admin], serviceController.updateService);

router.get('/:id/employees', serviceController.getEmployeesByServiceId);

module.exports = router;
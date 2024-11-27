const express = require('express');
const router = express.Router();
const CustomerController = require('../controllers/customer.controller');

router.get('/name', CustomerController.findCustomerByName);
router.post('/', CustomerController.createCustomer);
router.get('/', CustomerController.listCustomers);

module.exports = router;

const CustomerService = require('../services/customer.service');

exports.findCustomerByName = async (req, res, next) => {
    const { name } = req.query;
    const customer = await CustomerService.findByName(name);
    req.responseData = {
        status: 200,
        message: 'Find customer successfully',
        data: customer
    }
    next()
}

exports.findCustomerByPhoneNumber = async (req, res, next) => {
    const { phoneNumber } = req.query;
    const customer = await CustomerService.findByPhoneNumber(phoneNumber);
    req.responseData = {
        status: 200,
        message: 'Find customer successfully',
        data: customer
    }
    next()
}

exports.createCustomer = async (req, res, next) => {
    const userInfo = req.body;
    const newCustomer = await CustomerService.saveUser(userInfo);
    req.responseData = {
        status: 201,
        message: 'Create customer successfully',
        data: newCustomer
    }
    next()
}

exports.listCustomers = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const customerName = req.query.customerName
    const customers = await CustomerService.listCustomers(Number(page), Number(limit), customerName);
    req.responseData = {
        status: 200,
        message: 'Get list customer successfully',
        data: customers
    }
    next()
}

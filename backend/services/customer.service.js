const Customer = require('../models/Customer');
const CustomError = require('../errors/CustomError')

exports.findByName = async (name) => {
    return await Customer.findByName(name);
}

exports.findByPhoneNumber = async(phoneNumber) => {
    return await Customer.findByPhoneNumber(phoneNumber)
}

exports.saveUser = async (userInfo) => {
    try {
        return await Customer.saveUser(userInfo);
    } catch (error) {
        throw new CustomError(error.message);
    }
}

exports.listCustomers = async (page, limit, customerName) => {
    const query = {}

    if(customerName) {
        query.name = { $regex: customerName, $options: "i"}
    }
    const customerList = await Customer.find(query)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .catch((err) => {
            throw new CustomError(err.message)
        });
    const totalCustomer = await Customer.countDocuments();

    return {
        customerList,
        currentPage: page,
        totalPages: Math.ceil(totalCustomer / limit),
        totalCustomer,
    };
}

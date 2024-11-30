var mongoose = require('mongoose');

const Customer = mongoose.model('Customer')
const Account = mongoose.model('Account')
const ProductTransaction = mongoose.model('ProductTransaction')
const Product = mongoose.model('Product')
const Transaction = mongoose.model('Transaction')
const Variant = mongoose.model('Variant')

module.exports = { Customer, Account, ProductTransaction, 
                    Product, Transaction, Variant }
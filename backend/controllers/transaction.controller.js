const TransactionService = require('../services/transaction.service')
// const formatResponse = require('../middlewares/formatResponse')

exports.processTransaction = async (req, res, next) => {
    const { staffId, phoneNumber, transactionInfo, amountPaid } = req.body;
    console.log(req.body)
    const transaction = await TransactionService.processTransaction(staffId, phoneNumber, transactionInfo, amountPaid);

    req.responseData = {
        status: 201,
        message: 'Processing transaction successfully',
        data: transaction,
    };
    next()
}
exports.listTransactions = async (req, res, next) => {
    const { page = 1, limit = 10 } = req.query;
    const transactions = await TransactionService.listTransactions(Number(page), Number(limit));
    req.responseData = {
        status: 200,
        message: 'Get list transactions successfully',
        data: transactions
    }
    next()
}

exports.listTransactionsByStaff = async (req, res, next) => {
    const staffId = req.params.staffId
    const { page = 1, limit = 10 } = req.query;
    const transactions = await TransactionService.listTransactionsByStaff(staffId, Number(page), Number(limit));
    req.responseData = {
        status: 200,
        message: `Get list transactions of staff ${staffId} successfully`,
        data: transactions
    }
    next()
}

exports.listTransactionsByCustomer = async (req, res, next) => {
    const customerId = req.params.customerId
    const { page = 1, limit = 10 } = req.query;
    const transactions = await TransactionService.listTransactionsByCustomer(customerId, Number(page), Number(limit));
    req.responseData = {
        status: 200,
        message: `Get list transactions of customer ${customerId} successfully`,
        data: transactions
    }
    next()
}
exports.createTransaction = async (req, res, next) => {
    const { staffId, customerId, transactionInfo } = req.body

    const newTransaction = await TransactionService.createTransaction(staffId, customerId, transactionInfo);
    req.responseData = {
        status: 201,
        message: 'Create transaction successfully',
        data: newTransaction,
    };
    next()
}

exports.getTransactionById = async (req, res, next) => {
    const transactionId = req.params.id;
    const transaction = await TransactionService.getTransactionById(transactionId);
    req.responseData = {
        status: 200,
        message: `Get product ${transactionId} successfully`,
        data: transaction,
    };
    next()
}

exports.createProductTransaction = async (req, res, next) => {
    const transactionId = req.params.id;
    const { variantId, productTransactionInfo } = req.body;

    const transaction = await TransactionService.addProductToTransaction(transactionId, variantId, productTransactionInfo);
    req.responseData = {
        status: 201,
        message: `add product ${variantId} to ${transactionId} successfully`,
        data: transaction,
    };
    next()
}

exports.removeFromTransaction = async (req, res, next) => {
    const productTransactionId = req.params.productTransactionId;

    await TransactionService.removeFromTransaction(productTransactionId);
    req.responseData = {
        status: 200,
        message: `delete ${productTransactionId} success`,
    };
    next()
}

exports.confirmTransaction = async (req, res, next) => {
    const transactionId = req.params.id;
    const amountPaid = req.body.amountPaid;
    const transaction = await TransactionService.confirmTransaction(transactionId, amountPaid);
    req.responseData = {
        status: 201,
        message: `update ${transactionId} success`,
        data: transaction
    };
    next()
}

exports.updateProductTransaction = async (req, res, next) => {
    const productTransactionId = req.params.productTransactionId;
    const quantity = req.body.quantity;
    const productTransaction = await TransactionService.updateProductTransaction(productTransactionId, quantity);
    req.responseData = {
        status: 201,
        message: `update ${productTransactionId} success`,
        data: productTransaction
    };
    next()
}
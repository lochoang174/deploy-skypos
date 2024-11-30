const express = require('express')
const router = express.Router();
const TransactionController = require('../controllers/transaction.controller')

router.get('/', TransactionController.listTransactions)

// router.post('/', TransactionController.createTransaction)
router.post('/transactionProcessing', TransactionController.processTransaction)
router.get('/:id', TransactionController.getTransactionById)
router.get('/customer/:customerId', TransactionController.listTransactionsByCustomer)
router.get('/staff/:staffId', TransactionController.listTransactionsByStaff)

router.post('/:id/add', TransactionController.createProductTransaction)
// router.put('/:id/confirm', TransactionController.confirmTransaction)
router.put('/:productTransactionId/update', TransactionController.updateProductTransaction)
router.delete('/removeProduct/:productTransactionId', TransactionController.removeFromTransaction)

module.exports = router
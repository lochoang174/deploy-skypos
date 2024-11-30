const express = require('express')
const router = express.Router();
const StatisticsController = require('../controllers/statistics.controller')

router.get('/today', StatisticsController.getTransactionToday)
router.get('/yesterday', StatisticsController.getTransactionYesterday)
router.get('/within-7-days', StatisticsController.getTransactionWithinTheLast7Days)
router.get('/this-month', StatisticsController.getTransactionThisMonth);
router.get('/date-range', StatisticsController.getTransactionByDateRange);
router.get('/transactions-of-date', StatisticsController.getTransactionsByDate)
module.exports = router

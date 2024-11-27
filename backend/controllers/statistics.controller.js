const StatisticsService = require('../services/statistics.service');
// role=1 is seller, cannot watch the profit
exports.getTransactionToday = async (req, res, next) => {
    const transactions = await StatisticsService.getTransactionToday();
    if (req.user.role === 1) {
        delete transactions.profit;
    }
    req.responseData = {
        status: 200,
        message: 'Get transactions today successfully',
        data: transactions,
    };
    next()
}

exports.getTransactionYesterday = async (req, res, next) => {
    const transactions = await StatisticsService.getTransactionYesterday();
    if (req.user.role === 1) {
        delete transactions.profit;
    }
    req.responseData = {
        status: 200,
        message: 'Get transactions yesterday successfully',
        data: transactions,
    };
    next()
}

exports.getTransactionWithinTheLast7Days = async (req, res, next) => {
    const transactions = await StatisticsService.getTransactionWithinTheLast7Days();
    if (req.user.role === 1) {
        delete transactions.profit;
    }
    req.responseData = {
        status: 200,
        message: 'Get transactions of 7 days ago successfully',
        data: transactions,
    };
    next()
}

exports.getTransactionByDateRange = async (req, res, next) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({
            status: 400,
            message: 'Missing query params',
        });
    }

    const transactions = await StatisticsService.getTransactionByDateRange(startDate, endDate);
    if (req.user.role === 1) {
        delete transactions.profit;
    }
    req.responseData = {
        status: 200,
        message: 'Get transactions for date range successfully',
        data: transactions,
    };
    next();
};


exports.getTransactionThisMonth = async (req, res, next) => {
    const transactions = await StatisticsService.getTransactionThisMonth();
    if (req.user.role === 1) {
        delete transactions.profit;
    }
    req.responseData = {
        status: 200,
        message: 'Get transactions for this month successfully',
        data: transactions,
    };
    next();
};

exports.getTransactionsByDate = async (req, res, next) => {

    const { date } = req.query;
    if (!date) {
        throw new CustomError("Date parameter is required");
    }

    const transactions = await StatisticsService.getTransactionsByDate(date);

    req.responseData = {
        status: 200,
        message: `Get transactions for ${date} successfully`,
        data: transactions,
    };
    next()
};
// getTransactionsByDate
const TransactionModel = require('../models/Transaction')
// const formatResponse = require('../middlewares/formatResponse')
const { Customer, Account, Transaction, ProductTransaction, Variant } = require('../models/Instance.model')
const ProductTransactionModel = require('../models/ProductTransaction')
const VariantModel = require('../models/Variant')
const CustomError = require('../errors/CustomError')
// const { populate } = require('../models/Account')

// convert to vietnam timezone
function convertDateTime(date) {
    return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));

}

async function getDetailsOfReports(transactions) {
    let totalAmountReceived = 0;
    let numberOfOrders = transactions.length;
    let numberOfProductsSold = 0;
    let profit = 0;
    let listOfOrders = [];
    let dailySummary = {};

    for (const transaction of transactions) {
        const transactionInfo = await TransactionModel.findById(transaction._id)
            .populate('Customer', 'name')
            .populate('Staff', 'name');

        totalAmountReceived += transactionInfo.amountPaid;

        const purchaseDate = convertDateTime(transactionInfo.purchaseDate).toISOString().split('T')[0];
        // purchaseDate = convertDateTime(purchaseDate)
        if (!dailySummary[purchaseDate]) {
            dailySummary[purchaseDate] = { numOfProduct: 0, numOfTransaction: 0 };
        }
        dailySummary[purchaseDate].numOfTransaction += 1;

        const productTransactions = await ProductTransactionModel.find({ Transaction: transaction._id }).populate('Variant');
        
        for (const productTransaction of productTransactions) {
            const variant = productTransaction.Variant;
            const quantity = productTransaction.quantity;
            
            numberOfProductsSold += quantity;
            profit += (quantity * variant.retailPrice) - (quantity * variant.importPrice);

            dailySummary[purchaseDate].numOfProduct += quantity;
        }

        listOfOrders.push({
            transactionId: transactionInfo._id,
            customer: transactionInfo.Customer.name,
            staff: transactionInfo.Staff.name,
            purchaseDate: transactionInfo.purchaseDate,
            totalAmount: transactionInfo.totalAmount,
            amountPaid: transactionInfo.amountPaid,
            refund: transactionInfo.refund
        });
    }

    listOfOrders.sort((a, b) => new Date(a.purchaseDate) - new Date(b.purchaseDate));

    const detail = Object.entries(dailySummary).map(([date, { numOfProduct, numOfTransaction }]) => ({
        date,
        numOfProduct,
        numOfTransaction
    }));

    const result = {
        totalAmountReceived,
        numberOfOrders,
        numberOfProductsSold,
        profit,
        detail
    };

    return result;
}

exports.getTransactionToday = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];

        const transactions = await TransactionModel.find({
            purchaseDate: {
                $gte: new Date(`${today}T00:00:00.000Z`),
                $lte: new Date(`${today}T23:59:59.999Z`)
            }
        }).populate('Customer', 'name')
          .populate('Staff', 'name')
          .lean();

        const reports = await getDetailsOfReports(transactions);

        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionYesterday = async () => {
    try {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const date = yesterday.toISOString().split('T')[0]; // YYYY-MM-DD

        const startOfYesterday = new Date(`${date}T00:00:00.000Z`);
        const endOfYesterday = new Date(`${date}T23:59:59.999Z`);

        console.log('Start of Yesterday:', startOfYesterday.toISOString());
        console.log('End of Yesterday:', endOfYesterday.toISOString());

        const transactions = await TransactionModel.find({
            purchaseDate: {
                $gte: startOfYesterday,
                $lte: endOfYesterday
            }
        }).populate('Customer', 'name')
          .populate('Staff', 'name')
          .lean();

        const reports = await getDetailsOfReports(transactions);

        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};


exports.getTransactionWithinTheLast7Days = async () => {
    try {
        const today = new Date();
        const dateToday = today.toISOString().split('T')[0];

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const date7DaysAgo = sevenDaysAgo.toISOString().split('T')[0];

        const startOf7DaysAgo = new Date(`${date7DaysAgo}T00:00:00.000Z`);
        const endOfToday = new Date(`${dateToday}T23:59:59.999Z`);

        console.log('Start of Last 7 Days:', startOf7DaysAgo.toISOString());
        console.log('End of Today:', endOfToday.toISOString());

        const transactions = await TransactionModel.find({
            purchaseDate: {
                $gte: startOf7DaysAgo,
                $lte: endOfToday
            }
        }).populate('Customer', 'name')
          .populate('Staff', 'name')
          .lean();

        const reports = await getDetailsOfReports(transactions);

        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionThisMonth = async () => {
    try {
        const today = new Date();
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1); // Ngày đầu tháng
        const dateToday = today.toISOString().split('T')[0]; // YYYY-MM-DD

        const startOfThisMonth = new Date(`${startOfMonth.toISOString().split('T')[0]}T00:00:00.000Z`);
        const endOfToday = new Date(`${dateToday}T23:59:59.999Z`);

        console.log('Start of This Month:', startOfThisMonth.toISOString());
        console.log('End of Today:', endOfToday.toISOString());

        const transactions = await TransactionModel.find({
            purchaseDate: {
                $gte: startOfThisMonth,
                $lte: endOfToday
            }
        }).populate('Customer', 'name')
          .populate('Staff', 'name')
          .lean();

        const reports = await getDetailsOfReports(transactions);

        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionByDateRange = async (startDate, endDate) => {
    try {
        const start = new Date(startDate).toISOString().split('T')[0]; // YYYY-MM-DD
        const end = new Date(endDate).toISOString().split('T')[0]; // YYYY-MM-DD

        const startOfRange = new Date(`${start}T00:00:00.000Z`);
        const endOfRange = new Date(`${end}T23:59:59.999Z`);

        console.log('Start Date:', startOfRange.toISOString());
        console.log('End Date:', endOfRange.toISOString());

        const transactions = await TransactionModel.find({
            purchaseDate: {
                $gte: startOfRange,
                $lte: endOfRange
            }
        }).populate('Customer', 'name')
          .populate('Staff', 'name')
          .lean();

        const reports = await getDetailsOfReports(transactions);

        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};


exports.getTransactionsByDate = async (date) => {
    try {
        const vietnamDate = convertDateTime(new Date(date));

        const startOfDay = new Date(vietnamDate);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(vietnamDate);
        endOfDay.setHours(23, 59, 59, 999);

        console.log('Start of Day:', startOfDay.toISOString());
        console.log('End of Day:', endOfDay.toISOString());

        const transactions = await TransactionModel.find({
            purchaseDate: { $gte: startOfDay, $lte: endOfDay }
        }).populate('Customer', 'name')
          .populate('Staff', 'name')
          .lean();

        for (const transaction of transactions) {
            const productTransactions = await ProductTransactionModel.find({ Transaction: transaction._id }).populate('Variant');

            transaction.numOfProductsSold = productTransactions.reduce((sum, pt) => sum + pt.quantity, 0);
        }

        return transactions;
    } catch (err) {
        return new CustomError(err.message);
    }
};


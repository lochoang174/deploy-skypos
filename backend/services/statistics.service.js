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
        const vietnamToday = convertDateTime(new Date());

        const startOfToday = new Date(vietnamToday);
        startOfToday.setHours(0, 0, 0, 0);

        const endOfToday = new Date(vietnamToday);

        console.log('Start of Today:', startOfToday.toISOString());
        console.log('End of Today:', endOfToday.toISOString());

        const transactions = await TransactionModel.find({
            purchaseDate: {
                $gte: startOfToday,
                $lte: endOfToday
            }
        });

        const reports = await getDetailsOfReports(transactions);
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionYesterday = async () => {
    try {
        const vietnamToday = convertDateTime(new Date());

        const startOfYesterday = new Date(vietnamToday);
        startOfYesterday.setDate(vietnamToday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);

        const endOfYesterday = new Date(vietnamToday);
        endOfYesterday.setDate(vietnamToday.getDate() - 1);
        endOfYesterday.setHours(23, 59, 59, 999);

        console.log('Start of Yesterday:', startOfYesterday.toISOString());
        console.log('End of Yesterday:', endOfYesterday.toISOString());

        const transactions = await TransactionModel.findTransactionsByDateRange(startOfYesterday, endOfYesterday);
        const reports = await getDetailsOfReports(transactions);
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionWithinTheLast7Days = async () => {
    try {
        const vietnamToday = convertDateTime(new Date());

        const startOf7DaysAgo = new Date(vietnamToday);
        startOf7DaysAgo.setDate(vietnamToday.getDate() - 7);
        startOf7DaysAgo.setHours(0, 0, 0, 0);

        const endOfToday = new Date(vietnamToday);

        console.log('Start of Last 7 Days:', startOf7DaysAgo.toISOString());
        console.log('End of Today:', endOfToday.toISOString());

        const transactions = await TransactionModel.findTransactionsByDateRange(startOf7DaysAgo, endOfToday);
        const reports = await getDetailsOfReports(transactions);
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};


exports.getTransactionThisMonth = async () => {
    try {
        const vietnamToday = convertDateTime(new Date());

        const startOfMonth = new Date(vietnamToday.getFullYear(), vietnamToday.getMonth(), 1);
        startOfMonth.setHours(0, 0, 0, 0);

        const endOfToday = new Date(vietnamToday);

        console.log('Start of Month:', startOfMonth.toISOString());
        console.log('End of Today:', endOfToday.toISOString());

        const transactions = await TransactionModel.findTransactionsByDateRange(startOfMonth, endOfToday);
        const reports = await getDetailsOfReports(transactions);
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};


exports.getTransactionByDateRange = async (startDate, endDate) => {
    try {
        const start = convertDateTime(new Date(startDate));
        const end = convertDateTime(new Date(endDate));

        start.setHours(0, 0, 0, 0);

        end.setHours(23, 59, 59, 999);

        console.log('Start Date:', start.toISOString());
        console.log('End Date:', end.toISOString());

        const transactions = await TransactionModel.findTransactionsByDateRange(start, end);
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


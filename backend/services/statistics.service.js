const TransactionModel = require('../models/Transaction')
// const formatResponse = require('../middlewares/formatResponse')
const { Customer, Account, Transaction, ProductTransaction, Variant } = require('../models/Instance.model')
const ProductTransactionModel = require('../models/ProductTransaction')
const VariantModel = require('../models/Variant')
const CustomError = require('../errors/CustomError')
// const { populate } = require('../models/Account')

// convert to vietnam timezone
function convertDateTime(date) {
    const getTime = date.getTime();
    const vietnamTimeZone = 7 * 60 * 60 * 1000; // UTC+7 

    const vietnamTime = new Date(getTime + vietnamTimeZone);
    return vietnamTime;
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
        const today = convertDateTime(new Date());
        const yesterday = new Date(today);
        // setup time
        yesterday.setDate(today.getDate() - 1);
        yesterday.setHours(17, 0, 0, 0);
        today.setHours(16, 59, 59, 999);

        const transactions = await TransactionModel.findTransactionsByDateRange(yesterday, today);
        const reports = await getDetailsOfReports(transactions)
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionYesterday = async () => {
    try {
        const vietnamToday = convertDateTime(new Date());  

        const yesterday = new Date(vietnamToday);
        const beforeYesterday = new Date(vietnamToday);

        yesterday.setDate(yesterday.getDate() - 1);
        beforeYesterday.setDate(yesterday.getDate() - 1);

        yesterday.setUTCHours(16, 59, 59, 999); 
        beforeYesterday.setUTCHours(17, 0, 0, 0); 

        console.log('Before Yesterday:', beforeYesterday.toISOString());
        console.log('Yesterday:', yesterday.toISOString());

        const transactions = await TransactionModel.findTransactionsByDateRange(beforeYesterday, yesterday);
        console.log('Transactions:', transactions);

        const reports = await getDetailsOfReports(transactions);
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionWithinTheLast7Days = async () => {
    try {
        const today = convertDateTime(new Date());
        const aWeekAgo = new Date(today);
        // setup time
        aWeekAgo.setDate(aWeekAgo.getDate() - 7);
        aWeekAgo.setUTCHours(17, 0, 0, 0);
        today.setUTCHours(16, 59, 59, 999);

        const transactions = await TransactionModel.findTransactionsByDateRange(aWeekAgo, today);
        const reports = await getDetailsOfReports(transactions)
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionByDateRange = async (startDate, endDate) => {
    try {
        const start = convertDateTime(new Date(startDate));
        const end = convertDateTime(new Date(endDate));
        
        start.setUTCHours(17, 0, 0, 0); 
        end.setUTCHours(16, 59, 59, 999);
        
        const transactions = await TransactionModel.findTransactionsByDateRange(start, end);
        const reports = await getDetailsOfReports(transactions);
        
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionThisMonth = async () => {
    try {
        const today = convertDateTime(new Date());
        
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        startOfMonth.setUTCHours(17, 0, 0, 0);

        today.setUTCHours(16, 59, 59, 999);

        const transactions = await TransactionModel.findTransactionsByDateRange(startOfMonth, today);

        const reports = await getDetailsOfReports(transactions);
        return reports;
    } catch (err) {
        return new CustomError(err.message);
    }
};

exports.getTransactionsByDate = async (date) => {
    const vietnamDate = convertDateTime(new Date(date));
    const startOfDay = new Date(vietnamDate);
    startOfDay.setUTCHours(17, 0, 0, 0);
    startOfDay.setUTCDate(startOfDay.getUTCDate() - 1);
    const endOfDay = new Date(vietnamDate);
    endOfDay.setUTCHours(16, 59, 59, 999);
    console.log(startOfDay)
    console.log(endOfDay)

    const transactions = await TransactionModel.find({
        purchaseDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('Customer', 'name')
      .populate('Staff', 'name')
      .lean();
    console.log(transactions)
    for (const transaction of transactions) {
        const productTransactions = await ProductTransactionModel.find({ Transaction: transaction._id }).populate('Variant');

        transaction.numOfProductsSold = productTransactions.reduce((sum, pt) => sum + pt.quantity, 0);
    }

    return transactions;
}

const TransactionModel = require('../models/Transaction')
// const formatResponse = require('../middlewares/formatResponse')
const { Customer, Account, Transaction, ProductTransaction, Variant } = require('../models/Instance.model')
const ProductTransactionModel = require('../models/ProductTransaction')
const VariantModel = require('../models/Variant')
const CustomError = require('../errors/CustomError')
// const { populate } = require('../models/Account')
const moment = require('moment');

function formatDate(isoDate) {
    return moment(isoDate).format('HH:mm:ss DD-MM-YYYY');
}

exports.processTransaction = async (staffId, phoneNumber, transactionInfo, amountPaid) => {
    try {
        console.log(transactionInfo);
        let customer = await Customer.findOne({ phoneNumber });
        
        if (!customer) {
            if (!transactionInfo.customerName || !transactionInfo.customerAddress || !transactionInfo.customerEmail) {
                throw new CustomError('Customer information is incomplete for a new customer.');
            }
            customer = new Customer({
                phoneNumber: phoneNumber,
                name: transactionInfo.customerName,
                address: transactionInfo.customerAddress,
                email: transactionInfo.customerEmail
            });
            await customer.save();
        }

        const staffExists = await Account.exists({ _id: staffId });
        if (!staffExists) {
            throw new CustomError('Staff not found');
        }

        transactionInfo.Customer = customer._id;
        transactionInfo.Staff = staffId;

        let purchaseDate = new Date();
        purchaseDate.setHours(purchaseDate.getHours() + 7);
        transactionInfo.purchaseDate = purchaseDate;
        
        transactionInfo.dueTo = new Date();
        transactionInfo.refund = 0;
        transactionInfo.status = "PENDING";
        transactionInfo.totalAmount = 0;
        transactionInfo.amountPaid = 0;

        const newTransaction = new TransactionModel(transactionInfo);
        await newTransaction.save();

        const productTransactions = transactionInfo.productTransactions;

        for (const productTransactionInfo of productTransactions) {
            const variantExists = await Variant.findById(productTransactionInfo.variantId);
            if (!variantExists) {
                throw new CustomError('Variant not found');
            }
            if (variantExists.quantityInStock < productTransactionInfo.quantity) {
                throw new CustomError('The quantity of product is not enough');
            }

            const totalPrice = productTransactionInfo.quantity * variantExists.retailPrice;

            const productTransaction = new ProductTransactionModel({
                ...productTransactionInfo,
                total: totalPrice,
                Variant: productTransactionInfo.variantId,
                Transaction: newTransaction._id
            });
            await productTransaction.save();

            await VariantModel.incrementQuantitySold(variantExists._id, productTransactionInfo.quantity);
            await TransactionModel.incrementTotalAmount(newTransaction._id, totalPrice);
        }

        const updatedTransaction = await TransactionModel.findById(newTransaction._id);
        console.log(updatedTransaction);

        if (amountPaid < 0) {
            throw new CustomError('Amount paid must be positive');
        }

        if (amountPaid < updatedTransaction.totalAmount) {
            throw new CustomError('Amount paid must be greater than or equal to total amount');
        }

        updatedTransaction.refund = amountPaid - updatedTransaction.totalAmount;
        console.log(amountPaid);
        console.log(updatedTransaction.totalAmount);
        console.log(updatedTransaction.refund);
        
        updatedTransaction.amountPaid = amountPaid;
        updatedTransaction.status = "PAID";
        
        let updatedPurchaseDate = new Date();
        updatedPurchaseDate.setHours(updatedPurchaseDate.getHours() + 7); 
        updatedTransaction.purchaseDate = updatedPurchaseDate;
        
        await updatedTransaction.save();

        return updatedTransaction;
    } catch (err) {
        throw new CustomError(err.message);
    }
};

// list transaction
exports.listTransactions = async (page, limit) => {
    try {
        const transactions = await TransactionModel.find()
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('Customer', 'name')  
            .populate('Staff', 'name')     
            .lean(); 

        const totalTransactions = await TransactionModel.countDocuments();

        return {
            transactionList: transactions.map(transaction => ({
                transactionId: transaction._id,
                totalAmount: transaction.totalAmount,
                purchaseDate: formatDate(transaction.purchaseDate),
                customerName: transaction.Customer ? transaction.Customer.name : 'Unknown',
                staffName: transaction.Staff ? transaction.Staff.name : 'Unknown',
            })),
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions,
        };
    } catch (error) {
        throw new Error('Error fetching transactions: ' + error.message);
    }
};

// list by customer id
exports.listTransactionsByCustomer = async (customerId, page, limit, staffName) => {
    try {
        const query = { Customer: customerId };

        if (staffName) {
            query.Staff = { name: { $regex: staffName, $options: "i" } };
        }
        const transactions = await TransactionModel.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('Customer', 'name')
            .populate('Staff', 'name')
            .lean();

        const totalTransactions = await TransactionModel.countDocuments(query);

        return {
            transactionList: transactions.map(transaction => ({
                transactionId: transaction._id,
                totalAmount: transaction.totalAmount,
                purchaseDate: formatDate(transaction.purchaseDate),
                customerName: transaction.Customer ? transaction.Customer.name : 'Unknown',
                staffName: transaction.Staff ? transaction.Staff.name : 'Unknown',
            })),
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions,
        };
    } catch (error) {
        throw new Error('Error fetching transactions by customer: ' + error.message);
    }
};

//list by staff id
exports.listTransactionsByStaff = async (staffId, page, limit) => {
    try {
        const transactions = await TransactionModel.find({ Staff: staffId })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate('Customer', 'name')
            .populate('Staff', 'name')
            .lean();

        const totalTransactions = await TransactionModel.countDocuments({ Staff: staffId });

        return {
            transactionList: transactions.map(transaction => ({
                transactionId: transaction._id,
                totalAmount: transaction.totalAmount,
                purchaseDate: formatDate(transaction.purchaseDate),
                customerName: transaction.Customer ? transaction.Customer.name : 'Unknown',
                staffName: transaction.Staff ? transaction.Staff.name : 'Unknown',
            })),
            currentPage: page,
            totalPages: Math.ceil(totalTransactions / limit),
            totalTransactions,
        };
    } catch (error) {
        throw new Error('Error fetching transactions by staff: ' + error.message);
    }
};

exports.createTransaction = async (staffId, customerId, transactionInfo) => {
    try {
        const customerExists = await Customer.exists({ _id: customerId });
        if (!customerExists) {
            throw new CustomError('Customer not found');
        }

        const staffExists = await Account.exists({ _id: staffId });
        if (!staffExists) {
            throw new CustomError('Staff not found');
        }

        transactionInfo.Customer = customerId;
        transactionInfo.Staff = staffId;
        transactionInfo.purchaseDate = new Date();
        transactionInfo.dueTo = new Date();
        transactionInfo.refund = 0;
        transactionInfo.totalAmount = 0;
        transactionInfo.amountPaid = 0;

        const newTransaction = new TransactionModel(transactionInfo);
        await newTransaction.save();

        const productTransactions = transactionInfo.productTransactions;

        for (const productTransactionInfo of productTransactions) {
            const variantExists = await Variant.findById(productTransactionInfo.variantId);
            if (!variantExists) {
                throw new CustomError('Variant not found');
            }
            console.log(productTransactionInfo)
            if (variantExists.quantityInStock < productTransactionInfo.quantity) {
                throw new CustomError('The quantity of product is not enough');
            }

            const totalPrice = productTransactionInfo.quantity * variantExists.retailPrice;

            const productTransaction = new ProductTransactionModel({
                ...productTransactionInfo,
                total: totalPrice,
                Variant: productTransactionInfo.variantId,
                Transaction: newTransaction._id
            });
            console.log(productTransaction)

            await VariantModel.incrementQuantitySold(variantExists._id, productTransactionInfo.quantity);
            await TransactionModel.incrementTotalAmount(newTransaction._id, totalPrice);
            await productTransaction.save();
        }

        return newTransaction;
    } catch (err) {
        throw new CustomError(err);
    }
};

exports.confirmTransaction = async (transactionId, amountPaid) => {
    try {
        const transaction = await TransactionModel.findById(transactionId);

        if (!transaction) {
            throw new CustomError('Transaction not found')
        }

        if (amountPaid < 0) {
            throw new CustomError('Amount paid must be positive')
        }

        if (amountPaid < transaction.totalAmount) {
            throw new CustomError('Amount paid must be greater than or equal total amount')
        }

        transaction.refund = amountPaid - transaction.totalAmount
        const updateData = {
            amountPaid: amountPaid,
            status: "PAID",
            refund: transaction.refund,
            purchaseDate: new Date()
        };

        return await TransactionModel.findByIdAndUpdate(transactionId, updateData, { new: true });
    } catch (err) {
        throw new CustomError(err)
    }
}

exports.getTransactionById = async (id) => { 
    try {
        const transaction = await TransactionModel.findById(id)
            .populate('Customer', 'name') 
            .populate('Staff', 'name')    
            .lean();

        if (!transaction) {
            throw new CustomError('Transaction not found');
        }

        const productTransactions = await ProductTransactionModel.find({ Transaction: id })
            .populate({
                path: 'Variant',
                select: 'retailPrice color ram storage images'
            })
            .lean();

        transaction.products = productTransactions.map((productTransaction) => ({
            productDetails: productTransaction.Variant,
            quantity: productTransaction.quantity,
            total: productTransaction.total
        }));

        transaction.staffName = transaction.Staff.name;
        transaction.purchaseDate = transaction.purchaseDate;

        delete transaction.Staff;

        return transaction;
    } catch (err) {
        throw new CustomError(err.message);
    }
};

exports.addProductToTransaction = async (transactionId, variantId, productTransactionInfo) => {
    try {
        const transactionExists = await Transaction.exists({ _id: transactionId })
        if (!transactionExists) {
            throw new CustomError('Transaction not found')
        }

        const variantExists = await Variant.findById(variantId);
        if (!variantExists) {
            throw new CustomError('Variant not found')
        }

        if(variantExists.quantityInStock < productTransactionInfo.quantity){
            throw new CustomError('The quantity of product are not enough')
        }

        const totalPrice = productTransactionInfo.quantity * variantExists.retailPrice;

        const productTransaction = new ProductTransactionModel({
            ...productTransactionInfo,
            total: totalPrice,
            Variant: variantId,
            Transaction: transactionId
        })

        await VariantModel.incrementQuantitySold(variantExists._id, productTransactionInfo.quantity)
        await TransactionModel.incrementTotalAmount(transactionId, totalPrice);
        return await productTransaction.save()
    } catch (err) {
        throw new CustomError(err)
    }

}

exports.removeFromTransaction = async (productTransactionId) => {
    try {
        const productTransaction = await ProductTransaction.findById(productTransactionId);

        if (!productTransaction) {
            throw new CustomError('Product Transaction not found')
        }

        const transaction = await Transaction.findById(productTransaction.Transaction);

        if (!transaction) {
            throw new CustomError('Transaction not found')
        }
        await VariantModel.decrementQuantitySold(productTransaction.Variant, productTransaction.quantity)
        await TransactionModel.decrementTotalAmount(productTransaction.Transaction, productTransaction.total)
        await ProductTransaction.deleteOne({ _id: productTransactionId })
    } catch (err) {

        throw new CustomError(err)
    }

}

exports.updateProductTransaction = async (productTransactionId, quantity) => {
    try {
        if (quantity <= 0) {
            throw new CustomError("Quantity must be a positive number")
        }

        const productTransaction = await ProductTransaction.findById(productTransactionId);
        if (!productTransaction) {
            throw new CustomError("Product Transaction not found")
        }

        const variant = await Variant.findById(productTransaction.Variant)
        if (!variant) {
            throw new CustomError("Variant not found")
        }

        const newtotalPrice = quantity * variant.retailPrice
        const oldTotal = productTransaction.total
        console.log(productTransaction.Transaction)
        const transaction = await Transaction.findById(productTransaction.Transaction)
        console.log(transaction)
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        const updatedTotalAmount = transaction.totalAmount - oldTotal + newtotalPrice
        await VariantModel.updateQuantitySold(productTransaction.Variant, productTransaction.quantity, quantity)
        await Transaction.findByIdAndUpdate(productTransaction.Transaction, {
            totalAmount: updatedTotalAmount
        })

        const updatedData = {
            quantity: quantity,
            total: newtotalPrice
        }

        return await ProductTransaction.findByIdAndUpdate(productTransactionId, updatedData, { new: true })

    } catch (err) {
        throw new CustomError(err)
    }
}
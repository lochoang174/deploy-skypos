var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Register Account and Customer models before using them
const Account = require('./Account');
const Customer = require('./Customer');
const ProductTransaction = require('./ProductTransaction');

// Define the Transaction schema
var TransactionSchema = new Schema({
  totalAmount: {
    type: Number,
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  purchaseDate: {
    type: Date,
    required: true
  },
  Customer: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Customer",
  },
  Staff: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Account",
  },
  refund: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  statics: {
    async createTransaction(staffId, customerId, transactionInfo) {
      const Customer = mongoose.model('Customer');
      const customerExists = await Customer.exists({ _id: customerId });

      if (!customerExists) {
        throw new Error('Customer not found');
      }

      const Staff = mongoose.model('Account');
      const staffExists = await Staff.exists({ _id: staffId });

      if (!staffExists) {
        throw new Error('Staff not found');
      }

      transactionInfo.Customer = customerId;
      transactionInfo.Staff = staffId;
      transactionInfo.purchaseDate = new Date();
      transactionInfo.dueTo = new Date();
      transactionInfo.refund = 0;
      transactionInfo.totalAmount = 0;
      transactionInfo.amountPaid = 0;

      const Transaction = mongoose.model('Transaction');
      const newTransaction = new Transaction(transactionInfo);

      return await newTransaction.save();
    },

    async getTransactionById(transactionId) {
      const transaction = await this.findById(transactionId).populate('Customer').populate('Staff').lean();
      if (!transaction) {
        throw new Error("Transaction not found")
      }
      const product = await ProductTransaction.find({ Transaction: transactionId }).populate('Variant').lean();
      transaction.productTransaction = product
      return transaction
    },

    async confirmTransaction(transactionId, amountPaid) {
      const transaction = await this.findById(transactionId);
      if (amountPaid < 0) {
        throw new Error("Amountpaid must be not negative");
      }
      if (amountPaid < transaction.totalAmount) {
        throw new Error("Amountpaid must be greater than or equal totalAmount")
      }
      transaction.refund = amountPaid - transaction.totalAmount;
      const updateData = {
        amountPaid: amountPaid,
        status: "PAID",
        refund: transaction.refund,
        purchaseDate: new Date()
      };

      return await this.findByIdAndUpdate(transactionId, updateData, { new: true });
    },

    async deleteTransaction(transactionId) {
      return await this.findByIdAndDelete(transactionId);
    },
    // static helper
    async incrementTotalAmount(transactionId, amount) {
      return await this.findByIdAndUpdate(transactionId, {
        $inc: { totalAmount: amount }
      });
    },
    async decrementTotalAmount(transactionId, amount) {
      return await this.findByIdAndUpdate(transactionId, {
        $inc: { totalAmount: -amount }
      });
    },
    async findTransactionsByDateRange(startDate, endDate) {
      return await this.find({
        purchaseDate: {
          $gte: startDate,
          $lte: endDate
        }
      });
    }

  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);

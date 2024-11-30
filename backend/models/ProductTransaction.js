var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const Variant = require('./Variant');
const Transaction = require('./Transaction');
const Customer = require('./Customer');

var ProductTransactionSchema = new Schema({
  quantity: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  Variant: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Variant'
  },
  Transaction: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Transaction'
  }
}, {
  statics: {
    async getProductTransactionsByTransaction(transactionId) {
      return await this.find({ Transaction: transactionId }).populate('Variant');
    },

    async getDetailById(id) {
      return await this.findById(id).populate('Customer').populate('Staff').lean();
    },
  }
});
module.exports = mongoose.model("ProductTransaction", ProductTransactionSchema);

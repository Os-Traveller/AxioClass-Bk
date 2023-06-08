const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  trxId: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now() },
  amount: { type: Number, required: true },
  id: { type: String, required: true },
  name: { type: String, required: true },
  dept: { type: String, required: true },
  intake: { type: String, required: true },
});

module.exports = mongoose.model('transaction', transactionSchema);

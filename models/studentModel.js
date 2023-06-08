const mongoose = require('mongoose');

const transactionSubSchema = new mongoose.Schema({
  trxId: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now() },
});

const StudentSchema = new mongoose.Schema({
  id: { type: String, unique: true, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
  birthPlace: { type: String },
  guardianName: { type: String, required: true },
  guardianNumber: { type: String, required: true },
  address: { type: String, required: true },
  ssc: { type: Number, required: true },
  hsc: { type: Number, required: true },
  graduated: { type: Boolean, default: false },
  demand: { type: Number, required: true },
  paid: { type: Number, default: 0 },
  due: { type: Number, required: true },
  waiver: { type: Number, default: 0 },
  dept: { type: String, default: 'CSE' },
  currentSemester: { type: String, required: true },
  image: String,
  sex: { type: String, required: true, Option: 'male' | 'female' | 'other' },
  intake: { type: Number, required: true },
  password: { type: String, required: true },
  admissionDate: { type: Date, immutable: true, default: Date.now() },
  transactions: [transactionSubSchema],
});

module.exports = mongoose.model('student', StudentSchema);
